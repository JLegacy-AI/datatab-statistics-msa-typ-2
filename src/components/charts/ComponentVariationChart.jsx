import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { convertToArray, customGageRR } from "../../utils/utils";

const ComponentVariationChart = ({ data, selectedColumns }) => {
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

  const result = customGageRR(operator, part, measured, 20);

  const data2 = [
    {
      x: ["Gage R&R", "Repeat", "Reprod", "Part to Part"],
      y: [
        result["Total Gage R&R"]["% Contribution (of VarComp)"],
        result["Repeatability"]["% Contribution (of VarComp)"],
        result["Reproducibility"]["% Contribution (of VarComp)"],
        result["Part to Part"]["% Contribution (of VarComp)"],
      ],
      name: "% Contribution",
      type: "bar",
    },
    {
      x: ["Gage R&R", "Repeat", "Reprod", "Part to Part"],
      y: [
        result["Total Gage R&R"]["% Study Variance (%SV)"],
        result["Repeatability"]["% Study Variance (%SV)"],
        result["Reproducibility"]["% Study Variance (%SV)"],
        result["Part to Part"]["% Study Variance (%SV)"],
      ],
      name: "% Study Var",
      type: "bar",
    },
    {
      x: ["Gage R&R", "Repeat", "Reprod", "Part to Part"],
      y: [
        result["Total Gage R&R"]["% Tolerance (SV/Tol)"],
        result["Repeatability"]["% Tolerance (SV/Tol)"],
        result["Reproducibility"]["% Tolerance (SV/Tol)"],
        result["Part to Part"]["% Tolerance (SV/Tol)"],
      ],
      name: "% Tolerance",
      type: "bar",
    },
  ];

  const layout = {
    title: "Component of Variance",
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
          width: chartWidth, // Set the chart width dynamically
          height: chartWidth * 0.5 < 300 ? 300 : chartWidth * 0.5, // Set a fixed chart height or adjust as needed
        }}
        config={{
          displayModeBar: false,
        }}
      />
    </div>
  );
};

export default ComponentVariationChart;
