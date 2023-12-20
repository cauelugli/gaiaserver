/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import BuildIcon from "@mui/icons-material/Build";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WorkIcon from "@mui/icons-material/Work";

import CustomersModal from "../forms/config/Customers";
import UsersModal from "../forms/config/Users";
import DepartmentsModal from "../forms/config/Departments";
import RequestsModal from "../forms/config/Requests";
import QuotesModal from "../forms/config/Quotes";
import ServicesModal from "../forms/config/Services";
import StockModal from "../forms/config/Stock";
import FinanceModal from "../forms/config/Finance";
import FilesModal from "../forms/config/Files";
import CustomizationModal from "../forms/config/Customization";

const options = [
  {
    icon: <WorkIcon sx={{ fontSize: 48 }} />,
    text: "Clientes",
    modal: <CustomersModal />,
  },
  {
    icon: <GroupIcon sx={{ fontSize: 48 }} />,
    text: "Colaboradores",
    modal: <UsersModal />,
  },
  {
    icon: <LanIcon sx={{ fontSize: 48 }} />,
    text: "Departamentos",
    modal: <DepartmentsModal />,
  },
  {
    icon: <GradingIcon sx={{ fontSize: 48 }} />,
    text: "Pedidos",
    modal: <RequestsModal />,
  },
  {
    icon: <RequestQuoteIcon sx={{ fontSize: 48 }} />,
    text: "Orçamentos",
    modal: <QuotesModal />,
  },
  {
    icon: <BuildIcon sx={{ fontSize: 48 }} />,
    text: "Serviços",
    modal: <ServicesModal />,
  },
  {
    icon: <WarehouseIcon sx={{ fontSize: 48 }} />,
    text: "Estoque",
    modal: <StockModal />,
  },
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 48 }} />,
    text: "Financeiro",
    modal: <FinanceModal />,
  },
  {
    icon: <InsertDriveFileIcon sx={{ fontSize: 48 }} />,
    text: "Arquivos",
    modal: <FilesModal />,
  },
  {
    icon: <AutoFixNormalIcon sx={{ fontSize: 48 }} />,
    text: "Personalização",
    modal: <CustomizationModal />,
  },
];

export default function Config({ user }) {
  // const [refreshData, setRefreshData] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [configData, setConfigData] = useState([]);

  const handleItemClick = (modal) => {
    setOpenModal(modal);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = await api.get("/config");
      setConfigData(config.data);
      console.log("config.data", config.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateInitialConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/config");
      if (res.data) {
        toast.success("Configuração Inicial Criada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        fetchData();
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <>
      <Typography
        sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, mb: 2, fontWeight: "bold" }}
      >
        Configurações
      </Typography>
      {configData.length !== 0 ? (
        <Grid container rowSpacing={2} columnSpacing={{ md: 4, lg: 4 }}>
          {options.map((config, index) => (
            <Grid
              item
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleItemClick(config.modal)}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 150,
                  p: "20px",
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  transition: "background-color 0.3s, color 0.3s",
                  backgroundColor: hoveredIndex === index ? "#777" : "initial",
                  color: hoveredIndex === index ? "white" : "#777",
                  cursor: "pointer",
                }}
              >
                {config.icon}
                <Typography sx={{ mt: 1 }}>{config.text}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Typography>Crie a Configuração Inicial</Typography>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleCreateInitialConfig}
          >
            Criar
          </Button>
        </>
      )}

      <Dialog
        open={!!openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        test="hey"
      >
        <DialogContent>
          {openModal && React.cloneElement(openModal, { onClose: () => setOpenModal(null) })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
