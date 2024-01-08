/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
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

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Customers({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [customersCanBeDeleted, setCustomersCanBeDeleted] =
    React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].customers);
        setCustomersCanBeDeleted(
          config.data[0].customers.customersCanBeDeleted
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
        customersCanBeDeleted,
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
              <Grid item sx={{ my: 1.5 }}>
                <Grid container direction="row">
                  <Typography sx={{ my: "auto" }}>
                    Clientes Podem ser Deletados
                  </Typography>
                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: 12 }}>
                        Se a opção marcada for "Sim", os Clientes poderão ser
                        deletados DEFINITIVAMENTE. A opção padrão é "Sim".
                      </Typography>
                    }
                  >
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        color: "#32aacd",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                      }}
                    >
                      ?
                    </Button>
                  </Tooltip>
                  <RadioGroup
                    row
                    value={customersCanBeDeleted}
                    onChange={(e) => setCustomersCanBeDeleted(e.target.value)}
                  >
                    <FormControlLabel
                      value={Boolean(true)}
                      control={
                        <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                      }
                      label={<Typography sx={{ fontSize: 13 }}>Sim</Typography>}
                    />

                    <FormControlLabel
                      value={Boolean(false)}
                      control={
                        <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                      }
                      label={<Typography sx={{ fontSize: 13 }}>Não</Typography>}
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
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
