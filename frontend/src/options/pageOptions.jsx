// eslint-disable-next-line no-unused-vars
import React from "react";

const pageOptions = [
  {
    page: "dashboard",
    label: "Dashboard",
  },
  {
    page: "customers",
    label: "Clientes",
    models: ["Customer", "Client"],
    tabs: ["Empresas", "Pessoa Física"],
    tableColumns: [
      // CUSTOMER TABLE
      [
        {
          id: "image",
          label: "📷",
        },
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "phone",
          label: "Telefone",
        },
        {
          id: "mainContactName",
          label: "Contato Principal",
        },
      ],
      // CLIENT TABLE
      [
        {
          id: "image",
          label: "📷",
        },
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "cellphone",
          label: "Telefone",
        },
        {
          id: "email",
          label: "E-mail",
        },
      ],
    ],
  },
  {
    page: "requests",
    models: ["Job", "Sale"],
    label: "Solicitações",
    tabs: ["Jobs", "Vendas"],
    tableColumns: [
      // JOB TABLE
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "title",
          label: "Título",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "worker",
          label: "Designado",
        },
        {
          id: "scheduledTo",
          label: "Agendado para",
        },
        {
          id: "scheduleTime",
          label: "Horário",
        },
        {
          id: "price",
          label: "Valor",
        },
        {
          id: "status",
          label: "Status",
        },
      ],
      // SALE TABLE
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "seller",
          label: "Vendedor",
        },
        {
          id: "products",
          label: "Itens",
        },
        {
          id: "price",
          label: "Valor Total",
        },
        {
          id: "deliveryScheduledTo",
          label: "Entregar em",
        },
        {
          id: "status",
          label: "Status",
        },
      ],
    ],
  },
  {
    page: "users",
    models: ["User", "User"],
    label: "Colaboradores",
    tabs: ["Funcionários", "Gerentes"],
    tableColumns: [
      // USER TABLE
      [
        {
          id: "image",
          label: "📷",
        },
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "email",
          label: "E-mail",
        },
        {
          id: "cellphone",
          label: "Telefone",
        },
        {
          id: "position",
          label: "Cargo",
        },
        {
          id: "department",
          label: "Departamento",
        },
      ],
      // MANAGER TABLE
      [
        {
          id: "image",
          label: "📷",
        },
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "email",
          label: "E-mail",
        },
        {
          id: "cellphone",
          label: "Telefone",
        },
        {
          id: "position",
          label: "Cargo",
        },
        {
          id: "department",
          label: "Departamento",
        },
      ],
    ],
  },
  {
    page: "departments",
    models: ["Department", "Group"],
    label: "Departamentos",
    tabs: ["Departamentos", "Grupos"],
    tableColumns: [
      // SERVICE SALES AND INTERNAL DEPARTMENTS TABLE
      [
        {
          id: "color",
          label: "🎨",
        },
        {
          id: "name",
          label: "Nome",
        },

        {
          id: "members",
          label: "Colaboradores",
        },
        {
          id: "manager",
          label: "Gerente",
        },
        {
          id: "email",
          label: "E-mail",
        },
        {
          id: "phone",
          label: "Telefone",
        },
      ],
      // GROUPS TABLE
      [
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "members",
          label: "Colaboradores",
        },
      ],
    ],
  },
  {
    page: "services",
    models: ["Service", "ServicePlan"],
    label: "Serviços",
    tabs: ["Setores", "Planos"],
    tableColumns: [
      // SERVICE TABLE
      [
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "type",
          label: "Tipo de Serviço",
        },
        {
          id: "department",
          label: "Departamento",
        },
        {
          id: "products",
          label: "Produtos",
        },
        {
          id: "price",
          label: "Valor",
        },
      ],
      // SERVICE PLANS TABLE
      [
        {
          id: "name",
          label: "Nome do Plano",
        },
        {
          id: "period",
          label: "Período de Vigência",
        },
        {
          id: "renewDay",
          label: "Dia de Renovação",
        },
        {
          id: "services",
          label: "Serviços",
        },
        {
          id: "price",
          label: "Valor",
        },
      ],
    ],
  },
  {
    page: "stock",
    label: "Estoque",
    models: ["Product", "StockEntry"],
    tabs: ["Produtos", "Entradas"],
    tableColumns: [
      // STOCK PRODUCTS
      [
        {
          id: "image",
          label: "📷",
        },
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "stockQuantity",
          label: "Quantidade em Estoque",
        },
        {
          id: "buyValue",
          label: "Valor de Compra / Produção",
        },
        {
          id: "sellValue",
          label: "Valor de Venda",
        },
      ],
      // STOCK ENTRIES TABLE
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "items",
          label: "Itens",
        },
        {
          id: "quoteValue",
          label: "Valor Total",
        },
        {
          id: "createdBy",
          label: "Criado por",
        },
        {
          id: "status",
          label: "Status",
        },
        {
          id: "createdAt",
          label: "Adicionado em",
        },
      ],
    ],
  },
  {
    page: "products",
    label: "Produtos",
    models: ["Product"],
    tabs: [],
  },
  {
    page: "chat",
    label: "Chat",
    tabs: ["Chats"],
    models: ["Chat"],
    tableColumns: [[""], [""]],
  },
  {
    page: "finance",
    label: "Financeiro",
    tabs: ["A Receber", "A Pagar"],
    models: ["FinanceIncome", "FinanceOutcome"],
    tableColumns: [
      [
        {
          id: "quote",
          label: "Orçamento",
        },
        {
          id: "type",
          label: "Tipo",
        },
        {
          id: "payment",
          label: "Pagamento",
        },
        {
          id: "department",
          label: "Departamento",
        },
        {
          id: "price",
          label: "Valor",
        },
        {
          id: "status",
          label: "Status",
        },
        {
          id: "createdAt",
          label: "Criado em",
        },
      ],
      [
        {
          id: "type",
          label: "Tipo",
        },
        {
          id: "payment",
          label: "Pagamento",
        },
        {
          id: "price",
          label: "Valor",
        },
        {
          id: "status",
          label: "Status",
        },
        {
          id: "createdAt",
          label: "Criado em",
        },
      ],
    ],
  },
  {
    page: "reports",
    label: "Relatórios",
    tabs: [],
    tableColumns: [],
  },
  {
    page: "security",
    label: "Segurança de Acessos",
    tabs: ["Operadores", "Cargos", "Perfil de Acesso"],
    models: ["Operator", "Position", "Role"],
    tableColumns: [
      [
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "username",
          label: "Nome de Operador",
        },
        {
          id: "role",
          label: "Perfil de Acesso",
        },
        {
          id: "alreadyLogin",
          label: "Login Realizado",
        },
      ],
      [
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "department",
          label: "Departamento",
        },
        {
          id: "members",
          label: "Colaboradores",
        },
      ],
      [
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "members",
          label: "Colaboradores",
        },
      ],
    ],
  },
];

export default pageOptions;
