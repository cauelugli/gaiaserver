/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Avatar,
  Grid,
  MenuItem,
  Select,
  Typography,
  Chip,
} from "@mui/material";

const DynamicDataTableCell = (props) => {
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        if (props.field.dynamicData === "allUsers") {
          const resUsers = await api.get("/get", { params: { model: "User" } });
          data = resUsers.data;
        } else if (props.field.dynamicData === "allCustomers") {
          const resCustomers = await api.get("/get", {
            params: { model: "Customer" },
          });
          const resClients = await api.get("/get", {
            params: { model: "Client" },
          });
          data = [...resCustomers.data, ...resClients.data];
        } else if (props.field.dynamicData === "serviceTypes") {
          const resConfig = await api.get("/getConfig", {
            params: { item: "services", parameter: "serviceTypes" },
          });
          data = resConfig.data;
        } else if (props.field.dynamicData === "departments") {
          const resDepartments = await api.get("/get", {
            params: { model: "Department" },
          });
          data = resDepartments.data;
        } else {
          const response = await api.get(`/${props.field.dynamicData}`);
          data = response.data;
        }
        setOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData]);

  const renderValue = (selected) => {
    if (props.multiple) {
      return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {selected.map((value) => (
            <Chip
              size="small"
              key={value.id}
              label={value.name}
              style={{ margin: 2 }}
            />
          ))}
        </div>
      );
    } else if (props.field.dynamicData === "users") {
      if (!selected) {
        return <Typography>Colaborador</Typography>;
      } else {
        return (
          <Grid container direction="row" alignItems="center">
            <Avatar
              alt="Imagem do Cliente"
              src={`http://localhost:3000/static/${selected.image}`}
              sx={{ width: 24, height: 24, marginRight: 2 }}
            />
            <Typography>{selected.name}</Typography>
          </Grid>
        );
      }
    } else {
      if (!selected) {
        return <Typography />;
      } else {
        return <Typography>{selected.name || selected}</Typography>;
      }
    }
  };

  return (
    <Select
      value={props.fields[props.field.name] || (props.multiple ? [] : "")}
      onChange={props.handleChange(props.field.name)}
      sx={{
        width: props.multiple
          ? "100%"
          : props.modalOptions.maxWidth === "xs"
          ? 190
          : props.modalOptions.maxWidth === "sm"
          ? 175
          : props.modalOptions.maxWidth === "md"
          ? 200
          : 200,
        minWidth: 175,
      }}
      size="small"
      required={props.field.required}
      multiple={props.multiple}
      renderValue={renderValue}
    >
      {props.field.dynamicData === "users"
        ? options.map((option, index) => (
            <MenuItem value={option} key={index}>
              <Grid container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem do Cliente"
                  src={`http://localhost:3000/static/${option.image}`}
                  sx={{ width: 24, height: 24, marginRight: 2 }}
                />
                <Typography>{option.name}</Typography>
              </Grid>
            </MenuItem>
          ))
        : options.map((option, index) => (
            <MenuItem value={option} key={index}>
              {option.name || option}
            </MenuItem>
          ))}
    </Select>
  );
};

export default DynamicDataTableCell;
