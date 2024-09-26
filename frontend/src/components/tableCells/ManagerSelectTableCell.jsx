/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import {
  Avatar,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";

import { checkAvailability } from "../../../../controllers/functions/overallFunctions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const ManagerSelectTableCell = (props) => {
  const [options, setOptions] = React.useState([]);
  const [selectedManager, setSelectedManager] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        const resManagers = await api.get("/get", {
          params: { model: "User" },
        });
        data = resManagers.data.filter((user) => user.isManager);
        setOptions(data);

        if (props.oldManager) {
          const oldManagerData = data.find(
            (manager) => manager._id === props.oldManager._id
          );
          setSelectedManager(oldManagerData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData, props.oldManager]);

  const renderValue = (selected) => {
    if (!selected) {
      return "";
    } else {
      return (
        <Grid container direction="row" alignItems="center">
          <Avatar
            alt="Imagem"
            src={`http://localhost:3000/static/${selected.image}`}
            sx={{ width: 24, height: 24, marginRight: 2 }}
          />
          <Typography sx={{ fontSize: 13 }}>{selected.name}</Typography>
        </Grid>
      );
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedManager(value);

    if (props.fromConfig) {
      props.setRequestsApproverManager(value);
    } else {
      props.handleChange(props.field.name)(event);
    }
  };

  const clearSelection = () => {
    if (props.oldManager) {
      setSelectedManager(props.oldManager); // Volta para o antigo manager, se houver
    } else {
      setSelectedManager(null); // Limpa a seleção
    }

    if (props.fromConfig) {
      props.setRequestsApproverManager(null);
    } else {
      props.handleChange(props.field.name)({ target: { value: null } });
    }
  };

  return (
    <Grid>
      <Select
        value={
          props.fromConfig
            ? props.requestsApproverManager
              ? props.requestsApproverManager
              : selectedManager
            : selectedManager
        }
        onChange={handleChange}
        sx={{
          width: 200,
          minWidth: 175,
        }}
        size="small"
        renderValue={renderValue}
      >
        {options.map((option, index) => (
          <MenuItem
            value={option}
            key={index}
            disabled={
              props.fromConfig ? "" : checkAvailability("manager", option)
            }
          >
            <Grid container direction="row" alignItems="center">
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${option.image}`}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Typography sx={{ fontSize: 13 }}>{option.name}</Typography>
            </Grid>
          </MenuItem>
        ))}
      </Select>
      {selectedManager && selectedManager._id !== props.oldManager._id && (
        <IconButton onClick={clearSelection} size="small">
          <ClearIcon sx={{ color: "red", fontSize: 13 }} />
        </IconButton>
      )}
    </Grid>
  );
};

export default ManagerSelectTableCell;
