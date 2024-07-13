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
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import DialogHeader from "../components/small/DialogHeader";
import FormEndLineTenant from "../components/small/FormEndLineTenant";
import StringTableCell from "../components/small/tableCells/StringTableCell";
import SelectTableCell from "../components/small/tableCells/SelectTableCell";
import DateTableCell from "../components/small/tableCells/DateTableCell";
import DynamicDataTableCell from "../components/small/tableCells/DynamicDataTableCell";
import ProductsTableCell from "../components/small/tableCells/ProductsTableCell";

export default function AddFormModel(props) {
  const [fields, setFields] = React.useState({});
  const [image, setImage] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState([]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/dynamicEndpoint", {
        fields,
        selectedProducts,
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

  const handleProductChange = (product, count) => {
    setSelectedProducts((prev) => {
      console.log("Previous State:", prev);
      const existingProductIndex = prev.findIndex(
        (p) => p.name === product.name
      );

      let newState;
      if (existingProductIndex !== -1) {
        if (count > 0) {
          const updatedProducts = [...prev];
          updatedProducts[existingProductIndex].count = count;
          newState = updatedProducts;
        } else {
          newState = prev.filter((p) => p.name !== product.name);
        }
      } else {
        if (count > 0) {
          newState = [...prev, { ...product, count }];
        } else {
          newState = prev;
        }
      }

      console.log("Updated State:", newState);
      return newState;
    });
  };

  return (
    <form onSubmit={handleAdd}>
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
                    sx={{
                      mr: 1,
                      mb: fieldIndex === 0 ? 1 : 0,
                      width: field.type === "productList" ? "100%" : "auto",
                    }}
                  >
                    <Typography sx={{ fontSize: 14 }}>{field.label}</Typography>
                    {field.type === "string" && (
                      <StringTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                      />
                    )}
                    {field.type === "currency" && (
                      <StringTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        isCurrency
                      />
                    )}
                    {field.type === "password" && (
                      <StringTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        isPassword
                      />
                    )}
                    {field.type === "fullWidth" && (
                      <StringTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        isFullWidth
                      />
                    )}
                    {field.type === "select" && (
                      <SelectTableCell
                        fields={fields}
                        field={field}
                        menuOptions={field.options}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        isFullWidth
                      />
                    )}
                    {field.type === "multipleSelect" && (
                      <SelectTableCell
                        fields={fields}
                        field={field}
                        menuOptions={field.options}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        multiple
                      />
                    )}
                    {field.type === "date" && (
                      <DateTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                      />
                    )}
                    {field.type === "dynamicData" && (
                      <DynamicDataTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        multiple={field.multiple}
                      />
                      // <TextField
                      //   value={fields[field.name] || ""}
                      //   onChange={handleChange(field.name)}
                      //   sx={{
                      //     width:
                      //       modalOptions.maxWidth === "xs"
                      //         ? 190
                      //         : modalOptions.maxWidth === "sm"
                      //         ? 175
                      //         : modalOptions.maxWidth === "md"
                      //         ? 200
                      //         : 200,
                      //   }}
                      //   size="small"
                      //   required={field.required}
                      // />
                    )}
                    {field.type === "productList" && (
                      <ProductsTableCell
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        size="small"
                        required={field.required}
                        handleProductChange={handleProductChange}
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