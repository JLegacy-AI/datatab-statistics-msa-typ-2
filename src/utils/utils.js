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

  // Calculate the degrees of freedom for error (DF_error)
  const DF_error = DF_total - DF_A - DF_B;

  const SS_A = calculateSumOfSquares(factorA, measured);

  // Calculate the sum of squares for Factor B (SS_B)
  const SS_B = calculateSumOfSquares(factorB, measured);

  // Calculate the sum of squares for error (SS_error)
  const SS_error = SST - SS_A - SS_B;

  // Calculate the mean square for Factor A (MS_A)
  const MS_A = SS_A / DF_A;

  // Calculate the mean square for Factor B (MS_B)
  const MS_B = SS_B / DF_B;

  // Calculate the mean square for error (MS_error)
  const MS_error = SS_error / DF_error;

  // Calculate the F-statistic for Factor A (F_A)
  const F_A = MS_A / MS_error;

  // Calculate the F-statistic for Factor B (F_B)
  const F_B = MS_B / MS_error;

  // Calculate the p-value for Factor A (P_A)
  const P_A = 1 - jStat.centralF.cdf(F_A, DF_A, DF_error);

  // Calculate the p-value for Factor B (P_B)
  const P_B = 1 - jStat.centralF.cdf(F_B, DF_B, DF_error);

  return {
    DF_total,
    DF_A,
    DF_B,
    DF_error,
    SS_A,
    SS_B,
    SS_error,
    SS_Total: SST, // Include SS_Total
    MS_A,
    MS_B,
    MS_error,
    F_A,
    F_B,
    P_A,
    P_B,
  };
}

const calculateSumOfSquares = (factorA, measurement) => {
  const uniqueLevels = [...new Set(factorA)];
  const measurementGroups = uniqueLevels.map((level, index) => {
    const group = measurement.filter((value, index) => {
      return factorA[index] === level;
    });
    return group;
  });

  const measuredGroupMean = measurementGroups.map((group, index) => {
    return jStat.mean(group);
  });
  const overallMean = jStat.mean(measuredGroupMean);
  const SS = measuredGroupMean.map((value, i) => {
    return measurementGroups[i].length * Math.pow(value - overallMean, 2);
  });

  return jStat.sum(SS);
};

export const calculatePartToPartVariation = (factorA, measured) => {
  const grandMean = calculateGrandMean(measured);
  const uniqueLevels = [...new Set(factorA)];
  const measurementGroups = uniqueLevels.map((level, index) => {
    const group = measured.filter((value, index) => {
      return factorA[index] === level;
    });
    return group;
  });

  const measuredGroupMean = measurementGroups.map((group, index) => {
    return jStat.mean(group);
  });
  const VV = measuredGroupMean.map((value, i) => {
    return measurementGroups[i].length * Math.pow(value - grandMean, 2);
  });

  return jStat.mean(VV) / (measurementGroups.length - 1);
};

function calculateGrandMean(measurements) {
  const sum = measurements.reduce(
    (accumulator, measurement) => accumulator + measurement,
    0
  );
  const grandMean = sum / measurements.length;

  return grandMean;
}

