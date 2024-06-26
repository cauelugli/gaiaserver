/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { IMaskInput } from "react-imask";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddCustomerForm = ({
  setOpenAdd,
  fromShortcut,
  refreshData,
  setRefreshData,
  toast,
  config,
  configCustomization,
  userId,
}) => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [image, setImage] = React.useState("");
  const [mainContactName, setMainContactName] = React.useState("");
  const [mainContactEmail, setMainContactEmail] = React.useState("");
  const [mainContactPosition, setMainContactPosition] =
    React.useState("Proprietário");
  const [domain, setDomain] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [cnpj, setCnpj] = React.useState("");
  const [segment, setSegment] = React.useState("");
  const [employees, setEmployees] = React.useState("");

  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);
  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;
      const res = await api.post("/customers", {
        name,
        address,
        phone,
        image: imagePath,
        mainContactName,
        mainContactEmail,
        mainContactPosition,
        domain,
        website,
        cnpj,
        segment,
        employees,
        config,
      });
      if (res.data) {
        toast.success("Cliente Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "customers",
          userId: userId,
        });
      }
      setOpenAdd(false);
      if (!fromShortcut) {
        setRefreshData(!refreshData);
      }
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
      <DialogHeader title="Cliente" femaleGender={false} />
      <DialogContent>
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
              alt="Logotipo da Empresa"
              value={image}
              sx={{
                width: 250,
                height: 70,
                borderRadius: 1,
                cursor: "pointer",
              }}
              onClick={handleImageClick}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Prévia da Imagem"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <PhotoCameraIcon />
              )}
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
                sx={{ mt: 1 }}
              >
                Remover
              </Button>
            </FormHelperText>
          )}
        </Grid>

        <Grid container>
          <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
            Informações
          </Typography>
          <CheckCircleOutlineOutlinedIcon
            sx={{
              color: name && address && phone && cnpj ? "#50C878" : "lightgrey",
              ml: 1,
            }}
          />
        </Grid>

        <TextField
          label="Nome da Empresa"
          value={name}
          size="small"
          onChange={(e) => setName(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 350 }}
        />

        <TextField
          sx={{ mr: 1, width: 450, opacity: name ? 1 : 0 }}
          required
          value={address}
          size="small"
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          label="Endereço"
        />

        <Grid
          container
          sx={{ pr: "4%", mt: 2, mb: 4 }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item sx={{ opacity: address ? 1 : 0 }}>
            <Typography>Telefone</Typography>
            <IMaskInput
              style={{
                padding: "3%",
                marginRight: "2%",
                marginTop: "1%",
                borderColor: "#eee",
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
          <Grid item sx={{ opacity: phone ? 1 : 0 }}>
            <Typography>CNPJ</Typography>
            <IMaskInput
              style={{
                padding: "3%",
                marginRight: "2%",
                marginTop: "1%",
                borderColor: "#eee",
              }}
              mask="00.000.000/0000-00"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setCnpj(value)}
              overwrite
              value={cnpj}
            />
          </Grid>
          <Grid item sx={{ opacity: cnpj ? 1 : 0 }}>
            <TextField
              variant="outlined"
              label="Segmento"
              size="small"
              value={segment}
              required
              onChange={(e) => setSegment(e.target.value)}
              sx={{ mr: 1, mt: 1, width: 205 }}
            />
          </Grid>
        </Grid>

        {name && address && phone && cnpj && (
          <>
            <Divider sx={{ my: 3 }} />
            <Grid container>
              <Typography sx={{ mb: 2, fontSize: 18, fontWeight: "bold" }}>
                Contato Principal
              </Typography>
              <CheckCircleOutlineOutlinedIcon
                sx={{
                  color:
                    mainContactName && mainContactEmail && mainContactPosition
                      ? "#50C878"
                      : "lightgrey",
                  ml: 1,
                }}
              />
            </Grid>
            <TextField
              label="Nome"
              value={mainContactName}
              onChange={(e) => setMainContactName(e.target.value)}
              required
              size="small"
              variant="outlined"
              sx={{ mr: 1, width: 340 }}
            />
            <TextField
              label="Email"
              value={mainContactEmail}
              onChange={(e) => setMainContactEmail(e.target.value)}
              required
              size="small"
              variant="outlined"
              sx={{ mr: 1, width: 300, opacity: mainContactName ? 1 : 0 }}
            />

            <FormControl
              sx={{ mb: 1, width: 155, opacity: mainContactEmail ? 1 : 0 }}
            >
              <Select
                value={mainContactPosition}
                onChange={(e) => setMainContactPosition(e.target.value)}
                size="small"
                required
              >
                <MenuItem value={"Sócio"}>Sócio</MenuItem>
                <MenuItem value={"Proprietário"}>Proprietário</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {mainContactPosition && (
          <>
            <Checkbox
              checked={showAdditionalOptions}
              onChange={handleCheckboxChange}
            />
            <label>Dados Completos</label>

            {showAdditionalOptions && (
              <Box>
                <Typography sx={{ my: 2 }}>Domínio</Typography>
                <TextField
                  variant="outlined"
                  label="Website"
                  size="small"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  sx={{ mr: 1, width: 270 }}
                />
                <TextField
                  variant="outlined"
                  label="Domínio"
                  size="small"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  sx={{ mr: 1, width: 250 }}
                />

                <FormControl sx={{ width: 165 }}>
                  <Select
                    value={employees}
                    size="small"
                    onChange={(e) => setEmployees(e.target.value)}
                  >
                    <MenuItem value={"1-9"}>1 à 9</MenuItem>
                    <MenuItem value={"10-50"}>10 à 50</MenuItem>
                    <MenuItem value={"51-100"}>51 à 100</MenuItem>
                    <MenuItem value={"101-200"}>100 à 200</MenuItem>
                    <MenuItem value={"+201"}>201 ou mais</MenuItem>
                  </Select>
                  <FormHelperText># de Colaboradores</FormHelperText>
                </FormControl>
              </Box>
            )}
          </>
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
          onClick={() => setOpenAdd(!false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddCustomerForm;
