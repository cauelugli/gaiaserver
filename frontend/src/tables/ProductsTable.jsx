/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Avatar,
  Box,
  Collapse,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditProductForm from "../forms/edit/EditProductForm";
import DeleteProductForm from "../forms/delete/DeleteProductForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ProductsTable() {
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await api.get("/products");
        setProducts(products.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [products]);

  const fetchData = async () => {
    try {
      const products = await api.get("/products");
      setProducts(products.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (product) => {
    setOpenDetail(!openDetail);
    setSelectedProduct(product);
  };

  const handleOpenEdit = (product) => {
    setOpenEdit(!openEdit);
    setSelectedProduct(product);
  };

  const handleConfirmDelete = (product) => {
    setOpenDelete(!openDelete);
    setSelectedProduct(product);
  };

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ backgroundColor: "#ccc" }}>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Nome do Produto</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Valor de Compra</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Valor de Venda</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Em Estoque</Typography>
                </TableCell>
              </TableRow>
              {products.map((product) => (
                <>
                  <TableRow
                    key={product._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedProduct.name === product.name && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(product)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(product)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        R${product.buyValue}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(product)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        R${product.sellValue}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(product)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {product.quantity}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openDetail && selectedProduct.name === product.name}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Detalhes do Item
                          </Typography>
                          <Avatar
                            alt="Imagem do Produto"
                            src={product.image}
                            sx={{ width: 200, height: 200 }}
                          />
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Nome
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Valor de Compra
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Valor de Venda
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Lucro por Item
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Quantidade
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <Typography>{product.name}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>R${product.buyValue}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>R${product.sellValue}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography sx={{ color: "#32CD32" }}>
                                    {(
                                      ((product.sellValue - product.buyValue) /
                                        product.buyValue) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{product.quantity}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          <Box sx={{ mt: 3, ml: "90%" }}>
                            <ModeEditIcon
                              cursor="pointer"
                              onClick={() => handleOpenEdit(product)}
                              sx={{ color: "grey", mr: 2 }}
                            />
                            <DeleteIcon
                              cursor="pointer"
                              onClick={() => handleConfirmDelete(product)}
                              sx={{ color: "#ff4444" }}
                            />
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {openEdit && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditProductForm
              openEdit={openEdit}
              selectedProduct={selectedProduct}
              setOpenEdit={setOpenEdit}
              fetchData={fetchData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDelete && (
          <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
            <DeleteProductForm
              selectedProduct={selectedProduct}
              openDelete={openDelete}
              setOpenDelete={setOpenDelete}
              fetchData={fetchData}
              toast={toast}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}