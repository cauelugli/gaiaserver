/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@mui/material";

import ProductsTable from "../../src/tables/ProductsTable";
import StandardTable from "../../src/tables/StardardTable";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function TableModel(props) {
  const [idIndexList, setIdIndexList] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("number");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = await api.get("/idIndexList");
        setIdIndexList(ids.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.items]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    return [...props.items].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [props.items, order, orderBy]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const filteredRows = React.useMemo(() => {
    if (props.page === "users" && props.tabIndex === 0) {
      return sortedRows.filter((row) => !row.isManager);
    } else if (props.page === "users" && props.tabIndex === 1) {
      return sortedRows.filter((row) => row.isManager);
    }
    return sortedRows;
  }, [sortedRows, props.page, props.tabIndex]);

  return (
    <Box sx={{ width: props.topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            <TableRow>
              {props.page === "products" || props.page === "materials" ? (
                <>
                  <TableCell align="left" id="image">
                    📷
                  </TableCell>
                  <TableCell
                    align="left"
                    id="name"
                    sx={{ fontSize: 13, fontWeight: "bold" }}
                  >
                    Nome
                  </TableCell>
                  {props.items[props.itemIndex]?.fields &&
                    props.items[props.itemIndex].fields.map(
                      (headCell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          align={cellIndex === 0 ? "" : "left"}
                          sx={{ fontSize: 13, fontWeight: "bold" }}
                          sortDirection={
                            orderBy === headCell.id ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={() => handleRequestSort(headCell)}
                          >
                            {headCell.name}
                          </TableSortLabel>
                        </TableCell>
                      )
                    )}
                </>
              ) : (
                props.tableColumns[props.itemIndex].map(
                  (headCell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      align={cellIndex === 0 ? "" : "left"}
                      sx={{ fontSize: 13, fontWeight: "bold" }}
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
                  )
                )
              )}
              <TableCell
                align="center"
                sx={{ fontSize: 13, fontWeight: "bold" }}
              >
                Ações
              </TableCell>
            </TableRow>
            {props.page === "products" || props.page === "materials" ? (
              <ProductsTable
                items={props.items}
                filteredRows={filteredRows}
                startIndex={startIndex}
                endIndex={endIndex}
                page={props.page}
                userId={props.userId}
                tabIndex={props.tabIndex}
                refreshData={props.refreshData}
                setRefreshData={props.setRefreshData}
                configCustomization={props.configCustomization}
              />
            ) : (
              <StandardTable
                filteredRows={filteredRows}
                startIndex={startIndex}
                endIndex={endIndex}
                tableColumns={props.tableColumns}
                itemIndex={props.itemIndex}
                idIndexList={idIndexList}
                page={props.page}
                tabIndex={props.tabIndex}
                userId={props.userId}
                refreshData={props.refreshData}
                setRefreshData={props.setRefreshData}
                configCustomization={props.configCustomization}
              />
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"por Página"}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </TableContainer>
    </Box>
  );
}
