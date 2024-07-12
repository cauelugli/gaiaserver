/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import DialogHeader from "../components/small/DialogHeader";
import FormEndLineTenant from "../components/small/FormEndLineTenant";

export default function AddFormModel(props) {
  const [fields, setFields] = React.useState({});
  const [image, setImage] = React.useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/dynamicEndpoint", {
        fields,
      });
      if (res.data) {
        toast.success("Perfil de Acesso Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      props.setOpenAdd(!!props.openAdd);
      !props.setRefreshData(!props.refreshData);
    } catch (err) {
      if (
        (err.response && err.response.status === 422) ||
        err.response.status === 420
      ) {
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

  const modalOptions = props.options.find(
    (option) => option.label === props.selectedOptionLabel
  ).modal;

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleChange = (fieldName) => (e) => {
    setFields({
      ...fields,
      [fieldName]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleAdd}>
      <Button onClick={() => console.log("fields", fields)}>view fields</Button>
      <DialogHeader
        title={modalOptions.label}
        femaleGender={modalOptions.femaleGender}
        extraSmall
      />
      <DialogContent>
        {modalOptions.fieldsSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 0.5 }}>
              {section.name !== "image" && section.label}
            </Typography>
            {section.name === "image" && (
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
                      sx={{ width: 80, height: 80, cursor: "pointer" }}
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
                        sx={{ mt: 1 }}
                      >
                        Remover
                      </Button>
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            )}
            <Grid container direction="row">
              {modalOptions.fields
                .filter(
                  (field) =>
                    field.fieldSection ===
                    modalOptions.fieldsSections[sectionIndex].name
                )
                .map((field, fieldIndex) => (
                  <Grid
                    key={fieldIndex}
                    item
                    sx={{ mr: 1, mb: fieldIndex === 0 ? 1 : 0 }}
                  >
                    <Typography sx={{ fontSize: 14 }}>{field.label}</Typography>
                    {field.type === "string" && (
                      <TextField
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        sx={{
                          width:
                            modalOptions.maxWidth === "xs"
                              ? 190
                              : modalOptions.maxWidth === "sm"
                              ? 175
                              : modalOptions.maxWidth === "md"
                              ? 200
                              : 200,
                        }}
                        size="small"
                        required={field.required}
                      />
                    )}
                    {field.type === "currency" && (
                      <TextField
                        type="number"
                        value={fields[field.name] || 0}
                        onChange={handleChange(field.name)}
                        sx={{
                          width:
                            modalOptions.maxWidth === "xs"
                              ? 190
                              : modalOptions.maxWidth === "sm"
                              ? 175
                              : modalOptions.maxWidth === "md"
                              ? 200
                              : 200,
                        }}
                        size="small"
                        required={field.required}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">R$</InputAdornment>
                          ),
                        }}
                      />
                    )}
                    {field.type === "password" && (
                      <TextField
                        type="password"
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        sx={{
                          width:
                            modalOptions.maxWidth === "xs"
                              ? 190
                              : modalOptions.maxWidth === "sm"
                              ? 175
                              : modalOptions.maxWidth === "md"
                              ? 200
                              : 200,
                        }}
                        size="small"
                        required={field.required}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">R$</InputAdornment>
                          ),
                        }}
                      />
                    )}
                    {field.type === "fullWidth" && (
                      <TextField
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        sx={{ width: "336%" }}
                        size="small"
                        required={field.required}
                      />
                    )}
                    {field.type === "select" && (
                      <Select
                        sx={{
                          width:
                            modalOptions.maxWidth === "xs"
                              ? 190
                              : modalOptions.maxWidth === "sm"
                              ? 175
                              : modalOptions.maxWidth === "md"
                              ? 200
                              : 200,
                        }}
                        size="small"
                        required={field.required}
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                      >
                        {field.options.map((option, index) => (
                          <MenuItem value={option} key={index}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    {field.type === "multipleSelect" && (
                      <Select
                        sx={{
                          width:
                            modalOptions.maxWidth === "xs"
                              ? 190
                              : modalOptions.maxWidth === "sm"
                              ? 175
                              : modalOptions.maxWidth === "md"
                              ? 200
                              : 200,
                        }}
                        multiple
                        size="small"
                        required={field.required}
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                      >
                        {field.options.map((option, index) => (
                          <MenuItem value={option} key={index}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    {field.type === "date" && (
                      <TextField
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        sx={{
                          width:
                            modalOptions.maxWidth === "xs"
                              ? 190
                              : modalOptions.maxWidth === "sm"
                              ? 175
                              : modalOptions.maxWidth === "md"
                              ? 200
                              : 200,
                        }}
                        size="small"
                        required={field.required}
                      />
                    )}
                    {field.type === "dynamicData" && (
                      <TextField
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        sx={{
                          width:
                            modalOptions.maxWidth === "xs"
                              ? 190
                              : modalOptions.maxWidth === "sm"
                              ? 175
                              : modalOptions.maxWidth === "md"
                              ? 200
                              : 200,
                        }}
                        size="small"
                        required={field.required}
                      />
                    )}
                    {field.type === "attachments" && (
                      <TextField
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        sx={{ width: "336%" }}
                        size="small"
                        required={field.required}
                      />
                    )}
                    {field.type === "list" && (
                      <TextField
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        sx={{ width: "336%" }}
                        size="small"
                        required={field.required}
                      />
                    )}
                    {field.type === "checkbox" && (
                      <Checkbox
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        size="small"
                        required={field.required}
                      />
                    )}
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <FormEndLineTenant
        configCustomization={props.configCustomization}
        extraSmall
      />
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => props.setOpenAdd(!props.openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
