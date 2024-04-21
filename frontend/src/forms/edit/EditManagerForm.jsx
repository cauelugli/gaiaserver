/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { IMaskInput } from "react-imask";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditManagerForm = ({
  openEdit,
  positions,
  selectedManager,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
}) => {
  const [name, setName] = React.useState(selectedManager.name);
  const [email, setEmail] = React.useState(selectedManager.email);
  const [phone, setPhone] = React.useState(selectedManager.phone);
  const [gender, setGender] = React.useState(selectedManager.gender);
  const [birthdate, setBirthdate] = React.useState(
    dayjs(selectedManager.birthdate)
  );
  const [position, setPosition] = React.useState(
    selectedManager.position || {}
  );
  const [image, setImage] = React.useState(selectedManager.image);
  const [newImage, setNewImage] = React.useState("");

  const [department, setDepartment] = React.useState(
    selectedManager.department || ""
  );
  const previousData = selectedManager;

  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await api.get("/departments");
        setDepartments(departments.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      let updatedImagePath = selectedManager.image;

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);
        const uploadResponse = await api.post("/uploads/singleFile", formData);
        updatedImagePath = uploadResponse.data.imagePath;
      }

      const res = await api.put("/managers", {
        managerId: selectedManager._id,
        name,
        email,
        phone,
        gender,
        birthdate,
        image: updatedImagePath,
        department: {
          id: department.id || department._id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
        position,
        previousData,
      });
      if (res.data) {
        toast.success("Gerente Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
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
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Gerente - {selectedManager.name}</DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Avatar
                  alt="Imagem do Usuário"
                  src={`http://localhost:3000/static/${selectedManager.image}`}
                  sx={{
                    width: 200,
                    height: 200,
                    opacity: newImage ? "0.5" : "1",
                    marginRight: newImage ? 5 : 0,
                  }}
                />
              </Grid>

              <Grid item>
                {newImage && (
                  <Avatar
                    src={URL.createObjectURL(newImage)}
                    alt="Prévia da Imagem"
                    style={{
                      width: 200,
                      height: 200,
                    }}
                  />
                )}
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => {
                  const selectedImage = e.target.files[0];
                  setNewImage(selectedImage);
                }}
              />
              {!newImage ? (
                <label htmlFor="fileInput">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    size="small"
                    startIcon={<FileUploadIcon />}
                    sx={{ my: 2 }}
                  >
                    Alterar Imagem
                  </Button>
                </label>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => setNewImage("")}
                  sx={{ my: 2 }}
                >
                  Remover Imagem
                </Button>
              )}
            </Grid>
          </Grid>

          <Grid item sx={{ mt: 1 }}>
            <Grid container>
              <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                Informações Pessoais
              </Typography>
              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color:
                    name && birthdate && gender && phone
                      ? "#50C878"
                      : "lightgrey",
                  ml: 1,
                }}
              />
            </Grid>
            <Grid
              container
              sx={{ mt: 1 }}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item>
                <InputLabel>Nome</InputLabel>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ width: 250 }}
                />
              </Grid>
              {name && (
                <Grid item sx={{ ml: 2, mr: 4 }}>
                  <InputLabel>Telefone</InputLabel>
                  <IMaskInput
                    style={{
                      padding: "10%",
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
              )}

              {phone && (
                <Grid item sx={{ mx: 2, mt: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        value={birthdate}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => setBirthdate(newValue)}
                        label="Data de Nascimento"
                        sx={{ width: 80 }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              )}

              {phone && (
                <Grid item sx={{ mb: 1 }}>
                  <InputLabel>Gênero</InputLabel>
                  <Select
                    value={gender}
                    sx={{ width: 120 }}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value={"m"}>Masculino</MenuItem>
                    <MenuItem value={"f"}>Feminino</MenuItem>
                    <MenuItem value={"0"}>Não Informar</MenuItem>
                  </Select>
                </Grid>
              )}
            </Grid>
          </Grid>

          {name && birthdate && gender && phone && (
            <Grid item>
              <Divider sx={{ my: 2 }} />
              <Grid container>
                <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                  Dados Internos
                </Typography>
                <CheckCircleOutlineOutlinedIcon
                  sx={{
                    color: email ? "#50C878" : "lightgrey",
                    ml: 1,
                  }}
                />
              </Grid>

              <Grid
                container
                sx={{ mt: 1 }}
                direction="row"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography>Email</Typography>
                  <TextField
                    value={email}
                    size="small"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: 230 }}
                  />
                </Grid>

                <Grid item sx={{ opacity: email ? 1 : 0 }}>
                  <Typography>Departamento</Typography>

                  <Select
                    onChange={(e) => setDepartment(e.target.value)}
                    value={department}
                    renderValue={(selected) => selected.name}
                    size="small"
                    sx={{ minWidth: 200 }}
                  >
                    <ListSubheader sx={{ color: "green", m: -1 }}>
                      Disponíveis
                    </ListSubheader>
                    {departments
                      .filter((department) => !department.manager)
                      .map((department) => (
                        <MenuItem
                          value={department}
                          key={department._id}
                          sx={{ fontSize: "100%" }}
                        >
                          <Grid container direction="row">
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor: department.color,
                              }}
                            />
                            <Typography>{department.name}</Typography>
                          </Grid>
                        </MenuItem>
                      ))}
                    <ListSubheader sx={{ color: "red", m: -1, mt: 0 }}>
                      Gerenciados
                    </ListSubheader>
                    {departments
                      .filter((department) => department.manager)
                      .map((department) => (
                        <MenuItem
                          disabled
                          value={department}
                          key={department._id}
                          sx={{ fontSize: "100%" }}
                        >
                          <Grid container direction="row">
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor: department.color,
                              }}
                            />
                            <Typography>{department.name}</Typography>
                          </Grid>{" "}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
                <Grid item sx={{ opacity: department ? 1 : 0 }}>
                  <Typography>Cargo</Typography>
                  <Select
                    onChange={(e) => setPosition(e.target.value)}
                    renderValue={(selected) => selected.name}
                    size="small"
                    sx={{ minWidth: 250 }}
                    value={position}
                  >
                    {positions.map((item) => (
                      <MenuItem value={item} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          )}
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

export default EditManagerForm;
