import React, { useEffect, useState } from "react";

import SAMPLE_DATA from "../../assets/MSA Typ 2_example data.xlsx";
import Setting from "../../components/Setting";
import { canCalculate, handleClearTable, initColumns } from "../../utils/utils";
import Swal from "sweetalert2";
import DataTable from "../../components/Handsontable";
import { readFile } from "../../utils/utils";
import ANOVATable from "../../components/ANOVATable";
import VarianceComponentTable from "../../components/VarianceComponentTable";
import ComponentVariationChart from "../../components/charts/ComponentVariationChart";
import MeasurementHistoryChart from "../../components/charts/MeasurementHistoryChart";

const MSAType2 = () => {
  const [data, setData] = useState([]);

  const [columnInformation, setColumnInformation] = useState({
    measuredValuesColumn: [],
    operatorValuesColumn: [],
    partsColumn: [],
  });

  const [selectedColumns, setSelectedColumns] = useState({
    operatorValuesColumn: -1,
    partsColumn: -1,
    measuredValuesColumn: -1,
  });

  /**
   * File Handler
   */

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    readFile(file).then((res) => {
      setData(res);
    });
  };

  /**
   * Fetch Method
   */

  const fetchData = async () => {
    try {
      const response = await fetch(SAMPLE_DATA);
      const blob = await response.blob();
      readFile(blob).then((res) => {
        setData(res);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Use Effects
   */

  useEffect(() => {
    setColumnInformation(initColumns(data));
  }, [data]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-2xl mb-3">Data input</h1>
      <div className="flex gap-4">
        <button
          className="hover:text-green-600 transition-all duration-300"
          onClick={() => setData(handleClearTable)}
        >
          Clear Table
        </button>
        <input
          className="hover:text-green-600 transition-all duration-300"
          type="file"
          onChange={(e) => handleFileSelection(e)}
        />
        <button
          className="underline hover:text-blue-600 transition-all duration-300"
          onClick={() => fetchData()}
        >
          Load Example Data
        </button>
      </div>
      <div>
        {data.length == 0 ? (
          <p className="flex justify-center items-center font-bold">
            Data is Not Present Yet
          </p>
        ) : (
          <>
            <DataTable dataTable={data} setDataTable={setData} />
          </>
        )}
      </div>

      <>
        <hr className="my-10 border" />
        <Setting
          columnInformation={columnInformation}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
        />
      </>
      <>
        {canCalculate(selectedColumns) ? (
          <>
            <MeasurementHistoryChart />
            <hr className="border my-10" />
            <ComponentVariationChart />
            <hr className="border my-10" />
            <VarianceComponentTable
              data={data}
              selectedColumns={selectedColumns}
            />
            <hr className="border my-10" />
            <ANOVATable data={data} selectedColumns={selectedColumns} />
          </>
        ) : (
          <>Cannot Calculate</>
        )}
      </>
      <hr className="border my-10" />
    </div>
  );
};

export default MSAType2;
