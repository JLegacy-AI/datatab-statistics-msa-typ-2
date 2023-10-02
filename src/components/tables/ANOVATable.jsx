import React from "react";
import { calculateTwoWayANOVA, convertToArray } from "../../utils/utils";

const ANOVATable = ({ data, selectedColumns }) => {
  const operator = convertToArray(
    data,
    selectedColumns["operatorValuesColumn"]
  );
  const part = convertToArray(data, selectedColumns["partsColumn"]);
  const measured = convertToArray(
    data,
    selectedColumns["measuredValuesColumn"]
  );

  const result = calculateTwoWayANOVA(data, operator, part, measured);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-xl font-semibold bg-black text-white  text-center">
          Two Factor ANOVA without Interaction
        </h3>
        <div className="w-full overflow-x-scroll">
          <table className="min-w-[700px]">
            <thead className="border-b-2 border-b-gray-300">
              <tr className="w-full py-2.5 ">
                <td>Source</td>
                <td>DF</td>
                <td>SS</td>
                <td>MS</td>
                <td>F</td>
                <td>P</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Part</td>
                <td>{result["DF_A"]}</td>
                <td>
                  {typeof result["SS_A"] == "number"
                    ? result["SS_A"].toFixed(5)
                    : result["SS_A"]}
                </td>
                <td>
                  {typeof result["MS_A"] == "number"
                    ? result["MS_A"].toFixed(5)
                    : result["MS_A"]}
                </td>
                <td>
                  {typeof result["F_A"] == "number"
                    ? result["F_A"].toFixed(5)
                    : result["F_A"]}
                </td>
                <td>
                  {typeof result["P_A"] == "number"
                    ? result["P_A"].toFixed(5)
                    : result["P_A"]}
                </td>
              </tr>
              <tr>
                <td>Operator</td>
                <td>{result["DF_B"]}</td>
                <td>
                  {typeof result["SS_B"] == "number"
                    ? result["SS_B"].toFixed(5)
                    : result["SS_B"]}
                </td>
                <td>
                  {typeof result["MS_B"] == "number"
                    ? result["MS_B"].toFixed(5)
                    : result["MS_B"]}
                </td>
                <td>
                  {typeof result["F_B"] == "number"
                    ? result["F_B"].toFixed(5)
                    : result["F_B"]}
                </td>
                <td>
                  {typeof result["P_B"] == "number"
                    ? result["P_B"].toFixed(5)
                    : result["P_B"]}
                </td>
              </tr>
              <tr>
                <td>Repeatability</td>
                <td>{result["DF_error"]}</td>

                <td>
                  {typeof result["SS_error"] == "number"
                    ? result["SS_error"].toFixed(5)
                    : result["SS_error"]}
                </td>
                <td>
                  {typeof result["MS_error"] == "number"
                    ? result["MS_error"].toFixed(5)
                    : result["MS_error"]}
                </td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{result["DF_total"]}</td>
                <td>
                  {typeof result["SS_Total"] == "number"
                    ? result["SS_Total"].toFixed(5)
                    : result["SS_Total"]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ANOVATable;
