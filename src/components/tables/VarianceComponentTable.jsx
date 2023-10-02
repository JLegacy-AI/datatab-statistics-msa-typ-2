import React, { useCallback } from "react";
import { convertToArray, varianceComponent } from "../../utils/utils";

const VarianceComponentTable = ({ data, selectedColumns, LSL, USL }) => {
  const operator = convertToArray(
    data,
    selectedColumns["operatorValuesColumn"]
  );
  const part = convertToArray(data, selectedColumns["partsColumn"]);
  const measured = convertToArray(
    data,
    selectedColumns["measuredValuesColumn"]
  );

  const numberFormat = useCallback((number) => {
    return typeof number === "number" ? number.toFixed(5) : number;
  }, []);

  const result = varianceComponent(operator, part, measured, USL - LSL);

  return (
    <div>
      <div className="grid grid-cols-1">
        <h3 className="text-xl min-w-[400px] max-w-[600px] font-semibold bg-black text-white  text-center">
          Variance Components
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <table className="min-w-[400px] max-w-[600px]">
            <thead className="border-b-2 border-b-gray-300">
              <tr className="w-full py-2.5 ">
                <td>Source</td>
                <td>VarComp</td>
                <td>% Contribution</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Gage R&R</td>
                <td>{numberFormat(result["Total Gage R&R"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Total Gage R&R"]["% Contribution (of VarComp)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Repeatability</td>{" "}
                <td>{numberFormat(result["Repeatability"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Repeatability"]["% Contribution (of VarComp)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Reproducibility</td>
                <td>{numberFormat(result["Reproducibility"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Reproducibility"]["% Contribution (of VarComp)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Operator</td>
                <td>{numberFormat(result["Operator"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Operator"]["% Contribution (of VarComp)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Part to Part</td>
                <td>{numberFormat(result["Part to Part"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Part to Part"]["% Contribution (of VarComp)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Total Variation</td>
                <td>{numberFormat(result["Total Variation"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Total Variation"]["% Contribution (of VarComp)"]
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold bg-black text-white  text-center">
          Gage Evalutation
        </h3>
        <div className="overflow-x-scroll">
          <table className="min-w-[700px] ">
            <thead className="border-b-2 border-b-gray-300">
              <tr className="w-full py-2.5 ">
                <td>Source</td>
                <td>StdDev</td>
                <td>Study Var.</td>
                <td>% Study Var.</td>
                <td>%Tolerance</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Gage R&R</td>

                <td>{numberFormat(result["Total Gage R&R"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Total Gage R&R"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Total Gage R&R"]["% Study Variance (%SV)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Total Gage R&R"]["% Tolerance (SV/Tol)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Repeatability</td>{" "}
                <td>{numberFormat(result["Repeatability"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Repeatability"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Repeatability"]["% Study Variance (%SV)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Repeatability"]["% Tolerance (SV/Tol)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Reproducibility</td>

                <td>{numberFormat(result["Reproducibility"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Reproducibility"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Reproducibility"]["% Study Variance (%SV)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Reproducibility"]["% Tolerance (SV/Tol)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Operator</td>

                <td>{numberFormat(result["Operator"]["stdDev"])}</td>
                <td>
                  {numberFormat(result["Operator"]["Study Variance (6xSD)"])}
                </td>
                <td>
                  {numberFormat(result["Operator"]["% Study Variance (%SV)"])}
                </td>
                <td>
                  {numberFormat(result["Operator"]["% Tolerance (SV/Tol)"])}
                </td>
              </tr>
              <tr>
                <td>Part to Part</td>

                <td>{numberFormat(result["Part to Part"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Part to Part"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Part to Part"]["% Study Variance (%SV)"]
                  )}
                </td>
                <td>
                  {numberFormat(result["Part to Part"]["% Tolerance (SV/Tol)"])}
                </td>
              </tr>
              <tr>
                <td>Total Variation</td>

                <td>{numberFormat(result["Total Variation"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Total Variation"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Total Variation"]["% Study Variance (%SV)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Total Variation"]["% Tolerance (SV/Tol)"]
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VarianceComponentTable;
