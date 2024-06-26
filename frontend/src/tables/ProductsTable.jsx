/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Avatar,
  Box,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import EditProductForm from "../forms/edit/EditProductForm";
import StockTableActions from "../components/small/buttons/tableActionButtons/StockTableActions";

export default function ProductsTable({
  products,
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
  topBar,
  userId,
}) {
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "brand",
      label: "Marca",
    },
    {
      id: "type",
      label: "Tipo",
    },
    {
      id: "model",
      label: "Modelo",
    },
    {
      id: "size",
      label: "Tamanho",
    },
    {
      id: "quantity",
      label: "Estoque",
    },
    {
      id: "buyValue",
      label: "Valor de Compra",
    },
    {
      id: "sellValue",
      label: "Valor de Venda",
    },
    {
      id: "actions",
      label: "Ações",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    return [...products].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [products, order, orderBy]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Nome" ? "" : "center"}
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    pl: headCell.label === "Nome" ? "" : 5,
                  }}
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
            {sortedRows
              .filter((item) => {
                const itemProperty = searchOption
                  .split(".")
                  .reduce((obj, key) => obj[key], item);
                return (
                  itemProperty &&
                  itemProperty.toLowerCase().includes(searchValue.toLowerCase())
                );
              })
              .map((product) => (
                <TableRow key={product._id}>
                  <TableCell sx={{ py: 0 }}>
                    <Avatar
                      src={`http://localhost:3000/static/${product.image}`}
                      alt={product.name[0]}
                      style={{
                        marginLeft: 10,
                        width: 42,
                        height: 42,
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13 }}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {product.brand}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {product.type}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {product.model}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {product.size}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {product.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      R${product.buyValue.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      R${product.sellValue.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <StockTableActions
                      userId={userId}
                      type="Produto"
                      setOpenEdit={setOpenEdit}
                      selectedItem={selectedProduct}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                    />
                  </TableCell>
                </TableRow>
              ))
              .slice(startIndex, endIndex)}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"por Página"}
          labelDisplayedRows={({ from, to, count }) => {
            return " " + from + " à " + to + " total " + count;
          }}
        />
      </TableContainer>

      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditProductForm
            userId={userId}
            openEdit={openEdit}
            selectedProduct={selectedProduct}
            setOpenEdit={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
