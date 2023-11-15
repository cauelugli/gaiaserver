/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import axios from "axios";

import {
  Avatar,
  Box,
  Collapse,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditUserForm from "../forms/edit/EditUserForm";
import DeleteUserForm from "../forms/delete/DeleteUserForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function UserTable({ searchValue, searchOption }) {
  const [selectedUser, setSelectedUser] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [users, setUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [positions, setPositions] = React.useState([]);

  const [openImage, setOpenImage] = React.useState(false);

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/users");
        const departments = await api.get("/departments");
        const positions = await api.get("/positions");
        setUsers(users.data);
        setDepartments(departments.data);
        setPositions(positions.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const users = await api.get("/users");
      const departments = await api.get("/departments");
      const positions = await api.get("/positions");
      setUsers(users.data);
      setDepartments(departments.data);
      setPositions(positions.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (user) => {
    setOpenDetail(!openDetail);
    setSelectedUser(user);
  };

  const handleOpenEdit = (user) => {
    setOpenEdit(!openEdit);
    setSelectedUser(user);
  };

  const handleConfirmDelete = (user) => {
    setOpenDelete(!openDelete);
    setSelectedUser(user);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "email",
      label: "E-mail",
    },
    {
      id: "phone",
      label: "Telefone",
    },
    {
      id: "department.name",
      label: "Departamento",
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

    if (orderBy === "department.name") {
      return [...users].sort(compare);
    }

    return [...users].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [users, order, orderBy]);

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableRow
              sx={{
                backgroundColor: "#ccc",
              }}
            >
              <TableCell padding="checkbox"></TableCell>
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Nome" ? "" : "center"}
                  sx={{
                    fontSize: 16,
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
              .filter((user) => {
                const userProperty = searchOption
                  .split(".")
                  .reduce((obj, key) => obj[key], user);
                return (
                  userProperty &&
                  userProperty.toLowerCase().includes(searchValue.toLowerCase())
                );
              })
              .map((row) => (
                <React.Fragment key={row._id}>
                  <TableRow
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedUser.name === row.name && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                    onClick={() => handleOpenDetail(row)}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(row)}
                      cursor="pointer"
                      sx={{ py: 0 }}
                    >
                      <Avatar
                        src={`http://localhost:3000/static/${row.image}`}
                        alt={row.name[0]}
                        cursor="pointer"
                        style={{
                          marginLeft: 10,
                          width: 42,
                          height: 42,
                          opacity:
                            openDetail && selectedUser.name === row.name
                              ? 0
                              : 100,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(row)}
                      cursor="pointer"
                    >
                      <Typography sx={{ fontSize: 14 }}>{row.name}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(row)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 14 }}>{row.email}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(row)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 14 }}>{row.phone}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(row)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {row.department ? (
                          <Grid
                            container
                            direction="row"
                            justifyContent="center"
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 12,
                                height: 12,
                                borderRadius: 50,
                                backgroundColor: row.department.color,
                              }}
                            >
                              {" "}
                            </Paper>
                            <Typography>{row.department.name}</Typography>
                          </Grid>
                        ) : (
                          "-"
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                      <Collapse
                        in={openDetail && selectedUser.name === row.name}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold", my: 2 }}
                          >
                            Informações
                          </Typography>
                          <Grid
                            container
                            direction="row"
                            justifyContent="space-around"
                          >
                            <Grid item>
                              <Grid
                                container
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Avatar
                                  alt="Imagem do Produto"
                                  cursor="pointer"
                                  src={`http://localhost:3000/static/${row.image}`}
                                  sx={{ width: 200, height: 200, mr: 4 }}
                                  onDoubleClick={handleOpenImage}
                                />
                                <Dialog
                                  open={openImage}
                                  onClose={handleCloseImage}
                                >
                                  <DialogContent>
                                    <img
                                      cursor="pointer"
                                      src={`http://localhost:3000/static/${row.image}`}
                                      alt="Imagem do Usuário"
                                      style={{ maxWidth: "100%" }}
                                    />
                                  </DialogContent>
                                </Dialog>
                              </Grid>
                            </Grid>
                            <Grid item>
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
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        E-mail
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Telefone
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Departamento
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>
                                      <Typography>{row.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography>{row.email}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography>{row.phone}</Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography>
                                        {row.department ? (
                                          <Grid container direction="row">
                                            <Paper
                                              elevation={0}
                                              sx={{
                                                mr: 1,
                                                mt: 0.5,
                                                width: 15,
                                                height: 15,
                                                borderRadius: 50,
                                                backgroundColor:
                                                  row.department.color,
                                              }}
                                            >
                                              {" "}
                                            </Paper>
                                            <Typography>
                                              {row.department.name}
                                            </Typography>
                                          </Grid>
                                        ) : (
                                          "-"
                                        )}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                              <Table size="small" sx={{ mt: 4 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Cargo
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Nome de Operador
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Nível de Acesso
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell align="center">
                                      <Typography>
                                        {row.position ? row.position : "-"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography>
                                        {row.username ? row.username : "-"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography>
                                        {row.role ? row.role : "-"}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Grid>
                            <Box sx={{ mt: 3, ml: "90%" }}>
                              <ModeEditIcon
                                cursor="pointer"
                                onClick={() => handleOpenEdit(row)}
                                sx={{ color: "grey", mr: 2 }}
                              />
                              <DeleteIcon
                                cursor="pointer"
                                onClick={() => handleConfirmDelete(row)}
                                sx={{ color: "#ff4444" }}
                              />
                            </Box>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </Table>
        </TableContainer>

        {openEdit && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditUserForm
              openEdit={openEdit}
              selectedUser={selectedUser}
              departments={departments}
              positions={positions}
              setOpenEdit={setOpenEdit}
              fetchData={fetchData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDelete && (
          <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
            <DeleteUserForm
              selectedUser={selectedUser}
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
