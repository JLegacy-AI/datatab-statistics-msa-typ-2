import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { convertToArray, customGageRR } from "../../utils/utils";

const ComponentVariationChart = ({ data, selectedColumns, k, LSL, USL }) => {
  const operator = convertToArray(
    data,
    selectedColumns["operatorValuesColumn"]
  );
  const part = convertToArray(data, selectedColumns["partsColumn"]);
  const measured = convertToArray(
    data,
    selectedColumns["measuredValuesColumn"]
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update the window width when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const result = customGageRR(part, operator, measured, k, USL - LSL);

  const data2 = [
    {
      x: ["R&R ( Gesamt )", "Wiederholbarkeit", "Reproduzierbarkeit", "Zwischen den Teilen"],
      y: [
        result["Total Gage R&R"]["% Contribution (of VarComp)"],
        result["Repeatability"]["% Contribution (of VarComp)"],
        result["Reproducibility"]["% Contribution (of VarComp)"],
        result["Part to Part"]["% Contribution (of VarComp)"],
      ],
      name: "% Beitrag",
      type: "bar",
    },
    {
      x: ["R&R ( Gesamt )", "Wiederholbarkeit", "Reproduzierbarkeit", "Zwischen den Teilen"],
      y: [
        result["Total Gage R&R"]["% Study Variance (%SV)"],
        result["Repeatability"]["% Study Variance (%SV)"],
        result["Reproducibility"]["% Study Variance (%SV)"],
        result["Part to Part"]["% Study Variance (%SV)"],
      ],
      name: "% Streu. in Unters.",
      type: "bar",
    },
    {
      x: ["R&R ( Gesamt )", "Wiederholbarkeit", "Reproduzierbarkeit", "Zwischen den Teilen"],
      y: [
        result["Total Gage R&R"]["% Tolerance (SV/Tol)"],
        result["Repeatability"]["% Tolerance (SV/Tol)"],
        result["Reproducibility"]["% Tolerance (SV/Tol)"],
        result["Part to Part"]["% Tolerance (SV/Tol)"],
      ],
      name: "% Toleranz",
      type: "bar",
    },
  ];

  const layout = {
    title: "Komponenten der Varianz",
    barmode: "group",
  };

  // Determine the chart width based on the window width
  const chartWidth = windowWidth > 768 ? 800 : windowWidth - 20;

  return (
    <div className="flex justify-center items-center flex-col">
      <Plot
        data={data2}
        layout={{
          ...layout,
          width: chartWidth < 300 ? 300 : chartWidth,
          height: chartWidth * 0.5 < 300 ? 300 : chartWidth * 0.5,
        }}
        config={{
          displayModeBar: false,
        }}
      />
    </div>
  );
};

export default ComponentVariationChart;
