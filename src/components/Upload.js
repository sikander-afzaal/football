import React, { useState } from "react";

import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: 20,
  },
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    borderRadius: 20,
    display: "flex",
    height: 100,
    width: 100,
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  },
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  },
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
  },
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  zoneHover: {
    borderColor: GREY_DIM,
  },
  default: {
    borderColor: GREY,
  },
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  },
};

export default function Upload({ setData }) {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  const getInfo = (data, titles, fun) => {
    let newData = {};
    newData.key = fun;
    let average = new Array(data[0].length - 1).fill(0);
    data.forEach((row) => {
      row.slice(1).forEach((dt, i) => {
        average[i] += parseInt(dt.split("-").slice(-1)[0].replace("%", ""));
      });
    });
    newData[titles[0]] = fun;
    average.forEach((dt, i) => {
      newData[titles[i + 1]] = isNaN(dt)
        ? "-"
        : fun === "SUM"
        ? dt
        : dt / data.length;
    });
    return newData;
  };

  return (
    <CSVReader
      onUploadAccepted={({ data }) => {
        let tableData = data.slice(4);
        let tableType = tableData.shift();
        let tableTitle = tableData.shift();
        let tableRows = tableData;
        let types = {};
        let average = getInfo(tableRows, tableTitle, "AVG");
        let sum = getInfo(tableRows, tableTitle, "SUM");
        tableType.forEach((el, i) => {
          if (el.length > 0) types[el] = i;
        });
        setData({
          titles: tableTitle,
          types: {
            Touches: tableType.indexOf("Touches"),
            Passing: tableType.indexOf("Passing"),
          },
          rowData: [
            ...tableRows.map((row, key) => {
              let newData = {};
              newData.key = `${key}`;
              row.forEach((data, i) => {
                newData[tableTitle[i]] = data;
              });
              return newData;
            }),
            average,
            sum,
          ],
        });
        setZoneHover(false);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setZoneHover(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setZoneHover(false);
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }) => (
        <>
          <div
            {...getRootProps()}
            style={Object.assign(
              {},
              styles.zone,
              zoneHover && styles.zoneHover
            )}
          >
            {acceptedFile ? (
              <>
                <div style={styles.file}>
                  <div style={styles.info}>
                    <span style={styles.size}>
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span style={styles.name}>{acceptedFile.name}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <ProgressBar />
                  </div>
                  <div
                    {...getRemoveFileProps()}
                    style={styles.remove}
                    onMouseOver={(event) => {
                      event.preventDefault();
                      setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                    }}
                    onMouseOut={(event) => {
                      event.preventDefault();
                      setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                    }}
                  >
                    <Remove color={removeHoverColor} />
                  </div>
                </div>
              </>
            ) : (
              "Drop CSV file here or click to upload"
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
}

// if the avg >30 color = red
// if the avg > 60 > 30 color = yello
// if the avg > 60
