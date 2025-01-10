/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
import React from "react";

import { icons } from "../icons";

const fetchStatuses = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("http://localhost:3000/api/config");
      const data = await response.json();
      const configData = data[0].requests;
      const sortedStatuses = configData.requestStatuses.sort((a, b) =>
        a.localeCompare(b)
      );
      resolve(sortedStatuses);
    } catch (error) {
      console.error("Error fetching data:", error);
      reject(error);
    }
  });
};

const rowButtonOptions = (props) => [
  {
    page: "customers",
    models: ["Customer", "Customer"],
    menus: {
      0: [
        {
          label: "Editar",
          action: "edit",
          modal: "Customer",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Customer",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Novo",
          icon: <icons.AddIcon />,
          action: "add",
          submenu: [
            {
              label: "Job",
              modal: "Job",
              targeted: true,
              icon: <icons.EngineeringIcon />,
            },
            {
              label: "Venda",
              modal: "Sale",
              targeted: true,
              icon: <icons.SellIcon />,
            },
          ],
        },
      ],
      1: [
        {
          label: "Editar",
          action: "edit",
          modal: "Client",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Client",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Novo",
          icon: <icons.AddIcon />,
          action: "add",
          submenu: [
            {
              label: "Job",
              modal: "Client",
              targeted: true,
              icon: <icons.EngineeringIcon />,
            },
            {
              label: "Venda",
              modal: "Client",
              targeted: true,
              icon: <icons.SellIcon />,
            },
          ],
        },
      ],
    },
  },
  {
    page: "users",
    models: ["User", "User"],
    menus: {
      0: [
        {
          label: "Editar",
          action: "edit",
          modal: "User",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "User",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <icons.SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "User",
              targetModel: "Department",
              targetLabel: "Departamento",
              icon: <icons.LanIcon />,
            },
            {
              modal: "small",
              sourceModel: "User",
              targetModel: "Position",
              targetLabel: "Cargo",
              icon: <icons.AssignmentIndIcon />,
            },
          ],
        },
      ],
      1: [
        {
          label: "Editar",
          action: "edit",
          modal: "User",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "User",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <icons.SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "User",
              targetModel: "Department",
              targetLabel: "Departamento",
              icon: <icons.LanIcon />,
            },
            {
              modal: "small",
              sourceModel: "User",
              targetModel: "Position",
              targetLabel: "Cargo",
              icon: <icons.AssignmentIndIcon />,
            },
          ],
        },
      ],
    },
  },
  {
    page: "requests",
    models: ["Job", "Sale"],
    menus: {
      0: [
        {
          label: "Solicitar Aprovação",
          action: "requestApproval",
          modal: "Job",
          icon: <icons.FactCheckIcon />,
        },
        ...(props.userIsRequestsApproverManager
          ? [
              {
                label: "Aprovar Solicitação",
                action: "approveRequest",
                modal: "Job",
                icon: <icons.SpellcheckIcon />,
              },
            ]
          : []),
        {
          label: "Resolver",
          action: "resolve",
          modal: "Job",
          icon: <icons.CheckIcon />,
        },
        {
          label: "Editar",
          action: "edit",
          modal: "Job",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Job",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <icons.SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Job",
              targetModel: "Static",
              targetLabel: "Status",
              icon: <icons.TimelapseIcon />,
              staticAttribute: "status",
              staticList: fetchStatuses,
            },
          ],
        },
      ],
      1: [
        {
          label: "Solicitar Aprovação",
          action: "requestApproval",
          modal: "Sale",
          icon: <icons.FactCheckIcon />,
        },
        ...(props.userIsRequestsApproverManager
          ? [
              {
                label: "Aprovar Solicitação",
                action: "approveRequest",
                modal: "Sale",
                icon: <icons.SpellcheckIcon />,
              },
            ]
          : []),
        {
          label: "Resolver",
          action: "resolve",
          modal: "Sale",
          icon: <icons.CheckIcon />,
        },
        {
          label: "Editar",
          action: "edit",
          modal: "Sale",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Sale",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <icons.SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Sale",
              targetModel: "Static",
              targetLabel: "Status",
              icon: <icons.TimelapseIcon />,
              staticAttribute: "status",
              staticList: fetchStatuses,
            },
          ],
        },
      ],
    },
  },
  {
    page: "stock",
    models: ["Product", "StockEntry"],
    menus: {
      0: [
        {
          label: "Solicitar Compra para Estoque",
          action: "requestBuy",
          modal: "Product",
          icon: <icons.ShopIcon />,
        },
      ],
      1: [
        {
          label: "Solicitar Aprovação",
          action: "requestApproval",
          modal: "StockEntry",
          icon: <icons.FactCheckIcon />,
        },
        ...(props.userIsStockApproverManager
          ? [
              {
                label: "Aprovar Solicitação",
                action: "approveRequest",
                modal: "StockEntry",
                icon: <icons.SpellcheckIcon />,
              },
            ]
          : []),
        {
          label: "Editar",
          action: "edit",
          modal: "StockEntry",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "StockEntry",
          icon: <icons.DeleteIcon />,
        },
      ],
    },
  },
  {
    page: "departments",
    models: ["Department", "Group"],
    menus: {
      0: [
        {
          label: "Editar",
          action: "edit",
          modal: "Department",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Department",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <icons.SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Department",
              targetModel: "User",
              targetLabel: "Membros",
              targetFlag: "members",
              icon: <icons.GroupIcon />,
            },
            {
              modal: "small",
              sourceModel: "Department",
              targetModel: "User",
              targetLabel: "Gerência",
              targetFlag: "manager",
              icon: <icons.Person4Icon />,
            },
          ],
        },
      ],
      1: [
        {
          label: "Editar",
          action: "edit",
          modal: "Group",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Group",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <icons.SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Department",
              targetModel: "User",
              targetLabel: "Membros",
              targetFlag: "members",
              icon: <icons.GroupIcon />,
            },
          ],
        },
      ],
    },
  },
  {
    page: "security",
    models: ["Operator", "Position", "Role"],
    menus: {
      0: [
        {
          label: "Editar",
          action: "edit",
          modal: "Operator",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Remover",
          action: "delete",
          modal: "Operator",
          icon: <icons.DeleteIcon />,
        },
        // {
        //   label: "Alterar",
        //   icon: <icons.SettingsIcon />,
        //   action: "dynamicChange",
        //   submenu: [
        //     {
        //       modal: "small",
        //       sourceModel: "Service",
        //       targetModel: "Department",
        //       targetLabel: "Departamento",
        //       icon: <icons.LanIcon />,
        //     },
        //   ],
        // },
      ],
      1: [
        {
          label: "Editar",
          action: "edit",
          modal: "Position",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Position",
          icon: <icons.DeleteIcon />,
        },
        // {
        //   label: "Alterar",
        //   icon: <icons.SettingsIcon />,
        //   action: "dynamicChange",
        //   submenu: [
        //     {
        //       modal: "small",
        //       sourceModel: "Service",
        //       targetModel: "Department",
        //       targetLabel: "Departamento",
        //       icon: <icons.LanIcon />,
        //     },
        //   ],
        // },
      ],
      2: [
        {
          label: "Editar",
          action: "edit",
          modal: "Role",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Role",
          icon: <icons.DeleteIcon />,
        },
        // {
        //   label: "Alterar",
        //   icon: <icons.SettingsIcon />,
        //   action: "dynamicChange",
        //   submenu: [
        //     {
        //       modal: "small",
        //       sourceModel: "Service",
        //       targetModel: "Department",
        //       targetLabel: "Departamento",
        //       icon: <icons.LanIcon />,
        //     },
        //   ],
        // },
      ],
    },
  },
  {
    page: "services",
    models: ["Service", "ServicePlan"],
    menus: {
      0: [
        {
          label: "Editar",
          action: "edit",
          modal: "Service",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "Service",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <icons.SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "Service",
              targetModel: "Department",
              targetLabel: "Departamento",
              icon: <icons.LanIcon />,
            },
          ],
        },
      ],
      1: [
        {
          label: "Editar",
          action: "edit",
          modal: "ServicePlan",
          icon: <icons.ModeEditIcon />,
        },
        {
          label: "Deletar",
          action: "delete",
          modal: "ServicePlan",
          icon: <icons.DeleteIcon />,
        },
        {
          label: "Alterar",
          icon: <icons.SettingsIcon />,
          action: "dynamicChange",
          submenu: [
            {
              modal: "small",
              sourceModel: "ServicePlan",
              targetModel: "Department",
              targetLabel: "Departamento",
              icon: <icons.LanIcon />,
            },
          ],
        },
      ],
    },
  },
];

export default rowButtonOptions;
