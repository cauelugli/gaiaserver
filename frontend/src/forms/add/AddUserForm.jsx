/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

// import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

import { IMaskInput } from "react-imask";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddUserForm = ({
  openAdd,
  departments,
  setOpenAdd,
  fetchData,
  toast,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [image, setImage] = React.useState("");
  const [position, setPosition] = React.useState("");

  const handleImageClick = () => {
    // Quando o usuário clicar no avatar, acione o input de arquivo
    document.getElementById("fileInput").click();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleProduct", formData);
      const imagePath = uploadResponse.data.imagePath;
      const res = await api.post("/users", {
        name,
        email,
        phone,
        image: imagePath,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
        position,
      });

      if (res.data) {
        toast.success("Colaborador Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }

      setOpenAdd(!openAdd);
      fetchData();
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
      <DialogTitle>Novo Colaborador</DialogTitle>
      <DialogContent>
        <Grid container direction="row" justifyContent="space-around">
          <Grid item>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => {
                  const selectedImage = e.target.files[0];
                  setImage(selectedImage);
                }}
              />
              <label htmlFor="fileInput">
                <Avatar
                  alt="Imagem do Usuário"
                  value={image}
                  sx={{ width: 200, height: 200, cursor: "pointer" }}
                  onClick={handleImageClick}
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Prévia da Imagem"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : null}
                </Avatar>
              </label>
              {image && (
                <FormHelperText>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => setImage("")}
                    sx={{mt:1}}
                  >
                    Remover
                  </Button>
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              sx={{ mt: 2 }}
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
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Grid item>
                <Typography sx={{ mb: 1 }}>Departamento</Typography>
                <Select
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department}
                  renderValue={(selected) => selected.name}
                  size="small"
                  sx={{ minWidth: 250 }}
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
                <Typography sx={{ mb: 1, ml: 2 }}>Cargo</Typography>
                <TextField
                  value={position}
                  size="small"
                  required
                  onChange={(e) => setPosition(e.target.value)}
                  sx={{ ml: 2, width: 250 }}
                />
              </Grid>

            </Grid>

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
