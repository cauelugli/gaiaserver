/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddOperatorForm = ({
  openAdd,
  operators,
  roles,
  setOpenAdd,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
}) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [operator, setOperator] = React.useState("");
  const [role, setRole] = React.useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/operators", {
        operatorId: operator._id,
        username,
        password,
        role: { id: role._id, name: role.name },
        operator,
        option: "password",
      });
      if (res.data) {
        toast.success("Operador Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
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
      <DialogHeader title="Operador" femaleGender={false} />
      <DialogContent sx={{ pl: 5 }}>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ mb: 1 }}>Colaborador</Typography>
            <Select
              onChange={(e) => (
                setOperator(e.target.value),
                setUsername(e.target.value.name.toLowerCase())
              )}
              value={operator}
              renderValue={(selected) => (
                <Grid container direction="row">
                  <Avatar
                    alt="Imagem do Colaborador"
                    src={`http://localhost:3000/static/${selected.image}`}
                    sx={{ width: 22, height: 22, mr: 2 }}
                  />
                  {selected.name}
                </Grid>
              )}
              size="small"
              sx={{ mr: 1, width: 245 }}
            >
              {operators.length === 0 ? (
                <MenuItem disabled>
                  <Typography sx={{ textAlign: "center" }}>
                    Nenhum colaborador disponível
                  </Typography>
                </MenuItem>
              ) : (
                operators.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    <Avatar
                      alt="Imagem do Colaborador"
                      src={`http://localhost:3000/static/${item.image}`}
                      sx={{ width: 22, height: 22, mr: 2 }}
                    />
                    {item.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </Grid>

          <Grid item>
            <Typography sx={{ mb: 1 }}>Perfil de Acesso</Typography>
            <Select
              onChange={(e) => setRole(e.target.value)}
              value={role}
              size="small"
              sx={{ width: 245 }}
            >
              {roles.map((item, index) => (
                <MenuItem value={item} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ mt: 3 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ my: 1 }}>Nome de Usuário</Typography>
            <TextField
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mr: 1 }}
            />
          </Grid>
          <Grid item>
            <Typography sx={{ my: 1 }}>Senha do Primeiro Acesso</Typography>
            <TextField
              size="small"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
        </Grid>
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
};

export default AddOperatorForm;
