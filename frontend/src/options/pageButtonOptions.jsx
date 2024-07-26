// eslint-disable-next-line no-unused-vars
import React from "react";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BuildIcon from "@mui/icons-material/Build";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupsIcon from "@mui/icons-material/Groups";
import HubIcon from "@mui/icons-material/Hub";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LanIcon from "@mui/icons-material/Lan";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";
import RecyclingIcon from "@mui/icons-material/Recycling";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SellIcon from "@mui/icons-material/Sell";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const pageButtonOptions = [
  {
    page: "dashboard",
    label: "Dashboard",
  },
  {
    page: "customers",
    pageButtonOptions: [
      {
        label: "Empresa",
        icon: <ApartmentIcon />,
        modal: {
          endpoint: "/add",
          label: "Cliente Empresa",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "image", label: "Logotipo" },
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "mainContact", label: "Contato Principal" },
            { name: "secondaryInfo", label: "Informações Adicionais" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "phone",
              label: "Telefone",
              type: "phone",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "cnpj",
              label: "CNPJ",
              type: "idDoc",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "address",
              label: "Endereço",
              type: "string",
              required: true,
            },

            {
              fieldSection: "mainContact",
              name: "mainContactName",
              label: "Nome",
              type: "string",
              required: true,
            },

            {
              fieldSection: "mainContact",
              name: "mainContactPhone",
              label: "Telefone",
              type: "phone",
              required: true,
            },
            {
              fieldSection: "mainContact",
              name: "mainContactEmail",
              label: "E-mail",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainContact",
              name: "mainContactPosition",
              label: "Posição",
              type: "select",
              options: ["Proprietário", "Sócio", "Gerente", "Colaborador"],
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "website",
              label: "Website",
              type: "string",
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "segment",
              label: "Ramo de Atividade",
              type: "string",
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "employees",
              label: "Nº de Empregados",
              type: "select",
              options: [
                "1 à 5",
                "6 à 15",
                "16 à 50",
                "51 à 100",
                "+100",
                "+1000",
                "+10000",
              ],
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "companyType",
              label: "Tipo de Empresa",
              type: "select",
              options: [
                "Individual (EI/MEI)",
                "LTDA",
                "EPP / EIRELI",
                "Coop",
                "S/A",
                "ONG",
                "ORG",
              ],
              required: false,
            },
          ],
          model: "Customer",
        },
      },
      {
        label: "Pessoa Física",
        icon: <PersonIcon />,
        modal: {
          endpoint: "/add",
          label: "Cliente Pessoa Física",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "image", label: "Imagem" },
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "secondaryInfo", label: "Informações Adicionais" },
          ],
          fields: [
            {
              fieldSection: "image",
              name: "image",
              type: "image",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "cpf",
              label: "CPF",
              type: "idDoc",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "email",
              label: "E-mail",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "cellphone",
              label: "Telefone",
              type: "phone",
              required: true,
            },
            {
              fieldSection: "secondaryInfo",
              name: "birthdate",
              label: "Data de Nascimento",
              type: "date",
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "gender",
              label: "Gênero",
              type: "select",
              required: false,
              options: ["Masculino", "Feminino", "Outro", "Não Informar"],
            },
            {
              fieldSection: "secondaryInfo",
              name: "addressHome",
              label: "Endereço Residencial",
              type: "string",
              required: true,
            },
            {
              fieldSection: "secondaryInfo",
              name: "phone",
              label: "Telefone Fixo",
              type: "phone",
              required: false,
            },
          ],
          model: "Client",
        },
      },
      {
        label: "Importar Contatos",
        icon: <UploadFileIcon />,
        modal: {
          endpoint: "/importContacts",
          label: "Importação de Clientes",
          femaleGender: true,
          type: "list",
          options: ["importContacts"],
          model: "DOESNT EXIST YET",
        },
      },
    ],
  },
  {
    page: "requests",
    pageButtonOptions: [
      {
        label: "Job",
        icon: <EngineeringIcon />,
        modal: {
          endpoint: "/add",
          label: "Job",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "description", label: "Descrição" },
            { name: "scheduling", label: "Agendamento" },
            { name: "attachments", label: "Anexos" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "title",
              label: "Título",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "customer",
              label: "Cliente",
              type: "dynamicData",
              dynamicData: "allCustomers",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "service",
              label: "Serviço",
              type: "dynamicData",
              dynamicData: "services",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "worker",
              label: "Colaborador Designado",
              type: "dynamicData",
              dynamicData: "workers",
              required: true,
            },
            {
              fieldSection: "scheduling",
              name: "scheduledTo",
              label: "Data de Atendimento",
              type: "date",
              required: true,
            },
            {
              fieldSection: "scheduling",
              name: "scheduleToWorker",
              label: "Agendar para Colaborador",
              type: "checkbox",
              required: false,
            },
            {
              fieldSection: "description",
              name: "description",
              label: "",
              type: "fullWidth",
              required: false,
            },
            {
              fieldSection: "attachments",
              name: "attachments",
              label: "",
              type: "list",
              options: ["attachments"],
              required: false,
            },
          ],
          model: "Job",
        },
      },
      {
        label: "Venda",
        icon: <SellIcon />,
        modal: {
          endpoint: "/add",
          label: "Venda",
          femaleGender: true,
          maxWidth: "md",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "products", label: "Produtos" },
            { name: "attachments", label: "Anexos" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "customer",
              label: "Cliente",
              type: "dynamicData",
              dynamicData: "allCustomers",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "seller",
              label: "Vendedor",
              type: "dynamicData",
              dynamicData: "workers",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "deliveryScheduledTo",
              label: "Data de Entrega",
              type: "date",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "deliveryAddress",
              label: "Endereço de Entrega",
              type: "string",
              required: true,
            },
            {
              fieldSection: "products",
              name: "products",
              label: "",
              type: "productList",
              options: [],
              required: false,
            },
            {
              fieldSection: "attachments",
              name: "attachments",
              label: "",
              type: "list",
              options: [],
              required: false,
            },
          ],
          model: "Sale",
        },
      },
    ],
  },
  {
    page: "users",
    pageButtonOptions: [
      {
        label: "Colaborador",
        icon: <PersonIcon />,
        modal: {
          endpoint: "/add",
          label: "Colaborador",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "image", label: "Imagem" },
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "departmentInfo", label: "Informações Internas" },
            { name: "socialMedia", label: "Redes Sociais" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "birthdate",
              label: "Data de Nascimento",
              type: "date",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "cpf",
              label: "CPF",
              type: "idDoc",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "gender",
              label: "Gênero",
              type: "select",
              required: false,
              options: ["Masculino", "Feminino", "Outro", "Não Informar"],
            },

            {
              fieldSection: "mainInfo",
              name: "email",
              label: "E-mail",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "address",
              label: "Endereço",
              type: "string",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "cellphone",
              label: "Celular",
              type: "phone",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "phone",
              label: "Telefone Fixo",
              type: "phone",
              required: false,
            },
            {
              fieldSection: "departmentInfo",
              name: "department",
              label: "Departamento",
              type: "dynamicData",
              dynamicData: "departments",
              required: false,
            },

            {
              fieldSection: "departmentInfo",
              name: "position",
              label: "Posição",
              type: "dynamicData",
              dynamicData: "positions",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "facebook",
              label: "Facebook",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "instagram",
              label: "Instagram",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "linkedin",
              label: "LinkedIn",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "x",
              label: "X / Twitter",
              type: "string",
              required: false,
            },
          ],
          model: "User",
        },
      },
      {
        label: "Gerente",
        icon: <Person4Icon />,
        modal: {
          endpoint: "/add",
          label: "Gerente",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "image", label: "Imagem" },
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "departmentInfo", label: "Informações Internas" },
            { name: "socialMedia", label: "Redes Sociais" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "birthdate",
              label: "Data de Nascimento",
              type: "date",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "cpf",
              label: "CPF",
              type: "idDoc",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "gender",
              label: "Gênero",
              type: "select",
              required: false,
              options: ["Masculino", "Feminino", "Outro", "Não Informar"],
            },

            {
              fieldSection: "mainInfo",
              name: "email",
              label: "E-mail",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "address",
              label: "Endereço",
              type: "string",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "cellphone",
              label: "Celular",
              type: "phone",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "phone",
              label: "Telefone Fixo",
              type: "phone",
              required: false,
            },
            {
              fieldSection: "departmentInfo",
              name: "department",
              label: "Departamento",
              type: "dynamicData",
              dynamicData: "departments",
              required: false,
            },

            {
              fieldSection: "departmentInfo",
              name: "position",
              label: "Posição",
              type: "dynamicData",
              dynamicData: "positions",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "facebook",
              label: "Facebook",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "instagram",
              label: "Instagram",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "linkedin",
              label: "LinkedIn",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "x",
              label: "X / Twitter",
              type: "string",
              required: false,
            },
          ],
          model: "User",
        },
      },
    ],
  },
  {
    page: "departments",
    pageButtonOptions: [
      {
        label: "Departamento",
        icon: <LanIcon />,
        modal: {
          endpoint: "/add",
          label: "Departamento",
          femaleGender: false,
          maxWidth: "custom950px",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "peopleInfo", label: "Pessoas" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "type",
              label: "Tipo de Departamento",
              type: "select",
              required: true,
              options: ["Serviços", "Vendas", "Interno"],
            },
            {
              fieldSection: "mainInfo",
              name: "phone",
              label: "Telefone",
              type: "phone",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "email",
              label: "E-mail",
              type: "string",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "color",
              label: "Cor",
              type: "color",
              required: false,
            },
            {
              fieldSection: "peopleInfo",
              name: "manager",
              label: "Gerente",
              type: "dynamicData",
              dynamicData: "managers",
              required: false,
            },
            {
              fieldSection: "peopleInfo",
              name: "members",
              label: "Membros",
              type: "dynamicData",
              dynamicData: "users",
              multiple: true,
              required: false,
            },
          ],
          model: "Department",
        },
      },
      {
        label: "Grupo",
        icon: <GroupsIcon />,
        modal: {
          endpoint: "/add",
          label: "Grupo",
          femaleGender: false,
          maxWidth: "custom350px",
          fieldsSections: [
            { name: "mainInfo", label: "Informações" },
            { name: "peopleInfo", label: "Pessoas" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome",
              type: "string",
              required: true,
            },
            {
              fieldSection: "peopleInfo",
              name: "members",
              label: "Membros",
              type: "dynamicData",
              dynamicData: "users",
              multiple: true,
              required: false,
            },
          ],
          model: "Group",
        },
      },
    ],
  },
  {
    page: "services",
    pageButtonOptions: [
      {
        label: "Serviço",
        icon: <BuildIcon />,
        modal: {
          endpoint: "/add",
          label: "Serviço",
          femaleGender: false,
          maxWidth: "sm",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "serviceInfo", label: "Informações do Serviço" },
            { name: "materials", label: "Materiais Utilizados" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome do Serviço",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "type",
              label: "Tipo de Serviço",
              type: "dynamicData",
              dynamicData: "serviceTypes",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "department",
              label: "Departamento",
              type: "dynamicData",
              dynamicData: "departments",
              required: true,
            },
            {
              fieldSection: "serviceInfo",
              name: "executionTime",
              label: "Tempo de Execução",
              type: "select",
              options: ["30 min", "1h", "1:30h", "2h", "2:30h", "3h ou mais"],
              required: true,
            },
            {
              fieldSection: "serviceInfo",
              name: "sessions",
              label: "Quantidade de Sessões",
              type: "select",
              options: ["1", "2", "3", "4", "5", "6", "7 ou mais"],
              required: true,
            },
            {
              fieldSection: "serviceInfo",
              name: "price",
              label: "Valor do Serviço",
              type: "currency",
              required: true,
            },
            {
              fieldSection: "materials",
              name: "materials",
              label: "",
              type: "list",
              options: ["materials"],
              required: true,
            },
          ],
          model: "Service",
        },
      },
      {
        label: "Plano de Serviços",
        icon: <HubIcon />,
        modal: {
          endpoint: "/add",
          label: "Plano de Serviços",
          femaleGender: false,
          maxWidth: "custom700px",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "servicesList", label: "Serviços" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome do Plano",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "period",
              label: "Período de Vigência",
              type: "select",
              options: [
                "Semanal",
                "Quinzenal",
                "Mensal",
                "Bimestral",
                "Trimestral",
                "Semestral",
                "Anual",
                "Outro",
              ],
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "renewDay",
              label: "Dia de Renovação",
              type: "string",
              required: true,
            },
            {
              fieldSection: "servicesList",
              name: "services",
              label: "",
              type: "servicesList",
              options: [],
              required: false,
            },
          ],
          model: "ServicePlan",
        },
      },
    ],
  },
  {
    page: "quotes",
    pageButtonOptions: [""],
  },
  {
    page: "stock",
    pageButtonOptions: [
      {
        label: "Entrada de Estoque",
        icon: <Inventory2Icon />,
        modal: {
          name: "AddStockEntry",
          label: "Entrada de Estoque",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "items", label: "Itens" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "type",
              label: "Produtos / Materiais",
              type: "select",
              options: ["Produtos", "Materiais"],
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "purchaseDate",
              label: "Data da Compra",
              type: "date",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "deliveryDate",
              label: "Data da Entrega",
              type: "date",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "stockDate",
              label: "Data de Armazenamento",
              type: "date",
              required: true,
            },
            {
              fieldSection: "items",
              name: "items",
              label: "",
              type: "list",
              options: ["products", "materials"],
              required: true,
            },
          ],
        },
      },
    ],
  },
  {
    page: "products",
    pageButtonOptions: [
      {
        label: "Produto",
        icon: <SellIcon />,
        modal: {
          name: "AddProduct",
          label: "Produto",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "fields", label: "Informações do Produto" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "type",
              label: "Tipo de Produto",
              type: "dynamicData",
              options: ["baseProducts"],
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome do Produto",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "buyValue",
              label: "Valor de Compra",
              type: "currency",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "sellValue",
              label: "Valor de Venda",
              type: "currency",
              required: true,
            },
            {
              fieldSection: "fields",
              name: "fields",
              label: "",
              type: "fields",
            },
          ],
          model: "Product",
        },
      },
    ],
  },
  //review this
  {
    page: "materials",
    pageButtonOptions: [
      {
        label: "Material",
        icon: <RecyclingIcon />,
        modal: {
          name: "AddMaterial",
          label: "Material",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "fields", label: "Informações do Material" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "type",
              label: "Tipo de Material",
              type: "dynamicData",
              options: ["baseProducts"],
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome do Material",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "buyValue",
              label: "Valor de Compra",
              type: "currency",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "sellValue",
              label: "Valor de Venda",
              type: "currency",
              required: true,
            },
            {
              fieldSection: "fields",
              name: "fields",
              label: "",
              type: "fields",
            },
          ],
          model: "Material",
        },
      },
    ],
  },
  {
    page: "chat",
    pageButtonOptions: [
      { label: "Mensagem", icon: <ApartmentIcon />, modal: "AddChat" },
    ],
  },
  //review this
  {
    page: "projects",
    pageButtonOptions: [
      {
        label: "Projeto",
        icon: <RocketLaunchIcon />,
        fieldsSections: [
          { name: "mainInfo", label: "Informações Gerais" },
          { name: "fields", label: "Informações do Material" },
        ],
        fields: [
          {
            fieldSection: "mainInfo",
            name: "type",
            label: "Tipo de Material",
            type: "dynamicData",
            options: ["baseProducts"],
            required: true,
          },
          {
            fieldSection: "mainInfo",
            name: "name",
            label: "Nome do Material",
            type: "string",
            required: true,
          },
          {
            fieldSection: "mainInfo",
            name: "buyValue",
            label: "Valor de Compra",
            type: "currency",
            required: true,
          },
          {
            fieldSection: "mainInfo",
            name: "sellValue",
            label: "Valor de Venda",
            type: "currency",
            required: true,
          },
          {
            fieldSection: "fields",
            name: "fields",
            label: "",
            type: "fields",
          },
        ],
        model: "Project",
      },
      {
        label: "Projeto Recorrente",
        icon: <RecyclingIcon />,
        fieldsSections: [
          { name: "mainInfo", label: "Informações Gerais" },
          { name: "fields", label: "Informações do Material" },
        ],
        fields: [
          {
            fieldSection: "mainInfo",
            name: "type",
            label: "Tipo de Material",
            type: "dynamicData",
            options: ["baseProducts"],
            required: true,
          },
          {
            fieldSection: "mainInfo",
            name: "name",
            label: "Nome do Material",
            type: "string",
            required: true,
          },
          {
            fieldSection: "mainInfo",
            name: "buyValue",
            label: "Valor de Compra",
            type: "currency",
            required: true,
          },
          {
            fieldSection: "mainInfo",
            name: "sellValue",
            label: "Valor de Venda",
            type: "currency",
            required: true,
          },
          {
            fieldSection: "fields",
            name: "fields",
            label: "",
            type: "fields",
          },
        ],
        model: "Project",
      },
    ],
  },
  {
    page: "security",
    pageButtonOptions: [
      {
        label: "Operador",
        icon: <ManageAccountsIcon />,
        modal: {
          endpoint: "/add",
          label: "Operador",
          femaleGender: false,
          maxWidth: "xs",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "secondaryInfo", label: "Informações de Usuário" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "user",
              label: "Colaborador",
              type: "dynamicData",
              options: ["allUsers"],
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "username",
              label: "Nome de Operador",
              type: "string",
              required: true,
            },
            {
              fieldSection: "firstAccessPassword",
              name: "role",
              label: "Perfil de Acesso",
              type: "dynamicData",
              dynamicData: "roles",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "firstAccessPassword",
              label: "Senha de Acesso",
              type: "password",
              required: true,
            },
          ],
          model: "Operator",
        },
      },
      {
        label: "Cargo",
        icon: <AssignmentIndIcon />,
        modal: {
          endpoint: "/add",
          label: "Cargo",
          femaleGender: false,
          maxWidth: "xs",
          fieldsSections: [{ name: "mainInfo", label: "Informações Gerais" }],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome do Cargo",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "department",
              label: "Departamento",
              type: "dynamicData",
              dynamicData: "departments",
              required: true,
            },
          ],
          model: "Position",
        },
      },
      {
        label: "Perfil de Acesso",
        icon: <AdminPanelSettingsIcon />,
        modal: {
          endpoint: "/add",
          label: "Perfil de Acesso",
          femaleGender: false,
          maxWidth: "xs",
          fieldsSections: [{ name: "mainInfo", label: "Informações Gerais" }],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome do Perfil",
              type: "string",
              required: true,
            },
          ],
          model: "Role",
        },
      },
    ],
  },
];

export default pageButtonOptions;
