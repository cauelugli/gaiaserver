/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Dialog,
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import AddDepartmentForm from "../forms/add/AddDepartmentForm";
import EditDepartmentForm from "../forms/edit/EditDepartmentForm";
import DeleteDepartmentForm from "../forms/delete/DeleteDepartmentForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function DepartmentTable({ openAdd, setOpenAdd }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState([]);

  const [departments, setDepartments] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await api.get("/departments");
        const users = await api.get("/users");
        const managers = await api.get("/managers");
        setDepartments(departments.data);
        setUsers(users.data);
        setManagers(managers.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [departments]);

  const fetchData = async () => {
    try {
      const departments = await api.get("/departments");
      const users = await api.get("/users");
      const managers = await api.get("/managers");
      setDepartments(departments.data);
      setUsers(users.data);
      setManagers(managers.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (customer) => {
    setOpenDetail(!openDetail);
    setSelectedDepartment(customer.name);
  };

  const handleOpenEdit = (customer) => {
    setOpenEdit(!openEdit);
    setSelectedDepartment(customer);
  };

  const handleConfirmDelete = (customer) => {
    setSelectedDepartment(customer);
    setOpenDelete(!openDelete);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            {departments.map((department) => (
              <>
                <TableRow
                  key={department._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: department.color,
                    "&:hover": { backgroundColor: "#ccc" },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(department)}
                    cursor="pointer"
                    align="left"
                    sx={{ color: "white", "&:hover": { color: "black" } }}
                  >
                    <Typography>{department.name}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && selectedDepartment === department.name}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6">Geral</Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Nome do Departamento
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Telefone
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <Typography>{department.name}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{department.phone}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6">Gerência</Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Nome do Gerente
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  E-mail
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Telefone
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Typography>
                                  {department.manager
                                    ? department.manager.name
                                    : "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {department.manager
                                    ? department.manager.email
                                    : "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {department.manager
                                    ? department.manager.phone
                                    : "-"}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6">
                          Membros ({department.members.length})
                        </Typography>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Typography>
                                  {department.members.map((user) => (
                                    <Chip
                                      sx={{ mx: 1 }}
                                      size="small"
                                      key={user.id}
                                      avatar={
                                        <Avatar
                                          sizes="small"
                                          sx={{
                                            backgroundColor: user.avatarColor,
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              color: "black",
                                              fontSize: "100%",
                                            }}
                                          >
                                            {user.name[0].toUpperCase()}
                                          </Typography>
                                        </Avatar>
                                      }
                                      label={
                                        <Typography
                                          sx={{
                                            fontSize: "100%",
                                          }}
                                        >
                                          {user.name}
                                        </Typography>
                                      }
                                    />
                                  ))}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 3, ml: "90%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleOpenEdit(department)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleConfirmDelete(department)}
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
      {openAdd && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAdd}
          onClose={() => setOpenAdd(!openAdd)}
        >
          <AddDepartmentForm
            openAdd={openAdd}
            users={users}
            managers={managers}
            setOpenAdd={setOpenAdd}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditDepartmentForm
            openEdit={openEdit}
            users={users}
            managers={managers}
            selectedDepartment={selectedDepartment}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteDepartmentForm
            selectedDepartment={selectedDepartment}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
