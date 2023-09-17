import jstat from "jStat";
import jStat from "jStat";
import * as XLSX from "xlsx";

export const initColumns = (data) => {
  const init = {
    measuredValuesColumn: [],
    operatorValuesColumn: [],
    partsColumn: [],
  };

  if (data.length <= 0) return init;

  let columns = 0;
  for (let i = 0; i < data[0].length; i++) {
    if (data[0][i] == "") {
      break;
    }
    columns++;
  }

  for (let i = 0; i < columns; i++) {
    if (typeof data[1][i] == "string" && isNaN(data[1][i])) {
      init["partsColumn"].push({
        name: data[0][i],
        number: i,
      });
      init["operatorValuesColumn"].push({
        name: data[0][i],
        number: i,
      });
    } else if (typeof data[1][i] == "number" && !isNaN(data[1][i])) {
      init["measuredValuesColumn"].push({
        name: data[0][i],
        number: i,
      });
    }
  }
  return init;
};

export const convertToArray = (data, column) => {
  let array = [];
  for (let i = 1; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (j === column && data[i][j] !== "" && data[i][j] !== null) {
        if (!isNaN(data[i][j])) {
          array.push(Number(data[i][j]));
        } else {
          array.push(data[i][j]);
        }
      }
    }
  }
  return array;
};

export const createInitialData = (data, rows, columns) => {
  const initialData = [];
  if (data.length < rows - 5)
    for (let i = 0; i < rows; i++) {
      const row = [];
      if (i < data.length) {
        row.push(...data[i]);
        row.push(
          ...Array.from(
            {
              length:
                data[i].length < columns - 5 ? columns - data[i].length : 5,
            },
            () => ""
          )
        );
      }
      row.push(...Array.from({ length: columns }, () => ""));
      initialData.push(row);
    }
  else {
    for (let i = 0; i < data.length; i++) {
      const row = [];
      if (i < data.length) {
        row.push(...data[i]);
        row.push(
          ...Array.from(
            {
              length:
                data[i].length < columns - 5 ? columns - data[i].length : 5,
            },
            () => ""
          )
        );
      }
      row.push(...Array.from({ length: columns }, () => ""));
      initialData.push(row);
    }

    for (let i = 0; i < 5; i++) {
      initialData.push(Array.from({ length: data[0].length }, () => ""));
    }
  }

  return initialData;
};

export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      parsedData = createInitialData(parsedData, 40, 26);
      resolve(parsedData);
    };

    reader.onerror = (event) => {
      reject(event.target.error);
    };

    reader.readAsBinaryString(file);
  });
};

export const handleClearTable = () => {
  let emptyData = [];
  for (let i = 0; i < 40; i++) {
    let row = [];
    for (let j = 0; j < 40; j++) {
      row.push("");
    }
    emptyData.push(row);
  }

  return emptyData;
};

export const canCalculate = (selectedColumns = {}) => {
  return Object.values(selectedColumns).every((value) => value >= 0);
};

