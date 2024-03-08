/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
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

import EditPositionForm from "../forms/edit/EditPositionForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";

import GroupMembers from "../components/small/GroupMembers";
import PositionTableActions from "../components/small/buttons/tableActionButtons/PositionTableActions";

export default function GroupTable({
  configData,
  groups,
  users,
  managers,
  toast,
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
}) {
  const [selectedGroup, setSelectedGroup] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome do Grupo",
    },
    {
      id: "members",
      label: "Membros",
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
    const compare = (a, b) => {
      const departmentA = a.department ? a.department.name : "";
      const departmentB = b.department ? b.department.name : "";

      if (order === "asc") {
        return departmentA.localeCompare(departmentB);
      } else {
        return departmentB.localeCompare(departmentA);
      }
    };

    if (orderBy === "position.name") {
      return [...groups].sort(compare);
    }

    return [...groups].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [groups, order, orderBy]);

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
    <>
      <Box sx={{ minWidth: "1250px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow
                sx={{
                  backgroundColor: "#ccc",
                }}
              >
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    align={headCell.label === "Nome do Grupo" ? "" : "center"}
                    sx={{
                      fontSize: 13,
                      fontWeight: "bold",
                      pl: headCell.label === "Nome do Grupo" ? "" : 5,
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
                .filter((user) => {
                  const userProperty = searchOption
                    .split(".")
                    .reduce((obj, key) => obj[key], user);
                  return (
                    userProperty &&
                    userProperty
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  );
                })
                .map((group) => (
                  <>
                    <TableRow
                      key={group._id}
                      sx={{ "&:hover": { backgroundColor: "#eee " } }}
                    >
                      <TableCell>
                        <Typography sx={{ fontSize: 13 }}>
                          {group.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {/* here */}
                        <GroupMembers
                          members={group.members}
                          users={users}
                          managers={managers}
                        />
                      </TableCell>
                      <TableCell
                        cursor="pointer"
                        align="center"
                        onClick={() => setSelectedGroup(group)}
                      >
                        {/* here */}
                        <PositionTableActions
                          configData={configData}
                          setOpenEdit={setOpenEdit}
                          selectedItem={selectedGroup}
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
            maxWidth="xs"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            {/* here */}
            <EditPositionForm
              openEdit={openEdit}
              selectedGroup={selectedGroup}
              setOpenEdit={setOpenEdit}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDialog && (
          <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
            <GenericDeleteForm
              selectedItem={selectedItem}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              toast={toast}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              endpoint="groups"
              successMessage={`${
                selectedItem.name && selectedItem.name
              } Deletado com Sucesso`}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
