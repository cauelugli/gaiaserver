/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Popover,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";
import MaterialList from "../../components/small/MaterialList";
import PaletteIcon from "@mui/icons-material/Palette";

import { SketchPicker } from "react-color";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddServiceForm({
  openAdd,
  departments,
  stockItems,
  setOpenAdd,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
  userId,
}) {
  const [name, setName] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [materials, setMaterials] = React.useState([]);
  const [materialsCost, setMaterialsCost] = React.useState(0);
  const [color, setColor] = React.useState("#ffffff");
  const [sessionsQuantity, setSessionsQuantity] = React.useState(1);
  const [sessionsTime, setSessionsTime] = React.useState(0.5);
  const [sessionsInterval, setSessionsInterval] = React.useState(1);
  const [showUsesMaterials, setUsesMaterials] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

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
        value,
        materials,
        materialsCost,
        executionTime: sessionsQuantity * sessionsTime,
        color,
        sessions: {
          quantity: sessionsQuantity,
          time: sessionsTime,
          interval: sessionsQuantity === 1 ? 0 : sessionsInterval,
        },
      });
      if (res.data) {
        toast.success("Serviço Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "services",
          userId: userId,
        });
      }
      setOpenAdd(!openAdd);
      setRefreshData(!refreshData);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title="Serviço" femaleGender={false} />
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Grid item>
            <Typography>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 200 }}
            />
          </Grid>
          <Grid item sx={{ mx: 2 }}>
            <Typography>Departamento</Typography>
            <Select
              required
              onChange={(e) => setDepartment(e.target.value)}
              value={department}
              renderValue={(selected) => (
                <Grid container direction="row">
                  <Paper
                    elevation={0}
                    sx={{
                      mr: 1,
                      mt: 0.5,
                      width: 15,
                      height: 15,
                      borderRadius: 50,
                      backgroundColor: selected.color,
                    }}
                  />
                  <Typography>{selected.name}</Typography>
                </Grid>
              )}
              size="small"
              sx={{ minWidth: 200 }}
            >
              {departments
                .filter((department) => department.type === "Serviços")
                .map((item) => (
                  <MenuItem value={item} key={item.id}>
                    <Grid container direction="row">
                      <Paper
                        elevation={0}
                        sx={{
                          mr: 1,
                          mt: 0.5,
                          width: 15,
                          height: 15,
                          borderRadius: 50,
                          backgroundColor: item.color,
                        }}
                      />
                      <Typography>{item.name}</Typography>
                    </Grid>
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <Grid item sx={{ mr: 2 }}>
            <Typography>Valor</Typography>
            <TextField
              type="number"
              size="small"
              value={value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    R$
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setValue(inputValue);
                }
              }}
              variant="outlined"
              sx={{ width: 120 }}
            />
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Typography>Cor</Typography>
              <Grid container direction="row">
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <PaletteIcon />
                </IconButton>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <SketchPicker
                    color={color}
                    onChange={(color) => setColor(color.hex)}
                    disableAlpha
                  />
                </Popover>
                <Paper
                  elevation={0}
                  sx={{
                    ml: 1,
                    mt: 1.25,
                    width: 20,
                    height: 20,
                    borderRadius: 50,
                    backgroundColor: color,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {name && department && (
          <Grid
            container
            sx={{ mt: 4 }}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
              Sessões
              <Typography sx={{ fontSize: 12, fontWeight: "default" }}>
                Tempo de Execução Total:{" "}
                {sessionsQuantity === 1 && sessionsTime === 0.5
                  ? "30 min"
                  : `${sessionsQuantity * sessionsTime}h`}
              </Typography>
            </Typography>
            <Grid
              sx={{ mt: 1 }}
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="flex-start"
            >
              <Grid item>
                <Typography>Quantidade de Sessões</Typography>
                <Select
                  value={sessionsQuantity}
                  size="small"
                  required
                  onChange={(e) => setSessionsQuantity(e.target.value)}
                  sx={{ width: 120 }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </Grid>

              <Grid item>
                <Typography>Tempo de Execução</Typography>
                <Select
                  value={sessionsTime}
                  size="small"
                  required
                  onChange={(e) => setSessionsTime(e.target.value)}
                  sx={{ width: 120 }}
                >
                  <MenuItem value={0.5}>30 min</MenuItem>
                  <MenuItem value={1}>01:00h</MenuItem>
                  <MenuItem value={1.5}>01:30h</MenuItem>
                  <MenuItem value={2}>02:00h</MenuItem>
                  <MenuItem value={2.5}>02:30h</MenuItem>
                  <MenuItem value={3}>03:00h</MenuItem>
                  <MenuItem value={4}>+03:00h</MenuItem>
                </Select>
              </Grid>

              <Grid item>
                <Typography>Intervalo Mínimo entre Sessões</Typography>
                <Select
                  value={sessionsInterval}
                  size="small"
                  disabled={sessionsQuantity === 1}
                  onChange={(e) => setSessionsInterval(e.target.value)}
                  sx={{ width: 120 }}
                >
                  <MenuItem value={1}>1 dia</MenuItem>
                  <MenuItem value={2}>2 dias</MenuItem>
                  <MenuItem value={3}>3 dias</MenuItem>
                  <MenuItem value={4}>4 dias</MenuItem>
                  <MenuItem value={5}>5 dias</MenuItem>
                  <MenuItem value={6}>6 dias</MenuItem>
                  <MenuItem value={7}>7 dias</MenuItem>
                  <MenuItem value={0}>+7 dias</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>
        )}

        {name && department && (
          <Grid
            container
            sx={{ mt: 2 }}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item sx={{ mt: 4 }}>
              <label style={{ fontFamily: "Verdana, sans-serif" }}>
                Uso de Materiais?
              </label>
              <Checkbox
                checked={showUsesMaterials}
                onChange={(e) => setUsesMaterials(e.target.checked)}
              />

              {showUsesMaterials && (
                <Box sx={{ mt: 3 }}>
                  <MaterialList
                    stockItems={stockItems}
                    setMaterials={setMaterials}
                    setMaterialsFinalCost={setMaterialsCost}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} />
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
