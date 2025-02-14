/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Customers({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [canBeDeleted, setCanBeDeleted] = React.useState(null);
  const [allowSameNameCustomer, setAllowSameNameCustomer] =
    React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].customers);
        setCanBeDeleted(config.data[0].customers.canBeDeleted);
        setAllowSameNameCustomer(
          config.data[0].customers.allowSameNameCustomer
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeCustomersConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/customers", {
        canBeDeleted,
        allowSameNameCustomer,
      });

      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
      socket.emit("forceRefresh");
    } catch (err) {
      console.log("erro", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <form onSubmit={handleChangeCustomersConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Clientes
      </DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Accordion sx={{ width: "100%" }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Permissões
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12, color: "white" }}>
                            Se a opção marcada for "Sim", os Clientes criados
                            poderão ser deletados pelos colaboradores. A opção
                            padrão é "Sim".
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto", mr: 1 }}>
                          Clientes Podem ser Deletados
                        </Typography>
                      </Tooltip>
                      <RadioGroup
                        row
                        value={canBeDeleted}
                        onChange={(e) => setCanBeDeleted(e.target.value)}
                      >
                        <FormControlLabel
                          value={Boolean(true)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Sim</Typography>
                          }
                        />
                        <FormControlLabel
                          value={Boolean(false)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Não</Typography>
                          }
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12, color: "white" }}>
                            Se a opção marcada for "Sim", novos Clientes Empresa
                            poderão ser criados com nomes que já existem no
                            sistema. A opção padrão é "Não". Clientes Pessoa
                            Física NÃO PODEM ser duplicados (por conta do
                            vínculo com o CPF).
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto", mr: 1 }}>
                          Criar Cliente com Mesmo Nome
                        </Typography>
                      </Tooltip>
                      <RadioGroup
                        row
                        value={allowSameNameCustomer}
                        onChange={(e) =>
                          setAllowSameNameCustomer(e.target.value)
                        }
                      >
                        <FormControlLabel
                          value={Boolean(true)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Sim</Typography>
                          }
                        />
                        <FormControlLabel
                          value={Boolean(false)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Não</Typography>
                          }
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="success">
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </form>
  );
}