export function calculateTwoWayANOVA(data, factorA, factorB, measured) {
  // Calculate the total number of observations (N)
  const N = measured.length;

  // Calculate the total sum of squares (SST)
  const grandMean = measured.reduce((sum, value) => sum + value, 0) / N;
  const SST = measured.reduce(
    (sum, value) => sum + Math.pow(value - grandMean, 2),
    0
  );

  // Calculate the degrees of freedom for total (DF_total)
  const DF_total = N - 1;

  // Calculate the number of unique levels for Factor A and Factor B
  const uniqueLevelsA = [...new Set(factorA)];
  const uniqueLevelsB = [...new Set(factorB)];

  // Calculate the degrees of freedom for Factor A (DF_A)
  const DF_A = uniqueLevelsA.length - 1;

  // Calculate the degrees of freedom for Factor B (DF_B)
  const DF_B = uniqueLevelsB.length - 1;

  // Calculate the degrees of freedom for the interaction (DF_interaction)
  const DF_interaction = DF_A * DF_B;

  // Calculate the degrees of freedom for error (DF_error)
  const DF_error = N - uniqueLevelsA.length - uniqueLevelsB.length + 1;

  const SS_A = uniqueLevelsA.reduce((sum, levelA) => {
    const groupValues = measured.filter(
      (value, index) => factorA[index] === levelA
    );

    const groupMean =
      groupValues.reduce((groupSum, groupValue) => groupSum + groupValue, 0) /
      groupValues.length;

    return (
      sum +
      groupValues.reduce(
        (groupSum, groupValue) =>
          groupSum + Math.pow(groupValue - groupMean, 2),
        0
      ) *
        groupValues.length
    );
  }, 0);

  // Calculate the sum of squares for Factor B (SS_B)
  const SS_B = uniqueLevelsB.reduce((sum, levelB) => {
    const groupValues = measured.filter(
      (value, index) => factorB[index] === levelB
    );
    const groupMean =
      groupValues.reduce((groupSum, groupValue) => groupSum + groupValue, 0) /
      groupValues.length;

    return (
      sum +
      groupValues.reduce(
        (groupSum, groupValue) =>
          groupSum + Math.pow(groupValue - groupMean, 2),
        0
      )
    );
  }, 0);

  // Calculate the sum of squares for the interaction (SS_interaction)
  const SS_interaction = SST - SS_A - SS_B;

  // Calculate the sum of squares for error (SS_error)
  const SS_error = SST - SS_A - SS_B - SS_interaction;

  // Calculate the Sum of Squares Total (SS_Total)
  const SS_Total = SST;

  // Calculate the mean square for Factor A (MS_A)
  const MS_A = SS_A / DF_A;

  // Calculate the mean square for Factor B (MS_B)
  const MS_B = SS_B / DF_B;

  // Calculate the mean square for the interaction (MS_interaction)
  const MS_interaction = SS_interaction / DF_interaction;

  // Calculate the mean square for error (MS_error)
  const MS_error = SS_error / DF_error;

  // Calculate the F-statistic for Factor A (F_A)
  const F_A = MS_A / MS_error;

  // Calculate the F-statistic for Factor B (F_B)
  const F_B = MS_B / MS_error;

  // Calculate the F-statistic for the interaction (F_interaction)
  const F_interaction = MS_interaction / MS_error;

  // Calculate the p-value for Factor A (P_A)
  const P_A = 1 - jStat.centralF.cdf(F_A, DF_A, DF_error);

  // Calculate the p-value for Factor B (P_B)
  const P_B = 1 - jStat.centralF.cdf(F_B, DF_B, DF_error);

  // Calculate the p-value for the interaction (P_interaction)
  const P_interaction =
    1 - jStat.centralF.cdf(F_interaction, DF_interaction, DF_error);

  return {
    DF_total,
    DF_A,
    DF_B,
    DF_interaction,
    DF_error,
    SS_A,
    SS_B,
    SS_interaction,
    SS_error,
    SS_Total, // Added SS_Total
    MS_A,
    MS_B,
    MS_interaction,
    MS_error,
    F_A,
    F_B,
    F_interaction,
    P_A,
    P_B,
    P_interaction,
  };
}

