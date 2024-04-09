/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";

import ArchiveIcon from "@mui/icons-material/Archive";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckIcon from "@mui/icons-material/Check";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import MenuIcon from "@mui/icons-material/Menu";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import UpgradeIcon from "@mui/icons-material/Upgrade";

import GenericDeleteForm from "../../../../forms/delete/GenericDeleteForm";
import GenericActivateForm from "../../../../forms/misc/GenericActivateForm";
import ResolveJobForm from "../../../../forms/misc/ResolveJobForm";

export default function JobTableActions(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openActivate, setOpenActivate] = React.useState(false);
  const [openResolve, setOpenResolve] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(props.selectedItem);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(selectedItem);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleConfirmActivate = () => {
    setOpenActivate(true);
    setAnchorEl(null);
  };

  const handleConfirmResolve = () => {
    setOpenResolve(true);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        size="small"
        onClick={handleClick}
        sx={{ "&:hover": { borderColor: "#eee" } }}
      >
        <MenuIcon sx={{ color: "#888" }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 210 }}>
          <ListItemButton
            disabled={
              props.job.status === "Concluido" ||
              props.job.status === "Aprovação Solicitada" ||
              props.job.status === "Aprovado"
            }
            onClick={(item) => {
              props.handleOpenEdit(item), setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Editar Job</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          {props.userRole.name === "Gerente" &&
            props.job.status === "Aprovação Solicitada" && (
              <ListItemButton
                disabled={props.job.status === "Concluido"}
                onClick={(item) => {props.handleManagerApproval(item), setAnchorEl(null);}}
              >
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>Aprovar Job</Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}

          {props.job.status !== "Concluido" &&
            props.job.status !== "Aprovado" &&
            props.userRole.name !== "Gerente" && (
              <ListItemButton
                onClick={(item) => {props.handleRequestApproval(item), setAnchorEl(null);}}
                disabled={
                  !props.job.manager ||
                  props.job.status === "Aprovação Solicitada"
                }
              >
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>
                      Solicitar Aprovação
                    </Typography>
                  }
                  secondary={
                    !props.job.manager && (
                      <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>
                        Departamento não possui Gerente
                      </Typography>
                    )
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}

          {props.job.status === "Aprovado" &&
            props.userRole.name !== "Gerente" && (
              <ListItemButton onClick={(item) => {handleConfirmResolve(item), setAnchorEl(null);}}>
                <ListItemIcon>
                  <DoneOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 14 }}>Resolver Job</Typography>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItemButton>
            )}

          <ListItemButton
            disabled={props.job.status === "Concluido"}
            onClick={(item) => {handleConfirmActivate(item), setAnchorEl(null);}}
          >
            <ListItemIcon>
              {props.job.status === "Arquivado" ? (
                <UpgradeIcon />
              ) : (
                <ArchiveIcon />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>
                  {props.job.status === "Arquivado" ? "Reativar" : "Arquivar"}{" "}
                  Job
                </Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            disabled={props.job.status === "Concluido"}
            onClick={(item) => {props.handleOpenAddJobInteraction(item), setAnchorEl(null);}}
          >
            <ListItemIcon>
              <CommentIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Interações</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            disabled={props.job.status === "Concluido"}
            onClick={(item) => {props.handleOpenAddAttachment(item), setAnchorEl(null);}}
          >
            <ListItemIcon>
              <AttachFileIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Anexar Arquivo</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>

          <ListItemButton
            disabled={props.job.status === "Concluido"}
            onClick={(item) => {handleConfirmDelete(item), setAnchorEl(null);}}
            sx={{ color: "red" }}
          >
            <ListItemIcon>
              <DeleteIcon sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14 }}>Deletar Job</Typography>
              }
              sx={{ ml: -3 }}
            />
          </ListItemButton>
        </List>
      </Menu>

      {openDialog && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
          <GenericDeleteForm
            selectedItem={props.selectedItem}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            toast={toast}
            endpoint="jobs"
            successMessage={`${
              props.selectedItem.title && props.selectedItem.title
            } Deletado com Sucesso`}
          />
        </Dialog>
      )}
      {openActivate && (
        <Dialog
          open={openActivate}
          onClose={() => setOpenActivate(!openActivate)}
        >
          <GenericActivateForm
            selectedItem={props.selectedItem}
            openDialog={openActivate}
            setOpenDialog={setOpenActivate}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            toast={toast}
            endpoint="jobs/activate"
            successMessage={`${
              props.selectedItem.title && props.selectedItem.title
            } ${
              props.selectedItem.isActive ? "Arquivado" : "Reativado"
            } com Sucesso`}
          />
        </Dialog>
      )}
      {openResolve && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openResolve}
          onClose={() => setOpenResolve(!openResolve)}
        >
          <ResolveJobForm
            userName={props.userName}
            selectedItem={props.selectedItem}
            refreshData={props.refreshData}
            setRefreshData={props.setRefreshData}
            openDialog={openResolve}
            setOpenDialog={setOpenResolve}
            toast={toast}
            successMessage="Job Resolvido"
          />
        </Dialog>
      )}
    </div>
  );
}
