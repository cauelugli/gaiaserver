/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MaterialList from "../../components/small/MaterialList";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddServiceForm({
  openAdd,
  departments,
  stockItems,
  setOpenAdd,
  fetchData,
}) {
  const [name, setName] = React.useState("");
  const [department, setDepartment] = React.useState({});
  const [value, setValue] = React.useState(0);
  const [materials, setMaterials] = React.useState([]);
  const [materialsCost, setMaterialsCost] = React.useState(0);
  const [isSupport, setIsSupport] = React.useState(false);
  const handleIsSupport = (event) => {
    setIsSupport(event.target.checked);
  };

  const [showUsesMaterials, setUsesMaterials] = React.useState(false);
  const handleUsesMaterials = (event) => {
    setUsesMaterials(event.target.checked);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/services", {
        name,
        department: {
          id: department._id || department.id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
        value: isSupport ? 0 : value,
        materials,
        materialsCost,
        isSupport,
      });
      res.data && alert("Serviço Adicionado!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Novo Serviço</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 250 }}
            />
          </Grid>
          <Grid item sx={{ mx: 2 }}>
            <Typography>Departamento</Typography>
            <Select
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              renderValue={(selected) => selected.name}
              size="small"
              sx={{ minWidth: 200 }}
            >
              {departments.map((item) => (
                <MenuItem
                  value={item}
                  key={item.id}
                  sx={{
                    backgroundColor: item.color,
                    color: "white",
                    "&:hover": {
                      backgroundColor: item.color,
                      color: "white",
                    },
                  }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Typography>Valor</Typography>
            <TextField
              type="number"
              size="small"
              value={value}
              disabled={isSupport}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setValue(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>
          <Grid item sx={{ pt:2, ml:2}}>
            <Grid container direction="column" justifyContent="center" alignItems="center" >
              <Grid item>
                <Typography>Serviço de Consultoria?</Typography>
              </Grid>
              <Grid item>
                <Checkbox
                  checked={isSupport}
                  onChange={handleIsSupport}
                  value={isSupport}
                />
              </Grid>
              <Grid item>
                <Typography
                  sx={{ fontSize: 12, color: isSupport ? "green" : "#aaa" }}
                >
                  Sim, serviço sem custo
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item sx={{ mt: 4 }}>
            <label>Uso de Materiais?</label>
            <Checkbox
              checked={showUsesMaterials}
              onChange={handleUsesMaterials}
            />

            {showUsesMaterials && (
              <Box sx={{ ml: 5 }}>
                <MaterialList
                  stockItems={stockItems}
                  setMaterials={setMaterials}
                  setMaterialsFinalCost={setMaterialsCost}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
