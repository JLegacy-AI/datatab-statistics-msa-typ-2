import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { ANOVATwoWayWithoutInteraction } from "../../utils/utils";

const ComponentVariationChart = () => {
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

  const data = [
    {
      x: ["Category A", "Category B", "Category C"],
      y: [3, 4, 2],
      name: "Group 1",
      type: "bar",
    },
    {
      x: ["Category A", "Category B", "Category C"],
      y: [5, 2, 3],
      name: "Group 2",
      type: "bar",
    },
  ];

  const layout = {
    title: "Grouped Bar Chart",
    barmode: "group",
  };

  // Determine the chart width based on the window width
  const chartWidth = windowWidth > 768 ? 800 : windowWidth - 20;

  return (
    <div>
      <Plot
        data={data}
        layout={{
          ...layout,
          width: chartWidth, // Set the chart width dynamically
          height: 400, // Set a fixed chart height or adjust as needed
        }}
      />
    </div>
  );
};

export default ComponentVariationChart;
