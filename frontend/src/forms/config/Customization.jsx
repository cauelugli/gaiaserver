/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SketchPicker } from "react-color";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Customization({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [mainColor, setMainColor] = React.useState(null);
  const [fontColor, setFontColor] = React.useState(null);
  const [logo, setLogo] = React.useState(null);
  const [logoBlack, setLogoBlack] = React.useState(null);
  const [newLogo, setNewLogo] = React.useState(null);
  const [newLogoBlack, setNewLogoBlack] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState(null);
  const [logoBlackPreview, setLogoBlackPreview] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].customization);
        setMainColor(config.data[0].customization.mainColor);
        setFontColor(config.data[0].customization.fontColor);
        setLogo(config.data[0].customization.logo);
        setLogoBlack(config.data[0].customization.logoBlack);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleImageClick = () => {
    document.getElementById("logoInput").click();
  };

  const handleLogoChange = (e) => {
    const selectedLogo = e.target.files[0];
    setNewLogo(selectedLogo);
    setLogoPreview(URL.createObjectURL(selectedLogo));
  };

  const handleImageBlackClick = () => {
    document.getElementById("logoBlackInput").click();
  };

  const handleLogoBlackChange = (e) => {
    const selectedLogo = e.target.files[0];
    setNewLogoBlack(selectedLogo);
    setLogoBlackPreview(URL.createObjectURL(selectedLogo));
  };

  const handleChangeCustomizationConfig = async (e) => {
    e.preventDefault();
    let updatedImagePath = configData.logo;
    let updatedImageBlackPath = configData.logoBlack;

    if (newLogo) {
      const formData = new FormData();
      formData.append("image", newLogo);
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      updatedImagePath = uploadResponse.data.imagePath;
    }
    if (newLogoBlack) {
      const formData = new FormData();
      formData.append("image", newLogoBlack);
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      updatedImageBlackPath = uploadResponse.data.imagePath;
    }

    try {
      const res = await api.put("/config/customization", {
        mainColor,
        fontColor,
        logo: updatedImagePath,
        logoBlack: updatedImageBlackPath,
      });

      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
      socket.emit("forceRefresh");
    } catch (err) {
      console.log("erro", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <form onSubmit={handleChangeCustomizationConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Personalização
      </DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Accordion sx={{ width: "100%" }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Cores
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid container direction="row">
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            A cor que será utilizada no sistema. Forneça um
                            valor hexadecimal de seis caracteres. A opção padrão
                            é "#32aacd"
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto" }}>
                          Cor Principal
                        </Typography>
                      </Tooltip>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={mainColor}
                        onChange={(e) => setMainColor(e.target.value)}
                        sx={{ mx: 1, width: "25%" }}
                      />
                      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <icons.ColorLensIcon sx={{ fontSize: 28 }} />
                      </IconButton>
                      <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <SketchPicker
                          color={mainColor || "#32aacd"}
                          onChange={(color) => setMainColor(color.hex)}
                          disableAlpha
                        />
                      </Popover>
                      <Paper
                        sx={{
                          m: 1,
                          width: 28,
                          height: 28,
                          backgroundColor: mainColor,
                          borderRadius: 50,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid container direction="row">
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            A cor da fonte que será utilizada na barra lateral.
                            Forneça um valor hexadecimal de seis caracteres,
                            também pode ser utilizado "black" ou "white". A
                            opção padrão é "white"
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto" }}>
                          Cor da Fonte
                        </Typography>
                      </Tooltip>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        sx={{ mx: 1, width: "25%" }}
                      />
                      <IconButton
                        onClick={(e) => setAnchorEl2(e.currentTarget)}
                      >
                        <icons.ColorLensIcon sx={{ fontSize: 28 }} />
                      </IconButton>
                      <Popover
                        open={Boolean(anchorEl2)}
                        anchorEl={anchorEl2}
                        onClose={() => setAnchorEl2(null)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <SketchPicker
                          color={fontColor}
                          onChange={(color) => setFontColor(color.hex)}
                          disableAlpha
                          presetColors={["#ffffff", "#000000"]}
                        />
                      </Popover>
                      <Paper
                        sx={{
                          m: 1,
                          width: 28,
                          height: 28,
                          backgroundColor: fontColor,
                          borderRadius: 50,
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: "bold" }}
                    >
                    Logotipo
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item sx={{ mt: 2.5 }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-evenly"
                      alignItems="flex-start"
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            O logotipo da sua empresa. Tamanho máximo da imagem:
                            2MB. Suportados formatos '.png' e '.jpeg'. O tamanho
                            ideal é em torno de 500x200.
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto", mr: 4 }}>
                          Logotipo Principal
                        </Typography>
                      </Tooltip>
                      <label htmlFor="logoInput" style={{ cursor: "pointer" }}>
                        {logo && !newLogo ? (
                          <img
                            src={`http://localhost:3000/static/${logo}`}
                            alt="Logotipo"
                            style={{
                              width: "auto",
                              height: 90,
                              marginLeft: 10,
                              backgroundColor: "#ccc",
                            }}
                          />
                        ) : newLogo ? (
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <img
                              src={URL.createObjectURL(newLogo)}
                              alt="Prévia da Imagem"
                              style={{
                                width: "auto",
                                height: 90,
                                backgroundColor: "#ccc",
                              }}
                            />
                            <FormHelperText>Novo Logotipo</FormHelperText>
                          </Grid>
                        ) : (
                          <Typography
                            sx={{
                              width: 90,
                              height: 90,
                              lineHeight: "90px",
                              textAlign: "center",
                              backgroundColor: "#ccc",
                              borderRadius: 2,
                            }}
                          >
                            Clique para adicionar
                          </Typography>
                        )}
                      </label>
                      <input
                        type="file"
                        id="logoInput"
                        accept=".png, .jpeg, .jpg"
                        onChange={handleLogoChange}
                        style={{ display: "none" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item sx={{ mt: 2.5 }}>
                    <Grid
                      container
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-evenly"
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            O logotipo da sua empresa com fundo, ou na cor
                            preta. Será utilizado em partes do sistema onde a
                            cor do fundo é branca. Tamanho máximo da imagem:
                            2MB. Suportados formatos '.png' e '.jpeg'. O tamanho
                            ideal é em torno de 500x200.
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto", mr: 4  }}>
                          Logotipo com Fundo
                        </Typography>
                      </Tooltip>
                      <label
                        htmlFor="logoBlackInput"
                        style={{ cursor: "pointer" }}
                      >
                        {logoBlack && !newLogoBlack ? (
                          <img
                            src={`http://localhost:3000/static/${logoBlack}`}
                            alt="Logotipo com Fundo"
                            style={{
                              width: "auto",
                              height: 90,
                              marginLeft: 10,
                              backgroundColor: "#ccc",
                            }}
                          />
                        ) : newLogoBlack ? (
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <img
                              src={URL.createObjectURL(newLogoBlack)}
                              alt="Prévia da Imagem com Fundo"
                              style={{
                                width: "auto",
                                height: 90,
                                backgroundColor: "#ccc",
                              }}
                            />
                            <FormHelperText>Novo Logotipo Preto</FormHelperText>
                          </Grid>
                        ) : (
                          <Typography
                            sx={{
                              width: 90,
                              height: 90,
                              lineHeight: "90px",
                              textAlign: "center",
                              backgroundColor: "#ccc",
                              borderRadius: 2,
                            }}
                          >
                            Clique para adicionar
                          </Typography>
                        )}
                      </label>
                      <input
                        type="file"
                        id="logoBlackInput"
                        accept=".png, .jpeg, .jpg"
                        onChange={handleLogoBlackChange}
                        style={{ display: "none" }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="success">
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </form>
  );
}
