import React, { useState } from "react";

const Button = ({
  number,
  name,
  settingName,
  selectedColumns,
  setSelectedColumns,
}) => {
  const handleClick = (columnTypeName, number) => {
    const newSelectedColumns = {};
    newSelectedColumns[columnTypeName] = number;
    setSelectedColumns({ ...selectedColumns, ...newSelectedColumns });
  };
  return (
    <button
      aria-label={`Select ${name}`}
      className={
        number === selectedColumns[settingName]
          ? `text-white bg-blue-700 cursor-not-allowed focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`
          : `py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`
      }
      disabled={number === selectedColumns[settingName]}
      onClick={() => handleClick(settingName, number)}
    >
      {name}
    </button>
  );
};

const Setting = ({
  columnInformation,
  selectedColumns,
  setSelectedColumns,
  LSL,
  USL,
  setLSL,
  setUSL,
  k,
  setK,
}) => {
  return (
    <div>
      <h1 className="font-bold text-2xl">Einstellungen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col items-start justify-center">
          <p className="py-5">Messwerte:</p>
          <div className="flex-1 flex justify-left items-center flex-wrap">
            {columnInformation["measuredValuesColumn"] == [] ? (
              <p>No Columns Yet</p>
            ) : (
              columnInformation["measuredValuesColumn"].map((e, key) => {
                return (
                  <Button
                    key={key}
                    settingName={"measuredValuesColumn"}
                    {...e}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <p className="py-5">Bauteil:</p>
          <div className="flex-1 flex justify-left items-center flex-wrap">
            {columnInformation["partsColumn"] == [] ? (
              <p>No Columns Yet</p>
            ) : (
              columnInformation["partsColumn"].map((e, key) => {
                return (
                  <Button
                    key={key}
                    settingName={"partsColumn"}
                    {...e}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <p className="py-5">Prüfer:</p>
          <div className="flex-1 flex justify-left items-center flex-wrap">
            {columnInformation["operatorValuesColumn"] == [] ? (
              <p>No Columns Yet</p>
            ) : (
              columnInformation["operatorValuesColumn"].map((e, key) => {
                return (
                  <Button
                    key={key}
                    settingName={"operatorValuesColumn"}
                    {...e}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="md:grid gap-6 mb-6 md:grid-cols-2 my-5 flex flex-col">
        <div>
          <label
            htmlFor="Untere Spez. Grenze"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Untere Spez. Grenze
          </label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setLSL(e.target.value)}
            value={LSL == undefined ? 0 : LSL}
            aria-label="Untere Spez. Grenze"
          />
        </div>

        <div>
          <label
            htmlFor="Obere Spez. Grenze"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Obere Spez. Grenze
          </label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setUSL(e.target.value)}
            value={USL == undefined ? 0 : USL}
            aria-label="Obere Spez. Grenze"
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="k"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            k
          </label>
          <input
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setK(e.target.value)}
            value={k == undefined ? 0 : k}
            aria-label="k"
          />
        </div>
      </div>
    </div>
  );
};

export default Setting;
