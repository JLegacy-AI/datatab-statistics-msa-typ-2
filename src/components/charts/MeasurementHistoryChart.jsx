import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const MeasurementHistoryChart = () => {
  const data1 = [
    {
      name: "teil1",
      data: [
        { name: "andreas", data: [1, 2, 3] },
        { name: "anne", data: [1.1, 2.1, 3.1] },
        { name: "anne", data: [1.2, 2.2, 3.2] },
      ],
    },
    {
      name: "teil2",
      data: [
        { name: "andreas", data: [1.3, 2.3, 3.3] },
        { name: "anne", data: [1.4, 2.4, 3.4] },
        { name: "anne", data: [1.5, 2.5, 3.5] },
      ],
    },
    {
      name: "teil3",
      data: [
        { name: "andreas", data: [1.6, 2.6, 3.6] },
        { name: "anne", data: [1.7, 2.7, 3.7] },
        { name: "anne", data: [1.8, 2.8, 3.8] },
      ],
    },
    {
      name: "teil4",
      data: [
        { name: "andreas", data: [1.6, 2.6, 3.6] },
        { name: "anne", data: [1.7, 2.7, 3.7] },
        { name: "anne", data: [1.8, 2.8, 3.8] },
      ],
    },
  ];
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
      x: ["Category A", "Category A", "Category A"],
      y: [3, 4, 2],
      name: "Teil1",
      type: "scatter",
    },
    {
      x: ["Category A", "Category A", "Category A"],
      y: [3, 4, 2],
      name: "Teil2",
      type: "scatter",
    },
  ];

  const layout = {
    title: "Separate Line Charts for Teil1 and Teil2",
    xaxis: {
      title: "Category",
    },
    yaxis: {
      title: "Value",
    },
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

export default MeasurementHistoryChart;
