/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { IMaskInput } from "react-imask";
import ColorPicker from "../components/small/ColorPicker";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddUserForm = ({
  selectedCustomer,
  departments,
  openAdd,
  setOpenAdd,
  fetchData,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [position, setPosition] = React.useState("Comum");
  const [department, setDepartment] = React.useState("");
  const [avatarColor, setAvatarColor] = React.useState("#ffffff");
  const [colorAnchorEl, setColorAnchorEl] = React.useState(null);

  const handleClickColor = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleCloseColor = () => {
    setColorAnchorEl(null);
  };

  const handleChangeColor = (selectedColor) => {
    setAvatarColor(selectedColor.hex);
    handleCloseColor();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", {
        customerId: selectedCustomer._id,
        name,
        email,
        phone,
        position,
        department: department === "" ? { isAllocated: false } : department,
        avatarColor,
      });
      res.data && alert("Usuário Adicionado!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Novo Usuário - {selectedCustomer.name}</DialogTitle>
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
              sx={{ mr: 1, width: 300 }}
            />
          </Grid>
          <Grid item>
            <Typography>Email</Typography>
            <TextField
              value={email}
              size="small"
              required
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mr: 1, width: 285 }}
            />
          </Grid>
          <Grid item>
            <Typography>Telefone</Typography>
            <IMaskInput
              style={{
                padding: "5%",
                marginRight: "4%",
                marginTop: "1%",
                borderColor: "#eee",
                borderRadius: 4,
              }}
              mask="(00) 00000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setPhone(value)}
              overwrite
              value={phone}
            />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item sx={{ mr: "10%" }}>
            <Typography>Acesso</Typography>
            <Select
              onChange={(e) => setPosition(e.target.value)}
              value={position}
              sx={{ mt: 1, minWidth: "150px" }}
              size="small"
            >
              <MenuItem value={"Comum"}>Funcionário 👤</MenuItem>
              <MenuItem value={"Gerente"}>Gerente 💼</MenuItem>
              <MenuItem disabled value={"Admin"}>
                Proprietário 🏆
              </MenuItem>
            </Select>
          </Grid>
          {position === "Comum" && (
            <Grid item>
              <Typography sx={{ mb: 1 }}>Departamento</Typography>
              <Select
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
                renderValue={(selected) => selected.name}
                size="small"
                sx={{ minWidth: "200px" }}
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
          )}
        </Grid>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography>Avatar</Typography>
            <ColorPicker
              handleClickColor={handleClickColor}
              color={avatarColor}
              colorAnchorEl={colorAnchorEl}
              handleCloseColor={handleCloseColor}
              handleChangeColor={handleChangeColor}
            />
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
};

export default AddUserForm;
