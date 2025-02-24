/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { icons } from "../../icons";

import TableFiltersOptions from "./TableFiltersOptions";
import TableFilteredData from "./TableFiltersData";

const TableFiltersBar = (props) => {
  const [showFilter, setShowFilter] = React.useState(false);

  return (
    <>
      {showFilter ? (
        <icons.FilterAltOffIcon
          sx={{
            my: "auto",
            mr: 1,
            color: "lightgrey",
            cursor: "pointer",
            fontSize: 30,
          }}
          onClick={() => setShowFilter(!showFilter)}
        />
      ) : (
        <icons.FilterAltIcon
          sx={{
            my: "auto",
            mr: 1,
            color: "darkgrey",
            cursor: "pointer",
            fontSize: 30,
          }}
          onClick={() => setShowFilter(!showFilter)}
        />
      )}

      {showFilter && (
        <>
          <TableFiltersOptions
            tableColumns={props.tableColumns}
            mainColor={props.mainColor}
            tableFilters={props.tableFilters}
            setTableFilters={props.setTableFilters}
          />
          {Object.keys(props.tableFilters).length > 0 && (
            <TableFilteredData
              tableFilters={props.tableFilters}
              setTableFilters={props.setTableFilters}
              tableColumns={props.tableColumns}
            />
          )}
        </>
      )}
    </>
  );
};

export default TableFiltersBar;
