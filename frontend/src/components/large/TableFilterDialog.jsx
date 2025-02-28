/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Grid2, Paper, TextField } from "@mui/material";

import { icons } from "../../icons";

import PhoneTableCell from "../tableCells/PhoneTableCell";
import DateTableCell from "../tableCells/DateTableCell";
import DynamicDataTableCell from "../tableCells/DynamicDataTableCell";

const TableFilterDialog = (props) => {
  const [minValue, setMinValue] = React.useState("");
  const [maxValue, setMaxValue] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const handleRangeChange = (e, type) => {
    const newValue = e.target.value;
    if (type === "min") {
      setMinValue(newValue);
      if (newValue && maxValue) {
        props.setFilterValue(`${newValue} ~ ${maxValue}`);
      }
    } else if (type === "max") {
      setMaxValue(newValue);
      if (minValue && newValue) {
        props.setFilterValue(`${minValue} ~ ${newValue}`);
      }
    }
  };

  const handleDateRangeChange = (newValue, type) => {
    if (type === "start") {
      setStartDate(newValue);
      if (newValue && endDate) {
        props.setFilterValue(`${newValue} ~ ${endDate}`);
      }
    } else if (type === "end") {
      setEndDate(newValue);
      if (startDate && newValue) {
        props.setFilterValue(`${startDate} ~ ${newValue}`);
      }
    }
  };

  const renderInputField = () => {
    switch (props.dialogData.type) {
      case "string":
        return (
          <TextField
            label={`${props.columnLabel}`}
            value={props.filterValue}
            onChange={(e) => props.setFilterValue(e.target.value)}
            size="small"
            variant="outlined"
          />
        );
      case "number":
        return (
          <Grid2 container spacing={1}>
            <Grid2 item xs={6}>
              <TextField
                label={props.dialogData.data === "currency" ? "de R$" : "Min"}
                value={minValue}
                onChange={(e) => handleRangeChange(e, "min")}
                size="small"
                variant="outlined"
                type="number"
              />
            </Grid2>
            <Grid2 item xs={6}>
              <TextField
                label={props.dialogData.data === "currency" ? "a R$" : "Max"}
                value={maxValue}
                onChange={(e) => handleRangeChange(e, "max")}
                size="small"
                variant="outlined"
                type="number"
              />
            </Grid2>
          </Grid2>
        );
      case "phone":
        return (
          <PhoneTableCell
            fields={{ [props.dialogData.fieldName]: props.filterValue }}
            field={{ name: props.dialogData.fieldName, required: false }}
            handleChange={(fieldName) => (e) =>
              props.setFilterValue(e.target.value)}
            modalOptions={{ maxWidth: "xs" }}
            isCellphone={props.dialogData.data === "cellphone"}
          />
        );
      case "date":
        return (
          <Grid2 container spacing={1}>
            <Grid2 item xs={6}>
              <DateTableCell
                fields={{ startDate }}
                field={{ name: "startDate", required: false }}
                handleChange={(field) => (e) =>
                  handleDateRangeChange(e.target.value, "start")}
                modalOptions={{ maxWidth: "xxs" }}
              />
            </Grid2>
            <Grid2 item xs={6}>
              <DateTableCell
                fields={{ endDate }}
                field={{ name: "endDate", required: false }}
                handleChange={(field) => (e) =>
                  handleDateRangeChange(e.target.value, "end")}
                modalOptions={{ maxWidth: "xxs" }}
              />
            </Grid2>
          </Grid2>
        );
      case "dynamic":
        //paramos aqui => funciona parcialmente
        return (
          <DynamicDataTableCell
            fields={{
              [props.dialogData.fieldName]: props.filterValue,
              dynamicData: props.dialogData.model,
              data: props.dialogData.data,
            }}
            field={{
              name: props.dialogData.fieldName,
              dynamicData: props.dialogData.data,
              required: false,
            }}
            handleChange={(fieldName) => (e) =>
              props.setFilterValue(e.target.value)}
            modalOptions={{ maxWidth: "sm" }}
            multiple={props.dialogData.multiple}
          />
        );
      default:
        return "";
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 1,
        width: 200,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {renderInputField()}
      <Grid2 container spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
        <icons.CheckIcon
          onClick={props.handleApplyFilter}
          color="success"
          sx={{ cursor: "pointer", mr: 2 }}
        />
        <icons.CancelIcon
          onClick={props.handleClose}
          color="error"
          sx={{ cursor: "pointer" }}
        />
      </Grid2>
    </Paper>
  );
};

export default TableFilterDialog;
