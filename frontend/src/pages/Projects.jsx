/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";
import TableFilters from "../components/TableFilters";

import AddProjectForm from "../forms/add/AddProjectForm";
import ProjectsTable from "../tables/ProjectsTable";
import ProjectsTableButton from "../components/small/buttons/tableButtons/ProjectsTableButton";
import ProjectTemplates from "../forms/misc/ProjectTemplates";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Projects({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [configData, setConfigData] = React.useState([]);
  const [configCustomization, setConfigCustomization] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [projectsTemplates, setProjectsTemplates] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  const [openAddProject, setOpenAddProject] = React.useState(false);
  const [openAddTemplate, setOpenAddTemplate] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);

  const [searchOption, setSearchOption] = React.useState("name");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Nome");
  const [searchValue, setSearchValue] = React.useState("");

  const searchOptionList = [{ options: [{ value: "name", label: "Nome" }] }];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await api.get("/projects");
        const projectsTemplates = await api.get("/projects/projectsTemplates");
        const customers = await api.get("/customers");
        const clients = await api.get("/clients");
        const departments = await api.get("/departments");
        const services = await api.get("/services");
        const products = await api.get("/products");
        const config = await api.get("/config");
        setConfigData(config.data[0].projects);
        setConfigCustomization(config.data[0].customization);
        setProjects(projects.data);
        setProjectsTemplates(projectsTemplates.data);
        setCustomers(customers.data);
        setClients(clients.data);
        setDepartments(departments.data);
        setServices(services.data);
        setProducts(products.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = (confirm) => {
    setOpenConfirmDialog(false);
    if (confirm) {
      setOpenAddProject(false);
    }
  };

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography
          sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
        >
          Projetos
        </Typography>
        <ProjectsTableButton
          setOpenAddProject={setOpenAddProject}
          setOpenAddTemplate={setOpenAddTemplate}
        />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Em execução</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {projects.length === 0 ? (
          <NoDataText option="Projetos" femaleGender={false} />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={"quote"}
              searchOptionList={searchOptionList[0]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            <ProjectsTable
              user={user}
              projects={projects}
              configData={configData}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>

      {openAddProject && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddProject}
          onClose={(event, reason) => {
            if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
              setOpenAddProject(!openAddProject);
            } else {
              handleOpenConfirmDialog();
            }
          }}
        >
          <AddProjectForm
            configData={configData}
            openAdd={openAddProject}
            user={user}
            handleOpenConfirmDialog={handleOpenConfirmDialog}
            customers={customers}
            services={services}
            products={products}
            clients={clients}
            departments={departments}
            setOpenAdd={setOpenAddProject}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            template=""
          />
        </Dialog>
      )}
      {openAddTemplate && (
        <Dialog
          fullWidth
          maxWidth={selectedTemplate ? "lg" : "sm"}
          open={openAddTemplate}
          onClose={() => {
            setOpenAddTemplate(!openAddTemplate), setSelectedTemplate(null);
          }}
        >
          {!selectedTemplate && (
            <ProjectTemplates
              departments={departments}
              projectsTemplates={projectsTemplates}
              setSelectedTemplate={setSelectedTemplate}
            />
          )}

          {selectedTemplate && (
            <AddProjectForm
              configData={configData}
              openAdd={openAddProject}
              user={user}
              handleOpenConfirmDialog={handleOpenConfirmDialog}
              customers={customers}
              services={services}
              products={products}
              clients={clients}
              departments={departments}
              setOpenAdd={setOpenAddProject}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              template={selectedTemplate}
            />
          )}
        </Dialog>
      )}
      <Dialog
        open={openConfirmDialog}
        onClose={() => handleCloseConfirmDialog(false)}
      >
        <DialogContent>
          <DialogContentText>
            Deseja realmente fechar este formulário? Todas as alterações não
            salvas serão perdidas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleCloseConfirmDialog(false)}
          >
            Manter o Formulário
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleCloseConfirmDialog(true)}
            autoFocus
          >
            Fechar e Apagar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
