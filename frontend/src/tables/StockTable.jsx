/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
import StockTableActions from "../components/small/buttons/tableActionButtons/StockTableActions";

import EditStockItemForm from "../forms/edit/EditStockItemForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function StockTable({
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
  topBar,
}) {
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);

  const [stockItems, setStockItems] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const stockItems = await api.get("/stockItems");
        setStockItems(stockItems.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
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
      id: "quantity",
      label: "Estoque",
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
    return [...stockItems].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [stockItems, order, orderBy]);

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
    <Box sx={{ width: topBar ? "105%" : "100%" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow sx={{ backgroundColor: "#eee" }}>
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
              .map((stockItem) => (
                <>
                  <TableRow key={stockItem._id}>
                    <TableCell sx={{ py: 0 }}>
                      <Avatar
                        src={`http://localhost:3000/static/${stockItem.image}`}
                        alt={stockItem.name[0]}
                        cursor="pointer"
                        style={{
                          marginLeft: 10,
                          width: 42,
                          height: 42,
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13 }}>
                        {stockItem.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        R${stockItem.buyValue}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        R${stockItem.sellValue}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {stockItem.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => setSelectedItem(stockItem)}
                    >
                      <StockTableActions
                        type="Material"
                        setOpenEdit={setOpenEdit}
                        selectedItem={selectedItem}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                      />
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

      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="sm"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditStockItemForm
            openEdit={openEdit}
            selectedStockItem={selectedItem}
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
