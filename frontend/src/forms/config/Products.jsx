/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import dayjs from "dayjs";

const socket = io("http://localhost:5002");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import AddBaseProductForm from "../add/AddBaseProductForm";

export default function Products({
  onClose,
  userId,
  userName,
  configCustomization,
}) {
  const [configData, setConfigData] = React.useState([]);
  const [refreshData, setRefreshData] = React.useState(false);
  const [baseProducts, setBaseProducts] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [canBeDeleted, setCanBeDeleted] = React.useState(null);

  const [openAddProduct, setOpenAddProduct] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const products = await api.get("/get", {
          params: { model: "Product" },
        });
        setBaseProducts(products.data.filter((product) => !product.name));
        setProducts(products.data.filter((product) => product.name));
        setConfigData(config.data[0].products);
        setCanBeDeleted(config.data[0].products.canBeDeleted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleChangeProductsConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/products", {
        canBeDeleted,
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
    <>
      <form onSubmit={handleChangeProductsConfig}>
        <DialogTitle
          sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
        >
          Configurações de Produtos
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
                      Produtos Base
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {baseProducts.map((product, index) => (
                      <Accordion sx={{ width: "100%" }} key={index}>
                        <AccordionSummary
                          expandIcon={<icons.ArrowDropDownIcon />}
                        >
                          <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                            {product.type}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            sx={{ fontSize: 14, my: 1, fontWeight: "bold" }}
                          >
                            Campos do Produto
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    #
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Nome do Campo
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Tipo do Campo
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Propriedades
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {product.fields.map((field, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 12 }}>
                                      {field.index + 1}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontSize: 12 }}>
                                      {field.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 12 }}>
                                      {field.type === "string" && "Texto"}
                                      {field.type === "number" && "Número"}
                                      {field.type === "options" &&
                                        "Lista de Opções"}
                                      {field.type === "currency" &&
                                        "Moeda (R$)"}
                                      {field.type === "date" && "Data"}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography sx={{ fontSize: 12 }}>
                                      {field.type === "string" &&
                                        `Min ${field.minCharacter} Max ${field.maxCharacter} Caracteres`}
                                      {field.type === "number" &&
                                        `Tipo: ${
                                          field.numberType === "integer"
                                            ? "Inteiro"
                                            : "Decimal"
                                        }, Min ${field.minValue} Max ${
                                          field.maxValue
                                        }`}
                                      {field.type === "options" && (
                                        <Grid container direction="row">
                                          <Typography
                                            sx={{ mr: 1, fontSize: 12 }}
                                          >
                                            Opções:
                                          </Typography>
                                          {field.options.map(
                                            (option, index) => (
                                              <Typography
                                                key={index}
                                                sx={{ mr: 1, fontSize: 12 }}
                                              >
                                                {option}
                                              </Typography>
                                            )
                                          )}
                                        </Grid>
                                      )}
                                      {field.type === "currency" && "-"}
                                      {field.type === "date" &&
                                        `Tipo: ${
                                          field.newDateType === "simple"
                                            ? "Simples"
                                            : "Período"
                                        } ${
                                          field.newDateType === "period"
                                            ? `${field.newDateValue} ${field.newDatePeriod} `
                                            : ""
                                        }`}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <Typography
                            sx={{
                              fontSize: 14,
                              my: 1,
                              mt: 3,
                              fontWeight: "bold",
                            }}
                          >
                            Produtos Criados (
                            {
                              products.filter(
                                (prod) => product.type === prod.type
                              ).length
                            }
                            )
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                      ml: 1,
                                    }}
                                  >
                                    📷
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Nome do Produto
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Criador
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    Criado em
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {products
                                .filter((prod) => product.type === prod.type)
                                .map((prod, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Avatar
                                        src={`http://localhost:3000/static/${prod.images[0]}`}
                                        alt={prod.name[0]}
                                        style={{
                                          width: 32,
                                          height: 32,
                                        }}
                                      />
                                    </TableCell>

                                    <TableCell>
                                      <Typography sx={{ fontSize: 12 }}>
                                        {prod.name ? prod.name : "-"}
                                      </Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Typography sx={{ fontSize: 12 }}>
                                        {prod.createdBy ? prod.createdBy : "-"}
                                      </Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Typography sx={{ fontSize: 12 }}>
                                        {prod.createdAt
                                          ? dayjs(prod.createdAt).format(
                                              "DD/MM/YYYY HH:mm:ss"
                                            )
                                          : "-"}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </AccordionDetails>
                        <Button
                          color="inherit"
                          sx={{ ml: "92%", pr: 1, pb: 1 }}
                        >
                          <icons.SettingsIcon />
                        </Button>
                      </Accordion>
                    ))}

                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ mt: 2 }}
                    >
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setOpenAddProduct(true)}
                          sx={{ ml: 1 }}
                        >
                          Novo Produto
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: "100%", mt: 2 }}>
                  <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      Permissões
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item sx={{ my: 1.5 }}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        sx={{ px: 4 }}
                      >
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: 12, color: "white" }}>
                              Se a opção marcada for "Sim", os Produtos criados
                              poderão ser deletados pelos colaboradores. A opção
                              padrão é "Sim".
                            </Typography>
                          }
                        >
                          <Typography sx={{ my: "auto", mr: 1 }}>
                            Produtos Podem ser Deletados
                          </Typography>
                        </Tooltip>
                        <RadioGroup
                          row
                          value={canBeDeleted}
                          onChange={(e) => setCanBeDeleted(e.target.value)}
                        >
                          <FormControlLabel
                            value={Boolean(true)}
                            control={
                              <Radio
                                size="small"
                                sx={{ mt: -0.25, mr: -0.5 }}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: 13 }}>Sim</Typography>
                            }
                          />
                          <FormControlLabel
                            value={Boolean(false)}
                            control={
                              <Radio
                                size="small"
                                sx={{ mt: -0.25, mr: -0.5 }}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: 13 }}>Não</Typography>
                            }
                          />
                        </RadioGroup>
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
      {openAddProduct && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddProduct}
          onClose={() => setOpenAddProduct(!openAddProduct)}
        >
          <AddBaseProductForm
            userName={userName}
            userId={userId}
            onClose={() => setOpenAddProduct(!openAddProduct)}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
            toast={toast}
          />
        </Dialog>
      )}
    </>
  );
}