export const varianceComponent = (operator, part, measurement, tolerance) => {
  let result = {
    Repeatability: {
      VarComp: 0,
      "% Contribution (of VarComp)": 0,
      stdDev: 0,
      "Study Variance (6xSD)": 0,
      "% Study Variance (%SV)": 0,
      "% Tolerance (SV/Tol)": 0,
    },
    Reproducibility: {
      VarComp: 0,
      "% Contribution (of VarComp)": 0,
      stdDev: 0,
      "Study Variance (6xSD)": 0,
      "% Study Variance (%SV)": 0,
      "% Tolerance (SV/Tol)": 0,
    },
    Operator: {
      VarComp: 0,
      "% Contribution (of VarComp)": 0,
      stdDev: 0,
      "Study Variance (6xSD)": 0,
      "% Study Variance (%SV)": 0,
      "% Tolerance (SV/Tol)": 0,
    },
    "Part to Part": {
      VarComp: 0,
      "% Contribution (of VarComp)": 0,
      stdDev: 0,
      "Study Variance (6xSD)": 0,
      "% Study Variance (%SV)": 0,
      "% Tolerance (SV/Tol)": 0,
    },
    "Total Variation": {
      VarComp: 0,
      "% Contribution (of VarComp)": 0,
      stdDev: 0,
      "Study Variance (6xSD)": 0,
      "% Study Variance (%SV)": 0,
      "% Tolerance (SV/Tol)": 0,
    },
    "Total Gage R&R": {
      VarComp: 0,
      "% Contribution (of VarComp)": 0,
      stdDev: 0,
      "Study Variance (6xSD)": 0,
      "% Study Variance (%SV)": 0,
      "% Tolerance (SV/Tol)": 0,
    },
  };

  // VarComp Measurement
  result["Repeatability"]["VarComp"] = calculateRepeatability(
    operator,
    part,
    measurement
  );
  result["Operator"]["VarComp"] = calculatePartToPartVariation(
    operator,
    measurement
  );

  result["Reproducibility"]["VarComp"] =
    result["Operator"]["VarComp"] + partToOperator(part, operator, measurement);
  result["Total Gage R&R"]["VarComp"] =
    result["Reproducibility"]["VarComp"] + result["Repeatability"]["VarComp"];
  result["Part to Part"]["VarComp"] = calculatePartToPartVariation(
    part,
    measurement
  );
  result["Total Variation"]["VarComp"] =
    result["Part to Part"]["VarComp"] + result["Total Gage R&R"]["VarComp"];

  // % Variance Component
  result["Total Gage R&R"]["% Contribution (of VarComp)"] =
    (result["Total Gage R&R"]["VarComp"] /
      result["Total Variation"]["VarComp"]) *
    100;
  result["Operator"]["% Contribution (of VarComp)"] =
    (result["Operator"]["VarComp"] / result["Total Variation"]["VarComp"]) *
    100;
  result["Repeatability"]["% Contribution (of VarComp)"] =
    (result["Repeatability"]["VarComp"] /
      result["Total Variation"]["VarComp"]) *
    100;
  result["Reproducibility"]["% Contribution (of VarComp)"] =
    (result["Reproducibility"]["VarComp"] /
      result["Total Variation"]["VarComp"]) *
    100;
  result["Part to Part"]["% Contribution (of VarComp)"] =
    (result["Part to Part"]["VarComp"] / result["Total Variation"]["VarComp"]) *
    100;
  result["Total Variation"]["% Contribution (of VarComp)"] =
    (result["Total Variation"]["VarComp"] /
      result["Total Variation"]["VarComp"]) *
    100;

  //standard Deviation
  result["Total Gage R&R"]["stdDev"] = Math.sqrt(
    result["Total Gage R&R"]["VarComp"]
  );
  result["Operator"]["stdDev"] = Math.sqrt(result["Operator"]["VarComp"]);
  result["Repeatability"]["stdDev"] = Math.sqrt(
    result["Total Gage R&R"]["VarComp"]
  );
  result["Reproducibility"]["stdDev"] = Math.sqrt(
    result["Reproducibility"]["VarComp"]
  );
  result["Total Variation"]["stdDev"] = Math.sqrt(
    result["Total Variation"]["VarComp"]
  );
  result["Part to Part"]["stdDev"] = Math.sqrt(
    result["Total Gage R&R"]["VarComp"]
  );

  // Study Variance
  result["Total Gage R&R"]["Study Variance (6xSD)"] =
    6 * result["Total Gage R&R"]["stdDev"];
  result["Operator"]["Study Variance (6xSD)"] =
    6 * result["Operator"]["stdDev"];
  result["Repeatability"]["Study Variance (6xSD)"] =
    6 * result["Repeatability"]["stdDev"];
  result["Reproducibility"]["Study Variance (6xSD)"] =
    6 * result["Reproducibility"]["stdDev"];
  result["Part to Part"]["Study Variance (6xSD)"] =
    6 * result["Part to Part"]["stdDev"];
  result["Total Variation"]["Study Variance (6xSD)"] =
    6 * result["Total Variation"]["stdDev"];

  // % Study Variance
  result["Total Gage R&R"]["% Study Variance (%SV)"] =
    (result["Total Gage R&R"]["Study Variance (6xSD)"] /
      result["Total Variation"]["Study Variance (6xSD)"]) *
    100;
  result["Operator"]["% Study Variance (%SV)"] =
    (result["Operator"]["Study Variance (6xSD)"] /
      result["Total Variation"]["Study Variance (6xSD)"]) *
    100;
  result["Repeatability"]["% Study Variance (%SV)"] =
    (result["Total Gage R&R"]["Study Variance (6xSD)"] /
      result["Total Variation"]["Study Variance (6xSD)"]) *
    100;
  result["Reproducibility"]["% Study Variance (%SV)"] =
    (result["Reproducibility"]["Study Variance (6xSD)"] /
      result["Total Variation"]["Study Variance (6xSD)"]) *
    100;
  result["Part to Part"]["% Study Variance (%SV)"] =
    (result["Part to Part"]["Study Variance (6xSD)"] /
      result["Total Variation"]["Study Variance (6xSD)"]) *
    100;
  result["Total Variation"]["% Study Variance (%SV)"] =
    (result["Total Variation"]["Study Variance (6xSD)"] /
      result["Total Variation"]["Study Variance (6xSD)"]) *
    100;

  // % Tolerance
  result["Operator"]["% Tolerance (SV/Tol)"] =
    result["Operator"]["Study Variance (6xSD)"] / (tolerance / 100);
  result["Repeatability"]["% Tolerance (SV/Tol)"] =
    result["Repeatability"]["Study Variance (6xSD)"] / (tolerance / 100);
  result["Reproducibility"]["% Tolerance (SV/Tol)"] =
    result["Reproducibility"]["Study Variance (6xSD)"] / (tolerance / 100);
  result["Part to Part"]["% Tolerance (SV/Tol)"] =
    result["Part to Part"]["Study Variance (6xSD)"] / (tolerance / 100);
  result["Total Gage R&R"]["% Tolerance (SV/Tol)"] =
    result["Total Gage R&R"]["Study Variance (6xSD)"] / (tolerance / 100);
  result["Total Variation"]["% Tolerance (SV/Tol)"] =
    result["Total Variation"]["Study Variance (6xSD)"] / (tolerance / 100);

  return result;
};

const calculateRepeatability = (operator, part, measurement) => {
  const N = measurement.length;

  const grandMean = measurement.reduce((sum, value) => sum + value, 0) / N;
  const SST = measurement.reduce(
    (sum, value) => sum + Math.pow(value - grandMean, 2),
    0
  );

  const SS_A = calculateSumOfSquares(operator, measurement);

  const SS_B = calculateSumOfSquares(part, measurement);

  return SST - SS_A - SS_B;
};

const partToOperator = (operator, part, measurement) => {
  const uniquenessPart = [...new Set(part)];
  const uniquenessOperator = [...new Set(operator)];

  const measurementsGroups = uniquenessPart.map((levelA, ind) => {
    return uniquenessOperator.map((levelB, index) => {
      return measurement.filter(
        (value, i) => part[i] === levelA && operator[i] === levelB
      );
    });
  });

  return (
    jStat.mean(
      measurementsGroups.map((value, ind) => {
        return jStat.mean(
          value.map((va) => {
            return jStat.mean(va);
          })
        );
      })
    ) / measurementsGroups.length
  );
};
