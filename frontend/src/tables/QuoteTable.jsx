/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Grid,
  Avatar,
  TableSortLabel,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function QuoteTable({
  topBar,
  type,
  searchValue,
  searchOption,
  quotes,
}) {
  let tableHeaderRow;

  if (type === "job") {
    tableHeaderRow = [
      {
        id: "number",
        label: "#",
      },
      {
        id: "service",
        label: "Serviço",
      },
      {
        id: "customer",
        label: "Cliente",
      },
      {
        id: "user.name",
        label: "Colaborador",
      },
      {
        id: "department",
        label: "Departamento",
      },
      {
        id: "value",
        label: "Valor Total",
      },
      {
        id: "actions",
        label: "Ações",
      },
    ];
  } else {
    tableHeaderRow = [
      {
        id: "number",
        label: "#",
      },
      {
        id: "materials",
        label: "Itens",
      },
      {
        id: "customer",
        label: "Cliente",
      },
      {
        id: "user.name",
        label: "Colaborador",
      },
      {
        id: "department",
        label: "Departamento",
      },
      {
        id: "price",
        label: "Valor Total",
      },
      {
        id: "actions",
        label: "Ações",
      },
    ];
  }

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("number");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  const sortedRows = React.useMemo(() => {
    const compare = (a, b) => {
      const sellerA = a.seller ? a.seller.name : "";
      const sellerB = b.seller ? b.seller.name : "";

      if (order === "asc") {
        return sellerA.localeCompare(sellerB);
      } else {
        return sellerB.localeCompare(sellerA);
      }
    };

    if (orderBy === "user.name") {
      return [...quotes].sort(compare);
    }

    return [...quotes].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [quotes, order, orderBy]);

  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState("");

  const openViewDialog = (file) => {
    setPdfUrl(
      `http://localhost:3000/static/docs/orcamento-${type[0]}-${file.number}${
        file.version !== 0 ? `.${file.version}` : ""
      }.pdf`
    );
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handlePrint = () => {
    const printWindow = window.open(pdfUrl, "_blank");

    if (printWindow) {
      printWindow.onload = function () {
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
    } else {
      console.error("Não foi possível abrir a janela de impressão.");
    }
  };

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            <TableRow>
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "#" ? "" : "center"}
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    pl: headCell.label === "#" ? "" : 5,
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
              // .filter((item) => {
              //   const itemProperty = searchOption
              //     .split(".")
              //     .reduce((obj, key) => obj[key], item);
              //   return (
              //     itemProperty &&
              //     itemProperty.toLowerCase().includes(searchValue.toLowerCase())
              //   );
              // })
              .map((quote) => (
                <>
                  <TableRow key={quote._id}>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13 }}>
                        {quote.number}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      {type === "job" ? (
                        <Typography sx={{ fontSize: 13 }}>
                          {quote.service}
                        </Typography>
                      ) : (
                        <Grid container direction="row" justifyContent="center">
                          {quote.materials.slice(0, 3).map((item) => (
                            <Grid
                              direction="column"
                              key={item.id}
                              alignItems="center"
                              sx={{ mr: 1 }}
                            >
                              <Grid item>
                                <Avatar
                                  alt="Imagem do Produto"
                                  src={`http://localhost:3000/static/${item.image}`}
                                  sx={{ width: 32, height: 32, mx: "auto" }}
                                />
                              </Grid>
                              <Grid item>
                                <Typography
                                  sx={{ fontSize: 10, color: "#777" }}
                                >
                                  x{item.quantity} {item.name}
                                </Typography>
                              </Grid>
                            </Grid>
                          ))}
                          {quote.materials.length > 3 && (
                            <Typography
                              sx={{
                                marginY: "auto",
                                fontSize: 24,
                                color: "#444",
                              }}
                            >
                              +{quote.materials.length - 3}
                            </Typography>
                          )}
                        </Grid>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {type === "job" ? quote.customer.name : quote.customer}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {quote.user}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {quote.department}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        R${quote.value.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0 }}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <IconButton>
                          <PictureAsPdfIcon
                            cursor="pointer"
                            onClick={() => openViewDialog(quote)}
                          />
                        </IconButton>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </>
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
      <Dialog
        open={viewDialogOpen}
        onClose={closeViewDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Visualização do Orçamento</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#ccc", width: "100%", pl: 6 }}>
          <Box style={{ height: "auto" }}>
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <Viewer fileUrl={pdfUrl} />
            </Worker>
          </Box>
        </DialogContent>
        <DialogActions sx={{ my: 1, mr: 2 }}>
          <Button
            onClick={handlePrint}
            color="primary"
            variant="contained"
            size="small"
          >
            Imprimir | Download
          </Button>
          <Button onClick={closeViewDialog} color="primary" size="small">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
