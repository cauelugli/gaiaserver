/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";
import ColorPicker from "../../components/small/ColorPicker";
import Members from "../../components/small/Members";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddDepartmentForm = ({
  openAdd,
  users,
  managers,
  setOpenAdd,
  fetchData,
}) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [managerName, setManagerName] = React.useState("");
  const [managerEmail, setManagerEmail] = React.useState("");
  const [managerPhone, setManagerPhone] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [color, setColor] = React.useState("#ffffff");
  const [colorAnchorEl, setColorAnchorEl] = React.useState(null);
  const [newManager, setNewManager] = React.useState(false);

  const handleNewManager = (event) => {
    setNewManager(event.target.checked);
  };

  const handleClickColor = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleCloseColor = () => {
    setColorAnchorEl(null);
  };

  const handleChangeColor = (selectedColor) => {
    setColor(selectedColor.hex);
    handleCloseColor();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const membersData = selectedUsers.map((user) => ({
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatarColor: user.avatarColor,
      }));

      const newManagerCreated = newManager
        ? await api.post("/managers", {
            name: managerName,
            email: managerEmail,
            phone: managerPhone,
            avatarColor: color,
            isAllocated: true,
            department: {
              name,
              phone,
              email,
              color,
            },
          })
        : "";

      const res = await api.post("/departments", {
        name,
        description,
        phone,
        email,
        color,
        manager: newManager ? newManagerCreated.data : manager,
        members: membersData,
      });
      res.data && alert("Departamento Adicionado!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Novo Departamento</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 2 }}>Geral</Typography>
        <Grid container direction="row">
          <Grid item>
            <TextField
              size="small"
              label="Nome do Departamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mr: 1, mt: 3, width: 300 }}
            />
          </Grid>
          <Grid item>
            <TextField
              value={email}
              size="small"
              label="E-mail do Departamento"
              required
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mr: 1, mt: 3, width: 285 }}
            />
          </Grid>
          <Grid item>
            <Typography>Telefone</Typography>
            <IMaskInput
              style={{
                padding: "5%",
                marginRight: "4%",
                marginBottom: "1%",
                borderColor: "#eee",
                borderRadius: 4,
              }}
              mask="(00) 0000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setPhone(value)}
              overwrite
              value={phone}
            />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <TextField
            value={description}
            size="small"
            label="Descrição"
            fullWidth
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid item>
          <Typography sx={{ my: 2 }}>Membros</Typography>
          <Members
            users={users}
            value={selectedUsers}
            onChange={setSelectedUsers}
          />
        </Grid>

        <Divider sx={{ mt: 2, mb: 1 }} />
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          width="50%"
        >
          <Grid item>
            <Typography sx={{ mt: 1 }}>Gerência</Typography>
          </Grid>
          <Grid item>
            <>Novo Gerente</>
            <Checkbox
              checked={newManager}
              onChange={handleNewManager}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Grid>
          {newManager ? (
            <Grid container direction="row">
              <Grid item>
                <TextField
                  label="Nome do Gerente"
                  value={managerName}
                  size="small"
                  onChange={(e) => setManagerName(e.target.value)}
                  variant="outlined"
                  sx={{ mt: 1, width: 300 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="E-mail Gerente"
                  value={managerEmail}
                  size="small"
                  onChange={(e) => setManagerEmail(e.target.value)}
                  variant="outlined"
                  sx={{ mt: 1, width: 300 }}
                />
              </Grid>
              <Grid item sx={{ mt: 1, mr: 2 }}>
                <Typography>Telefone</Typography>
                <IMaskInput
                  style={{
                    padding: "5%",
                    marginRight: "6%",
                    marginBottom: "1%",
                    borderColor: "#eee",
                    borderRadius: 4,
                  }}
                  mask="(00) 00000-0000"
                  definitions={{
                    "#": /[1-9]/,
                  }}
                  onAccept={(value) => setManagerPhone(value)}
                  overwrite
                  value={managerPhone}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container direction="row">
              <Grid item>
                <Select
                  size="small"
                  onChange={(e) => setManager(e.target.value)}
                  value={manager}
                  renderValue={(selected) => selected.name}
                >
                  <ListSubheader sx={{ color: "green", m: -1 }}>
                    Disponíveis
                  </ListSubheader>
                  {managers
                    .filter((manager) => !manager.isAllocated)
                    .map((manager) => (
                      <MenuItem
                        value={manager}
                        key={manager._id}
                        sx={{ fontSize: "100%" }}
                      >
                        {manager.name}
                      </MenuItem>
                    ))}
                  <ListSubheader sx={{ color: "red", m: -1, mt: 0 }}>
                    Alocados
                  </ListSubheader>
                  {managers
                    .filter((manager) => manager.isAllocated)
                    .map((manager) => (
                      <MenuItem
                        disabled
                        value={manager}
                        key={manager._id}
                        sx={{ fontSize: "100%" }}
                      >
                        {manager.name}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography>Personalização</Typography>
        <Grid container direction="row" justifyContent="space-evenly">
          <Grid item sx={{ ml: "15%" }}>
            <Typography>Cor</Typography>
            <ColorPicker
              handleClickColor={handleClickColor}
              color={color}
              colorAnchorEl={colorAnchorEl}
              handleCloseColor={handleCloseColor}
              handleChangeColor={handleChangeColor}
            />
          </Grid>
          <Grid item sx={{ mr: "20%" }}>
            <Typography>Ícone</Typography>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "2px solid lightgrey",
                borderRadius: "30%",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            ></div>
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

export default AddDepartmentForm;