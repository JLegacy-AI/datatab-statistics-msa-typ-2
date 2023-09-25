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
}) => {
  return (
    <div>
      <h1 className="font-bold text-2xl">Settings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col items-start justify-center">
          <p className="py-5">Measured values:</p>
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
          <p className="py-5">Parts:</p>
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
          <p className="py-5">Operator:</p>
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
    </div>
  );
};

export default Setting;
