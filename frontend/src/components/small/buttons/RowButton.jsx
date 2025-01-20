/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
} from "@mui/material";

import { icons } from "../../../icons";
import EditFormModel from "../../../forms/edit/EditFormModel";

import { modals } from "../../../options/modals";
import rowButtonOptions from "../../../options/rowButtonOptions";

import { checkAvailability } from "../../../../../controllers/functions/overallFunctions";

import DeleteFormModel from "../../../forms/delete/DeleteFormModel";
import SmallFormModel from "../../../forms/edit/SmallFormModel";
import ResolveForm from "../../../forms/misc/ResolveForm";
import RequestApprovalForm from "../../../forms/misc/RequestApprovalForm";
import RequestBuyForm from "../../../forms/misc/RequestBuyForm";
import ApproveRequestForm from "../../../forms/misc/ApproveRequestForm";

const RowButton = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [smallmenuAnchorEl, setSmallmenuAnchorEl] = useState(null);
  const [smallmenuOptions, setSmallmenuAOptions] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedModal, setSelectedModal] = useState({});
  const [selectedAction, setSelectedAction] = useState("");

  const options = rowButtonOptions(props);

  const currentOption = options.find((option) => option.page === props.page);

  const menuItems = currentOption?.menus[props.tabIndex] || [];

  const handleMenuItemClick = (menuItem, index) => {
    if (menuItem.modal === "small") {
      setSmallmenuAOptions(menuItem);
      setSmallmenuAnchorEl(submenuAnchorEl);
    } else {
      setSelectedModal(modals[menuItem.modal]);
      setOpenDialog(true);
      closeAllMenus();
      setSelectedAction(currentOption?.menus[props.tabIndex][index].action);
    }
  };

  const closeAllMenus = () => {
    setAnchorEl(null);
    setSubmenuAnchorEl(null);
    setSmallmenuAnchorEl(null);
  };

  let formComponent;

  switch (selectedAction) {
    // action ===
    case "edit":
      formComponent = (
        <EditFormModel
          palette={props.palette}
          mainColor={props.mainColor}
          buttonProps={props}
          options={selectedModal}
          userName={props.userName}
          userId={props.userId}
          configAgenda={props.configAgenda}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          target={props.item}
          currentOption={currentOption}
          tabIndex={props.tabIndex}
        />
      );
      break;

    case "add":
      formComponent = "add targeted";
      break;

    case "resolve":
      formComponent = (
        <ResolveForm
          userId={props.userId}
          selectedItemId={props.item._id || props.item.id}
          selectedItemName={
            props.item.name ||
            props.item.title ||
            props.item.number ||
            props.item.quoteNumber
          }
          model={selectedModal.model}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;

    case "requestApproval":
      formComponent = (
        <RequestApprovalForm
          userId={props.userId}
          selectedItemId={props.item._id || props.item.id}
          selectedItemName={props.item.title || props.item.number}
          model={selectedModal.model}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;
    case "approveRequest":
      formComponent = (
        <ApproveRequestForm
          userId={props.userId}
          selectedItemId={props.item._id || props.item.id}
          selectedItemName={props.item.title || props.item.number}
          model={selectedModal.model}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;

    case "requestBuy":
      formComponent = (
        <RequestBuyForm
          userId={props.userId}
          selectedItem={props.item}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;

    case "delete":
      formComponent = (
        <DeleteFormModel
          userId={props.userId}
          selectedItem={props.item}
          model={selectedModal.model}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          page={currentOption.page}
        />
      );
      break;

    default:
      "";
  }

  return (
    <>
      <IconButton
        onClick={(e) => (props.multiple ? "" : setAnchorEl(e.currentTarget))}
        disabled={props.multiple}
        sx={{
          "&:hover": {
            backgroundColor: props.fromCard ? "transparent" : "",
          },
        }}
      >
        <icons.MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems.map((menuItem, index) => (
          <div key={index}>
            {menuItem.submenu ? (
              <>
                <MenuItem
                  onClick={(e) =>
                    menuItem.modal === "small"
                      ? setSmallmenuAnchorEl(e.currentTarget)
                      : setSubmenuAnchorEl(e.currentTarget)
                  }
                  sx={{ minWidth: 150 }}
                >
                  <ListItemIcon>{menuItem.icon}</ListItemIcon>
                  <ListItemText>{menuItem.label}</ListItemText>
                </MenuItem>

                <Menu
                  anchorEl={submenuAnchorEl}
                  open={Boolean(submenuAnchorEl)}
                  onClose={() => setSubmenuAnchorEl(null)}
                >
                  {menuItem.submenu.map((subItem, subIndex) => (
                    <MenuItem
                      sx={{ minWidth: 150 }}
                      key={subIndex}
                      onClick={() => handleMenuItemClick(subItem, index)}
                    >
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText>
                        {subItem.targetLabel || subItem.label}
                      </ListItemText>
                    </MenuItem>
                  ))}
                </Menu>

                <Menu
                  anchorEl={smallmenuAnchorEl}
                  open={Boolean(smallmenuAnchorEl)}
                  onClose={() => setSmallmenuAnchorEl(null)}
                >
                  <SmallFormModel
                    source={props.item}
                    menuItem={menuItem.submenu}
                    smallmenuOptions={smallmenuOptions}
                    setSmallmenuAnchorEl={setSmallmenuAnchorEl}
                    mainColor={props.mainColor}
                    closeAllMenus={closeAllMenus}
                    refreshData={props.refreshData}
                    setRefreshData={props.setRefreshData}
                  />
                </Menu>
              </>
            ) : (
              <MenuItem
                onClick={() => handleMenuItemClick(menuItem, index)}
                sx={{ minWidth: 150 }}
                disabled={
                  menuItem.label === "Resolver"
                    ? checkAvailability("resolvableRequest", props.item.status)
                    : menuItem.label === "Solicitar Aprovação"
                    ? checkAvailability("approvableRequest", props.item.status)
                    : menuItem.label === "Criar" // username
                    ? checkAvailability(
                        "creatableUsername",
                        props.item.username
                      )
                    : menuItem.label === "Remover" // username
                    ? checkAvailability(
                        "removableUsername",
                        props.item.username
                      )
                    : false
                }
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText>{menuItem.label}</ListItemText>
              </MenuItem>
            )}
          </div>
        ))}
      </Menu>

      {openDialog && (
        <Dialog
          fullWidth
          maxWidth={
            selectedModal.maxWidth.startsWith("custom")
              ? false
              : selectedModal.maxWidth
          }
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          slotProps={{
            backdrop: {
              style: { backgroundColor: "transparent" },
            },
          }}
          sx={
            selectedModal.maxWidth.startsWith("custom")
              ? {
                  "& .MuiDialog-paper": {
                    width: `${selectedModal.maxWidth.match(/\d+/)[0]}px`,
                    maxWidth: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                  },
                }
              : {}
          }
        >
          {formComponent}
        </Dialog>
      )}
    </>
  );
};

export default RowButton;
