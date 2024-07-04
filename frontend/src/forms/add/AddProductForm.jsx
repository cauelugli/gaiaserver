/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Popover,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

export default function AddProductForm({
  userName,
  onClose,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
  userId,
  type,
}) {
  const [selectedType, setSelectedType] = React.useState(type);
  const [name, setName] = React.useState("");
  const [fields, setFields] = React.useState([]);
  const [image, setImage] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [newFieldName, setNewFieldName] = React.useState("");
  const [newFieldType, setNewFieldType] = React.useState("a");

  const [newStringOptionMinCharacter, setNewStringOptionMinCharacter] =
    React.useState(1);
  const [newStringOptionMaxCharacter, setNewStringOptionMaxCharacter] =
    React.useState(80);

  const [newNumberOptionType, setNewNumberOptionType] =
    React.useState("integer");
  const [newNumberOptionMinValue, setNewNumberOptionMinValue] =
    React.useState(0);
  const [newNumberOptionMaxValue, setNewNumberOptionMaxValue] =
    React.useState(1);

  const [newOptions, setNewOptions] = React.useState([]);
  const [newOptionItem, setNewOptionItem] = React.useState("");
  const [newOptionAllowMultiple, setNewOptionAllowMultiple] =
    React.useState("");

  const [newDateType, setNewDateType] = React.useState("simple");
  const [newDateValue, setNewDateValue] = React.useState(1);
  const [newDatePeriod, setNewDatePeriod] = React.useState("day");

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;
      const productResponse = await api.post("/products", {
        name,
        fields,
        type: selectedType,
        image: imagePath,
        createdBy: userName,
      });

      if (productResponse.data) {
        toast.success("Produto Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "stock",
          userId: userId,
        });
      }
      onClose();
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleAddField = () => {
    const newField = {
      index: fields.length,
      name: newFieldName,
      type: newFieldType,
    };

    if (newFieldType === "string") {
      newField.minCharacter = newStringOptionMinCharacter;
      newField.maxCharacter = newStringOptionMaxCharacter;
    } else if (newFieldType === "number") {
      newField.numberType = newNumberOptionType;
      newField.minValue = newNumberOptionMinValue;
      newField.maxValue = newNumberOptionMaxValue;
    } else if (newFieldType === "options") {
      newField.options = newOptions;
      newField.allowMultiple = newOptionAllowMultiple;
    } else if (newFieldType === "date") {
      newField.newDateType = newDateType;
      newField.newDateValue = newDateValue;
      newField.newDatePeriod = newDatePeriod;
    }

    setFields((prevFields) => [...prevFields, newField]);
    setNewFieldName("");
    setNewFieldType("a");
    setNewStringOptionMinCharacter(1);
    setNewStringOptionMaxCharacter(80);
    setNewNumberOptionType("integer");
    setNewNumberOptionMinValue(0);
    setNewNumberOptionMaxValue(1);
    setNewOptions([]);
    setNewOptionItem("");
    setNewOptionAllowMultiple("");
    setNewDateType("simple");
    setNewDateValue(1);
    setNewDatePeriod("day");
    handleClosePopover();
  };

  const handleAddOptionItem = () => {
    setNewOptions((prevOptions) => [...prevOptions, newOptionItem]);
    setNewOptionItem("");
  };

  const handleRemoveLastOptionItem = () => {
    setNewOptions((prevOptions) => prevOptions.slice(0, -1));
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title={selectedType} femaleGender={false} />
      <DialogContent>
        <Grid
          id="bigRow"
          container
          spacing={1.5}
          wrap="wrap"
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Tipo</Typography>
            <TextField
              size="small"
              value={selectedType}
              disabled
              variant="outlined"
              sx={{ width: 150 }}
            />
          </Grid>

          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 150 }}
            />
          </Grid>

          {fields.map((field, index) => (
            <Grid key={index} item>
              <Typography>
                {field.type === "string" ? (
                  <Grid item>
                    <Typography sx={{ fontSize: 13 }}>
                      {`Campo ${index + 1}: Texto`}
                    </Typography>
                    <TextField
                      size="small"
                      sx={{ width: 150 }}
                      value={field.name}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                ) : field.type === "number" ? (
                  <Grid item>
                    <Typography sx={{ fontSize: 13 }}>
                      {`Campo ${index + 1}: Número`}
                    </Typography>
                    <TextField
                      size="small"
                      sx={{ width: 150 }}
                      value={`${field.name} ${field.minValue} ~ ${field.maxValue}`}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                ) : field.type === "options" ? (
                  <Grid item>
                    <Typography sx={{ fontSize: 13 }}>{`Lista ${index + 1}: ${
                      field.name
                    } ${field.allowMultiple && "(Múltiplo)"}`}</Typography>

                    <Select size="small" sx={{width: 150 }}>
                      {field.options.map((opt, index) => (
                        <MenuItem key={index} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                ) : field.type === "date" ? (
                  <Grid item>
                    <Typography sx={{ fontSize: 13 }}>
                      {`Campo ${index + 1}: Data`}
                    </Typography>
                    <TextField
                      size="small"
                      sx={{ width: 150 }}
                      value={field.name}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                ) : field.type === "currency" ? (
                  <Grid item>
                    <Typography sx={{ fontSize: 13 }}>
                      {`Campo ${index + 1}: Moeda (R$)`}
                    </Typography>
                    <TextField
                      size="small"
                      sx={{ width: 150 }}
                      value={field.name}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                ) : (
                  ""
                )}
              </Typography>
            </Grid>
          ))}
          <Button
            variant="contained"
            size="small"
            onClick={handleOpenPopover}
            sx={{ maxWidth: 80, mt: 4, ml: 1 }}
          >
            <Typography sx={{ fontSize: 11 }}>Adicionar Campo</Typography>
          </Button>
        </Grid>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Grid container direction="column" sx={{ p: 2 }}>
            <Typography>Novo Campo</Typography>
            <Grid item>
              <TextField
                label="Nome do Campo"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                size="small"
                sx={{ my: 2 }}
              />
            </Grid>
            <Grid item>
              <Select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                size="small"
                sx={{ mb: 2, width: "100%" }}
              >
                <MenuItem disabled value="a">
                  <Typography>Tipo do Campo</Typography>
                </MenuItem>
                <MenuItem value={"string"}>Texto</MenuItem>
                <MenuItem value={"number"}>Número</MenuItem>
                <MenuItem value={"currency"}>Moeda (R$)</MenuItem>
                <MenuItem value={"options"}>Lista de Opções</MenuItem>
                <MenuItem value={"date"}>Data</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              {newFieldType === "string" && (
                <Grid sx={{ my: 2, mx: 1 }}>
                  <Typography>Caracteres</Typography>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography sx={{ fontSize: 10 }}>Min</Typography>
                      <TextField
                        type="number"
                        value={newStringOptionMinCharacter}
                        onChange={(e) =>
                          setNewStringOptionMinCharacter(e.target.value)
                        }
                        size="small"
                        sx={{ maxWidth: 90 }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontSize: 10 }}>Max</Typography>
                      <TextField
                        type="number"
                        value={newStringOptionMaxCharacter}
                        onChange={(e) =>
                          setNewStringOptionMaxCharacter(e.target.value)
                        }
                        size="small"
                        sx={{ maxWidth: 90 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item>
              {newFieldType === "number" && (
                <>
                  <Grid sx={{ mt: 2 }}>
                    <Typography>Tipo de Número</Typography>
                    <RadioGroup
                      row
                      value={newNumberOptionType}
                      onChange={(e) => setNewNumberOptionType(e.target.value)}
                    >
                      <FormControlLabel
                        value="integer"
                        control={
                          <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                        }
                        label={
                          <Typography sx={{ fontSize: 13 }}>Inteiro</Typography>
                        }
                      />
                      <FormControlLabel
                        value="float"
                        control={
                          <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                        }
                        label={
                          <Typography sx={{ fontSize: 13 }}>Decimal</Typography>
                        }
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid sx={{ my: 2 }}>
                    <Typography>Valores</Typography>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography sx={{ fontSize: 10 }}>Min</Typography>
                        <TextField
                          type="number"
                          value={newNumberOptionMinValue}
                          onChange={(e) =>
                            setNewNumberOptionMinValue(e.target.value)
                          }
                          size="small"
                          sx={{ maxWidth: 90 }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography sx={{ fontSize: 10 }}>Max</Typography>
                        <TextField
                          type="number"
                          value={newNumberOptionMaxValue}
                          onChange={(e) =>
                            setNewNumberOptionMaxValue(e.target.value)
                          }
                          size="small"
                          sx={{ maxWidth: 90 }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item>
              {newFieldType === "options" && (
                <>
                  <Grid sx={{ my: 1 }}>
                    <Grid container direction="row" alignItems="center">
                      <Typography>Permitir Múltiplos</Typography>
                      <Checkbox
                        size="small"
                        checked={newOptionAllowMultiple}
                        onChange={(e) =>
                          setNewOptionAllowMultiple(e.target.checked)
                        }
                      />
                    </Grid>
                  </Grid>{" "}
                  <Grid sx={{ mb: 2 }}>
                    <Typography>Itens da Lista</Typography>
                    <Grid container alignItems="center" sx={{ my: 2 }}>
                      <TextField
                        value={newOptionItem}
                        onChange={(e) => setNewOptionItem(e.target.value)}
                        size="small"
                        placeholder="Nome do Item"
                        sx={{ mr: 1, width: 170 }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddOptionItem}
                      >
                        + Item
                      </Button>
                    </Grid>
                    {newOptions.map((option, index) => (
                      <Grid container alignItems="center" key={index}>
                        <Typography sx={{ mr: 1 }}>
                          Item {index + 1}: {option}
                        </Typography>
                        {index === newOptions.length - 1 && (
                          <DeleteIcon
                            onClick={handleRemoveLastOptionItem}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item>
              {newFieldType === "date" && (
                <>
                  <Grid sx={{ mt: 2, mb: newDateType === "simple" ? 2 : 0 }}>
                    <Typography>Tipo de Data</Typography>
                    <RadioGroup
                      row
                      value={newDateType}
                      onChange={(e) => setNewDateType(e.target.value)}
                    >
                      <FormControlLabel
                        value="simple"
                        control={
                          <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                        }
                        label={
                          <Typography sx={{ fontSize: 13 }}>Simples</Typography>
                        }
                      />
                      <FormControlLabel
                        value="range"
                        control={
                          <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                        }
                        label={
                          <Typography sx={{ fontSize: 13 }}>Período</Typography>
                        }
                      />
                    </RadioGroup>
                  </Grid>
                  {newDateType === "range" && (
                    <Grid sx={{ my: 2 }}>
                      <Typography sx={{ mb: 1 }}>Data Composta</Typography>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <Typography sx={{ fontSize: 10, ml: 1 }}>
                            #
                          </Typography>
                          <TextField
                            type="number"
                            value={newDateValue}
                            onChange={(e) => setNewDateValue(e.target.value)}
                            size="small"
                            sx={{ maxWidth: 70 }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography sx={{ fontSize: 10 }}>Período</Typography>
                          <Select
                            size="small"
                            sx={{ mr: 1, width: 130 }}
                            value={newDatePeriod}
                            onChange={(e) => setNewDatePeriod(e.target.value)}
                          >
                            <MenuItem value={"day"}>Dias</MenuItem>
                            <MenuItem value={"week"}>Semanas</MenuItem>
                            <MenuItem value={"month"}>Meses</MenuItem>
                            <MenuItem value={"year"}>Anos</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
            {/* <Grid item>{newFieldType === "currency" && ""}</Grid> */}
            <Button
              variant="contained"
              onClick={handleAddField}
              disabled={!newFieldName || newFieldType === "a"}
            >
              Adicionar
            </Button>
          </Grid>
        </Popover>

        {image && (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <img
                src={URL.createObjectURL(image)}
                alt="Prévia da Imagem"
                style={{
                  marginTop: 20,
                  maxWidth: "200px",
                  maxHeight: "200px",
                }}
              />
            </Grid>
            <Grid item>
              <FormHelperText>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => setImage("")}
                >
                  Remover
                </Button>
              </FormHelperText>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} />
      <DialogActions sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onClose();
          }}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
