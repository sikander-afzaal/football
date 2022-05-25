import { useState, useEffect } from "react";
import "./App.css";
import Upload from "./components/Upload";
import { Space, Table, Tag } from "antd";
import "antd/dist/antd.css";
import Chart from "react-apexcharts";
import FootballCourt from "./components/FootballCourt";
import { TYPES } from "./contant";

function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [removedFilter, setRemovedFilter] = useState([]);
  const { Column } = Table;

  const handleFilterClick = (type) => {
    setFilter((prev) => prev.filter((el) => el !== type));
    setRemovedFilter((prev) => [...prev, type]);
  };

  const handleRemoveFilterClick = (type) => {
    setRemovedFilter((prev) => prev.filter((el) => el !== type));
    setFilter((prev) => [...prev, type]);
  };

  const state = {
    options: {
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [
      {
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  };

  useEffect(() => {
    setFilter([...Array(data?.titles?.length).keys()].slice(3));
  }, [data]);

  return (
    <div className="App">
      <Upload setData={setData} />
      <div className="filter_container">
        {data?.rowData?.length > 0 && (
          <>
            {/* choose what column to display */}
            <div>
              {data?.titles?.map(
                (each, i) =>
                  filter.includes(i) && (
                    <button onClick={() => handleFilterClick(i)}>{each}</button>
                  )
              )}
            </div>
            {/* return the filtered columns */}
            <div>
              {data?.titles?.map(
                (each, i) =>
                  removedFilter.includes(i) && (
                    <button onClick={() => handleRemoveFilterClick(i)}>
                      {each}
                    </button>
                  )
              )}
            </div>
          </>
        )}
      </div>
      <Table
        pagination={false}
        size="small"
        bordered
        dataSource={data?.rowData?.filter(
          (title, i) => filter.includes(i) || i === 0 || i === 1 || i === 2
        )}
      >
        {data?.titles?.map(
          (title, i) =>
            (filter.includes(i) || i === 0 || i === 1 || i === 2) && (
              <Column title={title} dataIndex={title} key={title} />
            )
        )}
      </Table>
      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        width="500"
      />
      <div
        style={{
          justifyContent: "center",

          alignItems: "center",
          display: "flex",
        }}
      >
        <FootballCourt />
      </div>
    </div>
  );
}

export default App;
