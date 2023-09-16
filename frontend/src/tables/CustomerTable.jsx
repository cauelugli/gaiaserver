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

import AddCustomerForm from "../forms/add/AddCustomerForm";
import EditCustomerForm from "../forms/edit/EditCustomerForm";
import DeleteCustomerForm from "../forms/delete/DeleteCustomerForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function CustomerTable({ openAdd, setOpenAdd }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState([]);

  const [customers, setCustomers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (customer) => {
    setOpenDetail(!openDetail);
    setSelectedCustomer(customer.name);
  };

  const handleOpenEdit = (customer) => {
    setOpenEdit(!openEdit);
    setSelectedCustomer(customer);
  };

  const handleConfirmDelete = (customer) => {
    setSelectedCustomer(customer);
    setOpenDelete(!openDelete);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {customers.map((customer) => (
              <>
                <TableRow
                  key={customer._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedCustomer === customer.name && openDetail
                        ? "#eee"
                        : "none",
                    "&:hover": { backgroundColor: "#eee " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(customer)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {customer.name}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && selectedCustomer === customer.name}
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
                                  Endereço
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
                                  CNPJ
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Segmento
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  # de Colaboradores
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <Typography>{customer.address}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{customer.phone}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{customer.cnpj}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{customer.segment}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{customer.employees}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          Domínio
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Website
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Domínio
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Typography>{customer.website}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{customer.domain}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <Box sx={{ my: 4, px: 6 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          Contato Principal
                        </Typography>
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
                                  E-mail
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#777" }}
                                >
                                  Posição
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Typography>
                                  {customer.mainContactName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {customer.mainContactEmail}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {customer.mainContactPosition}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <Box sx={{ my: 4, ml: "90%" }}>
                        <ModeEditIcon
                          cursor="pointer"
                          option="delete"
                          onClick={() => handleOpenEdit(customer)}
                          sx={{ color: "grey", mr: 2 }}
                        />
                        <DeleteIcon
                          cursor="pointer"
                          option="delete"
                          onClick={() => handleConfirmDelete(customer)}
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
      {openAdd && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAdd}
          onClose={() => setOpenAdd(!openAdd)}
        >
          <AddCustomerForm
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
            fetchData={fetchData}
            toast={toast}
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
          <EditCustomerForm
            openEdit={openEdit}
            selectedCustomer={selectedCustomer}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteCustomerForm
            selectedCustomer={selectedCustomer}
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
