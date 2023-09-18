/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import EditClientForm from "../forms/edit/EditClientForm";
import DeleteClientForm from "../forms/delete/DeleteClientForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ClientTable() {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState([]);

  const [clients, setClients] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [clients]);

  const fetchData = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (client) => {
    setOpenDetail(!openDetail);
    setSelectedClient(client.name);
  };

  const handleOpenEdit = (client) => {
    setOpenEdit(!openEdit);
    setSelectedClient(client);
  };

  const handleConfirmDelete = (client) => {
    setSelectedClient(client);
    setOpenDelete(!openDelete);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {clients.map((client) => (
              <>
                <TableRow
                  key={client._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedClient === client.name && openDetail
                        ? "#eee"
                        : "none",
                    "&:hover": { backgroundColor: "#eee " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(client)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {client.name}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && selectedClient === client.name}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          Geral
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
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
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  CPF
                                </Typography>
                              </TableCell>
                              
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <Typography>{client.email}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{client.phone}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{client.cpf}</Typography>
                              </TableCell>
                              
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          Endereços
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Residencial
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Entrega
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Cobrança
                                </Typography>
                              </TableCell>
                              
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <Typography>{client.addressHome}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{client.addressDelivery}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{client.addressBill}</Typography>
                              </TableCell>
                              
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <Box sx={{ my: 4, ml: "90%" }}>
                        <ModeEditIcon
                          cursor="pointer"
                          option="delete"
                          onClick={() => handleOpenEdit(client)}
                          sx={{ color: "grey", mr: 2 }}
                        />
                        <DeleteIcon
                          cursor="pointer"
                          option="delete"
                          onClick={() => handleConfirmDelete(client)}
                          sx={{ color: "#ff4444" }}
                        />
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
          maxWidth="xs"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditClientForm
            openEdit={openEdit}
            selectedClient={selectedClient}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteClientForm
            selectedClient={selectedClient}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}