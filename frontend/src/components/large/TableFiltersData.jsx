/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Grid, Chip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

function TableFilteredDataBar({ tableFilters, setTableFilters, tableColumns }) {
  const getLabelByKey = (key) => {
    const column = tableColumns.find((col) => col.id === key);
    return column ? column.label : key;
  };

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: "auto", ml: 0.5 }}
    >
      {Object.entries(tableFilters).map(([key, value], index) => (
        <Grid item key={index} sx={{ cursor: "pointer" }}>
          <Chip
            label={`${getLabelByKey(key)}: ${value}`}
            variant="contained"
            size="small"
            sx={{
              background: "lightgrey",
            }}
            onDelete={() => {
              setTableFilters((prevFilters) => {
                const { [key]: removed, ...rest } = prevFilters;
                return rest;
              });
            }}
            deleteIcon={<CancelIcon />}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default TableFilteredDataBar;
