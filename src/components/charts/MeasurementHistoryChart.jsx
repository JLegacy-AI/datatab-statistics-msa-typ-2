import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { convertToArray } from "../../utils/utils";
import jstat from "jStat";

const MeasurementHistoryChart = ({ data, selectedColumns }) => {
  const operator = convertToArray(
    data,
    selectedColumns["operatorValuesColumn"]
  );
  const part = convertToArray(data, selectedColumns["partsColumn"]);
  const measured = convertToArray(
    data,
    selectedColumns["measuredValuesColumn"]
  );

  const uniquenessPart = [...new Set(part)];
  const uniquenessOperator = [...new Set(operator)];

  const pairsData = uniquenessPart.map((levelA, ind) => {
    const levelAObj = {};
    levelAObj["name"] = levelA;
    levelAObj["data"] = uniquenessOperator.map((levelB, index) => {
      const levelBObj = {};
      levelBObj["name"] = levelB;
      levelBObj["data"] = measured.filter(
        (value, i) => part[i] === levelA && operator[i] === levelB
      );
      return levelBObj;
    });
    return levelAObj;
  });

  // console.log(pairsData);

  const syntheticData = uniquenessOperator.map((key, i) => {
    const newKeyObject = {};
    newKeyObject[key] = {
      x: [],
      y: [],
    };
    return newKeyObject;
  });
  let x = 1;
  const selfBuiledData = {};
  const lineXAxis = [];
  for (let i = 0; i < pairsData.length; i++) {
    for (let j = 0; j < pairsData[i]["data"].length; j++) {
      if (selfBuiledData[pairsData[i]["data"][j]["name"]]) {
        const prevXData = selfBuiledData[pairsData[i]["data"][j]["name"]].x;
        selfBuiledData[pairsData[i]["data"][j]["name"]].x = [
          ...prevXData,
          "",
          ...pairsData[i]["data"][j]["data"].map((v, i) => x++),
        ];
        const prevYData = selfBuiledData[pairsData[i]["data"][j]["name"]].y;
        selfBuiledData[pairsData[i]["data"][j]["name"]].y = [
          ...prevYData,
          "",
          ...pairsData[i]["data"][j]["data"],
        ];
      } else {
        selfBuiledData[pairsData[i]["data"][j]["name"]] = {
          name: pairsData[i]["data"][j]["name"],
          x: pairsData[i]["data"][j]["data"].map((v, i) => x++),
          y: pairsData[i]["data"][j]["data"],
        };
      }
    }
    x += 2;
    lineXAxis.push(x - 1);
  }

  const linesData = [];
  const maxYAxis = Math.max(...measured);
  const minXAxis = Math.min(...measured);
  for (let i = 0; i < lineXAxis.length; i++) {
    linesData.push({
      name: uniquenessPart[i],
      x: [lineXAxis[i], lineXAxis[i]],
      y: [minXAxis, maxYAxis],
      mode: "lines",
      line: {
        color: "black",
        width: 1,
        dash: "dot",
      },
      showlegend: false,
    });
  }

  linesData.push({
    name: "Mean",
    x: [0, x],
    y: [jstat.mean(measured), jstat.mean(measured)],
    mode: "lines",
    line: {
      width: 1,
      dash: "dash",
    },
  });

  const cleanedDataForGraph = [];
  for (let i = 0; i < uniquenessOperator.length; i++) {
    cleanedDataForGraph.push(selfBuiledData[uniquenessOperator[i]]);
  }

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

  // Determine the chart width based on the window width
  const chartWidth = windowWidth > 700 ? 700 : windowWidth - 100;

  return (
    <div className="flex justify-center items-center flex-col">
      <Plot
        data={[...cleanedDataForGraph, ...linesData]}
        layout={{
          title: {
            text: "Messverlaufsdiagramm",
            font: {
              family: "poppins",
              size: 16,
            },
            yref: "paper",
            automargin: true,
          },
          xaxis: {
            visible: false,
          },
          yaxis: {
            title: data[0][selectedColumns["measuredValuesColumn"]],
          },
          width: chartWidth,
          height: 500,
        }}
        config={{
          displayModeBar: false,
        }}
      />
    </div>
  );
};

export default MeasurementHistoryChart;