export function calculateGageRR(
  operatorData,
  partData,
  measurementData,
  tolerance
) {
  const n = measurementData.length;

  // Calculate overall mean
  const overallMean =
    measurementData.reduce((sum, value) => sum + value, 0) / n;

  // Calculate total variation
  const totalVariation = measurementData.reduce(
    (sum, value) => sum + Math.pow(value - overallMean, 2),
    0
  );

  // Initialize result object
  const results = {};

  // Calculate operator means and variances
  const operatorMeans = {};
  const operatorVariances = {};
  for (let i = 0; i < n; i++) {
    const operator = operatorData[i];
    const value = measurementData[i];

    if (!operatorMeans[operator]) {
      operatorMeans[operator] = value;
      operatorVariances[operator] = 0;
    } else {
      const prevMean = operatorMeans[operator];
      const prevVariance = operatorVariances[operator];
      const newMean = prevMean + (value - prevMean) / 2;
      operatorMeans[operator] = newMean;
      operatorVariances[operator] =
        prevVariance + (value - prevMean) * (value - newMean);
    }
  }

  // Calculate the average of operator variances
  const operatorVariancesArray = Object.values(operatorVariances);
  const averageOperatorVariance =
    operatorVariancesArray.reduce((sum, variance) => sum + variance, 0) /
    operatorVariancesArray.length;

  results.Operator = {
    VarComp: averageOperatorVariance,
  };

  // Calculate reproducibility variance
  const partMeans = {};
  const partVariances = {};
  for (let i = 0; i < n; i++) {
    const part = partData[i];
    const value = measurementData[i];

    if (!partMeans[part]) {
      partMeans[part] = value;
      partVariances[part] = 0;
    } else {
      const prevMean = partMeans[part];
      const prevVariance = partVariances[part];
      const newMean = prevMean + (value - prevMean) / 2;
      partMeans[part] = newMean;
      partVariances[part] =
        prevVariance + (value - prevMean) * (value - newMean);
    }
  }

  results["Part to Part"] = {
    VarComp:
      Object.values(partVariances).reduce(
        (sum, variance) => sum + variance,
        0
      ) / n,
  };

  // Calculate repeatability variance
  results.Repeatability = {
    VarComp: results.Operator.VarComp - results["Part to Part"].VarComp,
  };

  // Calculate total Gage R&R
  results["Total Gage R&R"] = {
    VarComp: results.Repeatability.VarComp + results["Part to Part"].VarComp,
  };

  // Calculate reproducibility variance
  results.Reproducibility = {
    VarComp: totalVariation - results.Operator.VarComp,
  };

  // Calculate percentages
  results.Operator["% Contribution (of VarComp)"] =
    (results.Operator.VarComp / totalVariation) * 100;
  results.Repeatability["% Contribution (of VarComp)"] =
    (results.Repeatability.VarComp / totalVariation) * 100;
  results["Part to Part"]["% Contribution (of VarComp)"] =
    (results["Part to Part"].VarComp / totalVariation) * 100;
  results["Total Gage R&R"]["% Contribution (of VarComp)"] =
    (results["Total Gage R&R"].VarComp / totalVariation) * 100;
  results.Reproducibility["% Contribution (of VarComp)"] =
    (results.Reproducibility.VarComp / totalVariation) * 100;

  // Calculate standard deviations
  results.Operator.stdDev = Math.sqrt(results.Operator.VarComp);
  results.Repeatability.stdDev = Math.sqrt(results.Repeatability.VarComp);
  results["Part to Part"].stdDev = Math.sqrt(results["Part to Part"].VarComp);
  results["Total Gage R&R"].stdDev = Math.sqrt(
    results["Total Gage R&R"].VarComp
  );
  results.Reproducibility.stdDev = Math.sqrt(results.Reproducibility.VarComp);

  // Calculate study variance
  results.Operator["Study Variance (6xSD)"] = 6 * results.Operator.stdDev;
  results.Repeatability["Study Variance (6xSD)"] =
    6 * results.Repeatability.stdDev;
  results["Part to Part"]["Study Variance (6xSD)"] =
    6 * results["Part to Part"].stdDev;
  results["Total Gage R&R"]["Study Variance (6xSD)"] =
    6 * results["Total Gage R&R"].stdDev;
  results.Reproducibility["Study Variance (6xSD)"] =
    6 * results.Reproducibility.stdDev;

  // Calculate percentage study variance
  results.Operator["% Study Variance (%SV)"] =
    (results.Operator["Study Variance (6xSD)"] / totalVariation) * 100;
  results.Repeatability["% Study Variance (%SV)"] =
    (results.Repeatability["Study Variance (6xSD)"] / totalVariation) * 100;
  results["Part to Part"]["% Study Variance (%SV)"] =
    (results["Part to Part"]["Study Variance (6xSD)"] / totalVariation) * 100;
  results["Total Gage R&R"]["% Study Variance (%SV)"] =
    (results["Total Gage R&R"]["Study Variance (6xSD)"] / totalVariation) * 100;
  results.Reproducibility["% Study Variance (%SV)"] =
    (results.Reproducibility["Study Variance (6xSD)"] / totalVariation) * 100;

  // Calculate percentage tolerance (SV/Tol)
  results.Operator["% Tolerance (SV/Tol)"] =
    (results.Operator["Study Variance (6xSD)"] / tolerance) * 100;
  results.Repeatability["% Tolerance (SV/Tol)"] =
    (results.Repeatability["Study Variance (6xSD)"] / tolerance) * 100;
  results["Part to Part"]["% Tolerance (SV/Tol)"] =
    (results["Part to Part"]["Study Variance (6xSD)"] / tolerance) * 100;
  results["Total Gage R&R"]["% Tolerance (SV/Tol)"] =
    (results["Total Gage R&R"]["Study Variance (6xSD)"] / tolerance) * 100;
  results.Reproducibility["% Tolerance (SV/Tol)"] =
    (results.Reproducibility["Study Variance (6xSD)"] / tolerance) * 100;

  // Calculate Total Variation
  results["Total Variation"] = {
    VarComp: totalVariation,
    "% Contribution (of VarComp)": (totalVariation / totalVariation) * 100,
    stdDev: Math.sqrt(totalVariation),
    "Study Variance (6xSD)": 6 * Math.sqrt(totalVariation),
    "% Study Variance (%SV)": 100, // Total Variation always 100%
    "% Tolerance (SV/Tol)": ((6 * Math.sqrt(totalVariation)) / tolerance) * 100,
  };

  return results;
}
