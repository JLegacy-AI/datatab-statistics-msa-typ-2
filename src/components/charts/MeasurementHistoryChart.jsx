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
  const [cleanedDataForGraph, setCleanedDataForGraph] = useState([]);
  const [linesData, setLinesData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const chartWidth = windowWidth > 800 ? 800 : windowWidth - 100;

  useEffect(() => {
    const linesData = [];
    const cleanedDataForGraph = [];
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

    const maxYAxis = Math.max(...measured);
    const minXAxis = Math.min(...measured) - Math.min(...measured) * 0.05;
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

    // Create annotations for the bottom and center of each vertical line
    const annotations = linesData.map((line, index) => {
      return {
        x: line.x[0],
        y: line.y[0],
        xref: "x",
        yref: "y",
        text: `<b class="top-annotation">${uniquenessPart[index]}</b>`,
        showarrow: true,
        arrowhead: 0,
        ax: -60,
        ay: -10,
        font: {
          size: 12,
          color: "black",
        },
      };
    });

    linesData.push({
      name: "Mittelwert",
      x: [0, x],
      y: [jstat.mean(measured), jstat.mean(measured)],
      mode: "lines+text",
      line: {
        width: 1,
        dash: "dash",
        color: "blue",
      },
      text: ["", "Mittelwert"],
      textposition: "top",
    });

    for (let i = 0; i < uniquenessOperator.length; i++) {
      cleanedDataForGraph.push(selfBuiledData[uniquenessOperator[i]]);
    }

    setAnnotations([...annotations]);
    setCleanedDataForGraph(cleanedDataForGraph);
    setLinesData(linesData);
  }, [data, selectedColumns]);

  return (
    <div className="flex justify-center items-center flex-col">
      <Plot
        data={[...cleanedDataForGraph, ...linesData]}
        layout={{
          title: {
            text: "<b>Messverlaufsdiagramm</b>",
            font: {
              family: "poppins",
              size: 16,
            },
            automargin: true,
            yref: "paper",
          },
          xaxis: {
            title: "Prüfer",
            showline: true,
            showgrid: false,
            showticklabels: false,
          },
          yaxis: {
            title: data[0][selectedColumns["measuredValuesColumn"]],
          },
          annotations: annotations,
          width: chartWidth,
          height: chartWidth * 0.714 < 300 ? 300 : chartWidth * 0.614,
        }}
        config={{
          displayModeBar: false,
        }}
      />
    </div>
  );
};

export default MeasurementHistoryChart;
