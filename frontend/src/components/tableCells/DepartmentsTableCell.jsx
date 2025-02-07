/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import {
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const DepartmentsTableCell = (props) => {
  const [departments, setDepartments] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const departmentTypes = {
    Vendas: <icons.SellIcon />,
    Serviços: <icons.BuildIcon />,
    Interno: <icons.LanIcon />,
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resDepartments = await api.get("/get", {
          params: { model: "Department" },
        });

        const sortedDepartments = resDepartments.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setDepartments(sortedDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData, props.fields.data]);

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={props.fields[props.field.name] || ""}
        onChange={props.handleChange(props.field.name)}
        sx={{ minWidth: 175, width: 200 }}
        size="small"
        renderValue={(selected) =>
          selected ? (
            <Grid container alignItems="center">
              <Paper
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: 50,
                  backgroundColor: selected.color,
                  mr: 1,
                }}
              />
              <Typography>{selected.name}</Typography>
            </Grid>
          ) : (
            <Typography>Selecione um Departamento</Typography>
          )
        }
        MenuProps={{ PaperProps: { sx: { padding: "10px" } } }}
      >
        <TextField
          placeholder="Buscar..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔍</InputAdornment>
            ),
          }}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              fontSize: "13px",
              height: "30px",
            },
          }}
        />

        {filteredDepartments.map((department) => (
          <MenuItem value={department} key={department._id}>
            <Grid container alignItems="center">
              <Paper
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: 50,
                  backgroundColor: department.color,
                  mr: 1,
                }}
              />
              {departmentTypes[department.type]}
              <Typography sx={{ ml: 1 }}>{department.name}</Typography>
            </Grid>
          </MenuItem>
        ))}

        {filteredDepartments.length === 0 && (
          <Typography sx={{ ml: 1, fontSize: 13 }}>
            Nenhum Departamento Encontrado
          </Typography>
        )}
      </Select>
    </>
  );
};

export default DepartmentsTableCell;
