import React, { useCallback, useEffect, useState } from "react";

import SAMPLE_DATA from "../../assets/MSA Typ 2_example data.xlsx";
import { canCalculate, handleClearTable, initColumns } from "../../utils/utils";
import { readFile } from "../../utils/utils";
import { lazy } from "react";
import { Suspense } from "react";
import LOADING from "../../assets/loading.gif";

const Setting = lazy(() => import("../../components/Setting"));
const DataTable = lazy(() => import("../../components/Handsontable"));
const ANOVATable = lazy(() => import("../../components/tables/ANOVATable"));
const VarianceComponentTable = lazy(() =>
  import("../../components/tables/VarianceComponentTable")
);
const ComponentVariationChart = lazy(() =>
  import("../../components/charts/ComponentVariationChart")
);
const MeasurementHistoryChart = lazy(() =>
  import("../../components/charts/MeasurementHistoryChart")
);

const MSAType2 = () => {
  const [data, setData] = useState([]);
  const [LSL, setLSL] = useState();
  const [USL, setUSL] = useState();
  const [k, setK] = useState();

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
   * Use Callback
   */

  const canPreSelect = useCallback(() => {
    return Object.values(columnInformation).every((value) => value.length > 0);
  }, [columnInformation]);

  const isPartOperatorSame = useCallback(() => {
    const partColumn = selectedColumns["partsColumn"];
    const operatorColumn = selectedColumns["operatorValuesColumn"];
    return partColumn !== operatorColumn;
  }, [selectedColumns]);

  /**
   * Use Effects
   */

  useEffect(() => {
    if (canPreSelect()) {
      const newSelectedColumn = {};
      newSelectedColumn["measuredValuesColumn"] =
        columnInformation["measuredValuesColumn"][0].number;
      newSelectedColumn["operatorValuesColumn"] =
        columnInformation["operatorValuesColumn"][0].number;
      newSelectedColumn["partsColumn"] =
        columnInformation["partsColumn"][1].number;
      setSelectedColumns(newSelectedColumn);
    }
  }, [columnInformation]);

  useEffect(() => {
    setColumnInformation(initColumns(data));
  }, [data]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-2xl mb-3">Dateninput</h1>
      <div className="flex gap-4">
        <button
          className="hover:text-green-600 transition-all duration-300"
          onClick={() => setData(handleClearTable)}
        >
          Alle Daten löschen
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
          Beispieldaten laden
        </button>
      </div>
      <div>
        {data.length == 0 ? (
          <p className="flex justify-center items-center font-bold">
            Data is Not Present Yet
          </p>
        ) : (
          <>
            <Suspense
              fallback={
                <p className="w-full min-h-[500px] flex justify-center items-center">
                  <img
                    src={LOADING}
                    alt="LOADING IMAGE"
                    height="200"
                    width="200"
                  />
                </p>
              }
            >
              <DataTable dataTable={data} setDataTable={setData} />
            </Suspense>
          </>
        )}
      </div>

      <>
        <hr className="my-10 border" />
        <Suspense
          fallback={
            <p className="w-full min-h-[300px] flex justify-center items-center">
              <img src={LOADING} alt="LOADING IMAGE" height="200" width="200" />
            </p>
          }
        >
          <Setting
            columnInformation={columnInformation}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            LSL={LSL}
            setLSL={setLSL}
            USL={USL}
            setUSL={setUSL}
            k={k}
            setK={setK}
          />
          <hr className="my-10 border" />
        </Suspense>
      </>
      <>
        {canCalculate(selectedColumns) ? (
          <>
            <Suspense
              fallback={
                <p className="w-100 h-[400px]">
                  <img
                    src={LOADING}
                    alt="LOADING IMAGE"
                    height="200"
                    width="200"
                  />
                </p>
              }
            >
              <MeasurementHistoryChart
                data={data}
                selectedColumns={selectedColumns}
              />
            </Suspense>
            <Suspense
              fallback={
                <p className="w-100 h-[400px]">
                  <img
                    src={LOADING}
                    alt="LOADING IMAGE"
                    height="200"
                    width="200"
                  />
                </p>
              }
            >
              {isPartOperatorSame() ? (
                <>
                  <hr className="border my-10" />
                  <ComponentVariationChart
                    data={data}
                    selectedColumns={selectedColumns}
                  />
                </>
              ) : (
                <></>
              )}
            </Suspense>
            <Suspense
              fallback={
                <p className="w-100 h-[400px]">
                  <img
                    src={LOADING}
                    alt="LOADING IMAGE"
                    height="200"
                    width="200"
                  />
                </p>
              }
            >
              <hr className="border my-10" />
              <ANOVATable data={data} selectedColumns={selectedColumns} />
            </Suspense>
            <Suspense
              fallback={
                <p className="w-100 h-[400px]">
                  <img
                    src={LOADING}
                    alt="LOADING IMAGE"
                    height="200"
                    width="200"
                  />
                </p>
              }
            >
              <hr className="border my-10" />
              <VarianceComponentTable
                data={data}
                selectedColumns={selectedColumns}
                LSL={LSL}
                USL={USL}
              />
            </Suspense>
          </>
        ) : (
          <></>
        )}
      </>
      <hr className="border my-10" />
    </div>
  );
};

export default MSAType2;
