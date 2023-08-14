/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";
import ColorPicker from "../components/small/ColorPicker";
import Members from "../components/small/Members";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditDepartmentForm = ({
  openEdit,
  selectedDepartment,
  users,
  setOpenEdit,
  fetchData,
}) => {
  const [name, setName] = React.useState(selectedDepartment.name);
  const [description, setDescription] = React.useState(
    selectedDepartment.description
  );
  const [phone, setPhone] = React.useState(selectedDepartment.phone);
  const [email, setEmail] = React.useState(selectedDepartment.email);
  const previousManager = selectedDepartment.manager;
  const [manager, setManager] = React.useState(previousManager);
  const [selectedUsers, setSelectedUsers] = React.useState(
    selectedDepartment.members
  );
  const [color, setColor] = React.useState(selectedDepartment.color);
  const [colorAnchorEl, setColorAnchorEl] = React.useState(null);
  const managers = users.filter((user) => user.position === "Gerente");


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

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const membersData = selectedUsers.map((user) => ({
        id: user._id,
        name: user.name,
        avatarColor: user.avatarColor,
      }));

      const res = await api.put("/departments", {
        departmentId: selectedDepartment._id,
        name,
        description,
        phone,
        email,
        color,
        previousManager,
        manager,
        members: membersData,
      });
      res.data && alert("Departamento Editado!");
      setOpenEdit(!openEdit);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>
        Editando Departamento - {selectedDepartment.name}
      </DialogTitle>
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
              label="E-mail Departamento"
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
            users={users.filter((user) => user.position === "Comum")}
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
          <Grid container direction="row">
            <Grid item>
              <Select
                size="small"
                onChange={(e) => setManager(e.target.value)}
                value={manager}
                renderValue={(selected) => selected.name}
              >
                {managers.map((manager) => (
                  <MenuItem
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
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography>Customização</Typography>
        <Grid item sx={{ m: "1%" }}>
          <ColorPicker
            handleClickColor={handleClickColor}
            color={color}
            colorAnchorEl={colorAnchorEl}
            handleCloseColor={handleCloseColor}
            handleChangeColor={handleChangeColor}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditDepartmentForm;
