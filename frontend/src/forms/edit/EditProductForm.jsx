/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditProductForm({
  selectedProduct,
  openEdit,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
  userId,
}) {
  const [name, setName] = React.useState(selectedProduct.name);
  const [brand, setBrand] = React.useState(selectedProduct.brand);
  // eslint-disable-next-line no-unused-vars
  const [image, setImage] = React.useState(selectedProduct.image);
  const [newImage, setNewImage] = React.useState("");
  const [type, setType] = React.useState(selectedProduct.type);
  const [model, setModel] = React.useState(selectedProduct.model);
  const [size, setSize] = React.useState(selectedProduct.size);
  const [groupingType, setGroupingType] = React.useState(
    selectedProduct.groupingType
  );
  const [buyValue, setBuyValue] = React.useState(selectedProduct.buyValue);
  const [sellValue, setSellValue] = React.useState(selectedProduct.sellValue);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      let updatedImagePath = selectedProduct.image;

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);
        const uploadResponse = await api.post("/uploads/singleFile", formData);
        updatedImagePath = uploadResponse.data.imagePath;
      }

      const res = await api.put("/products", {
        productId: selectedProduct._id,
        name,
        brand,
        image: updatedImagePath,
        type,
        model,
        size,
        groupingType,
        buyValue,
        sellValue,
      });

      if (res.data) {
        toast.success("Produto Editado!", {
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

      setOpenEdit(!openEdit);
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

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Produto</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 200 }}
            />
          </Grid>

          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 13 }}>Marca</Typography>
            <TextField
              size="small"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>

          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 13 }}>Tipo</Typography>
            <TextField
              size="small"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>

          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 13 }}>Tamanho</Typography>
            <TextField
              size="small"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>

          <Grid item sx={{ mx: 1 }}>
            <Typography sx={{ fontSize: 13 }}>Modelo</Typography>
            <TextField
              size="small"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>

          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Agrupamento</Typography>
            <Select
              size="small"
              value={groupingType}
              onChange={(e) => setGroupingType(e.target.value)}
              required
              sx={{ width: 100 }}
            >
              <MenuItem value="Unidade">
                <Typography>Unidade</Typography>
              </MenuItem>
              <MenuItem value="Caixa">
                <Typography>Caixa</Typography>
              </MenuItem>
              <MenuItem value="Kit">
                <Typography>Kit</Typography>
              </MenuItem>
            </Select>
          </Grid>
          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 13 }}>Valor de Compra</Typography>
            <TextField
              type="number"
              size="small"
              value={buyValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    R$
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setBuyValue(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 120 }}
            />
          </Grid>

          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 13 }}>Valor de Venda</Typography>
            <TextField
              type="number"
              size="small"
              value={sellValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    R$
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setSellValue(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 120 }}
            />
          </Grid>
          <Grid item sx={{ ml: 1, mt: 2.5 }}>
            {sellValue > 0 && buyValue > 0 && (
              <Typography style={{ color: "green", fontSize: 12 }}>
                +{(((sellValue - buyValue) / buyValue) * 100).toFixed(2)}% por{" "}
                {groupingType}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid sx={{ mt: 2 }}>
          <Typography>Imagem</Typography>
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
          {!newImage && (
            <label htmlFor="fileInput">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                size="small"
                startIcon={<FileUploadIcon />}
              >
                Alterar Imagem
              </Button>
            </label>
          )}
        </Grid>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: newImage ? 5 : 0 }}>
            {selectedProduct.image && (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={`http://localhost:3000/static/${selectedProduct.image}`}
                  alt="Prévia da Imagem"
                  style={{
                    marginTop: 20,
                    width: "200px",
                    height: "200px",
                    opacity: newImage ? "0.5" : "1",
                  }}
                />
                {newImage && <Typography>Imagem Anterior</Typography>}
              </Grid>
            )}
          </Grid>
          <Grid item sx={{ ml: 5 }}>
            {newImage && (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <img
                    src={URL.createObjectURL(newImage)}
                    alt="Prévia da Imagem"
                    style={{
                      marginTop: 20,
                      width: "200px",
                      height: "200px",
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography>Nova Imagem</Typography>
                </Grid>
                <Grid item>
                  <FormHelperText>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => setNewImage("")}
                    >
                      Remover
                    </Button>
                  </FormHelperText>
                </Grid>
              </Grid>
            )}
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
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
