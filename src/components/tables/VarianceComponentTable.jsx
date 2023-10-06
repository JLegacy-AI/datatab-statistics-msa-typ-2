import React, { useCallback } from "react";
import {
  customGageRR,
  convertToArray,
  varianceComponent,
} from "../../utils/utils";

const VarianceComponentTable = ({ data, selectedColumns, LSL, USL, k }) => {
  const operator = convertToArray(
    data,
    selectedColumns["operatorValuesColumn"]
  );
  const part = convertToArray(data, selectedColumns["partsColumn"]);
  const measured = convertToArray(
    data,
    selectedColumns["measuredValuesColumn"]
  );

  const numberFormat = useCallback((number, isPercent) => {
    return typeof number === "number"
      ? isPercent
        ? number.toFixed(2)
        : number.toFixed(7)
      : number;
  }, []);

  const result = customGageRR(part, operator, measured, k, USL - LSL);

  return (
    <div>
      <div className="grid grid-cols-1">
        <h3 className="text-xl min-w-[400px] max-w-[600px] font-semibold bg-black text-white  text-center">
          Varianzkomponenten
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <table className="min-w-[400px] max-w-[600px]">
            <thead className="border-b-2 border-b-gray-300">
              <tr className="w-full py-2.5 ">
                <td>Quelle</td>
                <td>VarKomp</td>
                <td>% Beitrag</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>R&R ( Gesamt )</td>
                <td>{numberFormat(result["Total Gage R&R"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Total Gage R&R"]["% Contribution (of VarComp)"],
                    true
                  )}
                </td>
              </tr>
              <tr>
                <td>Wiederholbarkeit</td>
                <td>{numberFormat(result["Repeatability"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Repeatability"]["% Contribution (of VarComp)"],
                    true
                  )}
                </td>
              </tr>
              <tr>
                <td>Reproduzierbarkeit</td>
                <td>{numberFormat(result["Reproducibility"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Reproducibility"]["% Contribution (of VarComp)"],
                    true
                  )}
                </td>
              </tr>
              <tr>
                <td>Prüfer</td>
                <td>{numberFormat(result["Operator"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Operator"]["% Contribution (of VarComp)"],
                    true
                  )}
                </td>
              </tr>
              <tr>
                <td>Zwischen den Teilen</td>
                <td>{numberFormat(result["Part to Part"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Part to Part"]["% Contribution (of VarComp)"],
                    true
                  )}
                </td>
              </tr>
              <tr>
                <td>Gesamtstreuung</td>
                <td>{numberFormat(result["Total Variation"]["VarComp"])}</td>
                <td>
                  {numberFormat(
                    result["Total Variation"]["% Contribution (of VarComp)"],
                    true
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold bg-black text-white  text-center">
          Beurteilung Messprozess
        </h3>
        <div className="overflow-x-scroll">
          <table className="min-w-[700px] ">
            <thead className="border-b-2 border-b-gray-300">
              <tr className="w-full py-2.5 ">
                <td>Quelle</td>
                <td>StdAbw</td>
                <td>Streu. in Unters. {`${k} x SA`}</td>
                <td>% Streu. in Unters.</td>
                <td>% Toleranz</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>R&R ( Gesamt )</td>

                <td>{numberFormat(result["Total Gage R&R"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Total Gage R&R"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Total Gage R&R"]["% Study Variance (%SV)"],
                    true
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Total Gage R&R"]["% Tolerance (SV/Tol)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Wiederholbarkeit</td>{" "}
                <td>{numberFormat(result["Repeatability"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Repeatability"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Repeatability"]["% Study Variance (%SV)"],
                    true
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Repeatability"]["% Tolerance (SV/Tol)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Reproduzierbarkeit</td>

                <td>{numberFormat(result["Reproducibility"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Reproducibility"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Reproducibility"]["% Study Variance (%SV)"],
                    true
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Reproducibility"]["% Tolerance (SV/Tol)"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Prüfer</td>

                <td>{numberFormat(result["Operator"]["stdDev"])}</td>
                <td>
                  {numberFormat(result["Operator"]["Study Variance (6xSD)"])}
                </td>
                <td>
                  {numberFormat(
                    result["Operator"]["% Study Variance (%SV)"],
                    true
                  )}
                </td>
                <td>
                  {numberFormat(result["Operator"]["% Tolerance (SV/Tol)"])}
                </td>
              </tr>
              <tr>
                <td>Zwischen den Teilen</td>

                <td>{numberFormat(result["Part to Part"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Part to Part"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Part to Part"]["% Study Variance (%SV)"],
                    true
                  )}
                </td>
                <td>
                  {numberFormat(result["Part to Part"]["% Tolerance (SV/Tol)"])}
                </td>
              </tr>
              <tr>
                <td>Gesamtstreuung</td>

                <td>{numberFormat(result["Total Variation"]["stdDev"])}</td>
                <td>
                  {numberFormat(
                    result["Total Variation"]["Study Variance (6xSD)"]
                  )}
                </td>
                <td>
                  {numberFormat(
                    result["Total Variation"]["% Study Variance (%SV)"],
                    true
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
