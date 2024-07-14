// eslint-disable-next-line no-unused-vars
import React from "react";

const routeOptions = [
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
          id: "email",
          label: "E-mail",
        },
        {
          id: "phone",
          label: "Telefone",
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
          id: "title",
          label: "Título",
        },
        {
          id: "requester",
          label: "Solicitante",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "createdBy",
          label: "Criado por",
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
          id: "requester",
          label: "Solicitante",
        },
        {
          id: "seller",
          label: "Vendedor",
        },
        {
          id: "createdBy",
          label: "Criado por",
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
    models: ["User", "Manager"],
    label: "Colaboradores",
    tabs: ["Funcionários", "Gerentes"],
    tableColumns: [
      //NOTE: Even though these lists are equal, they must exist so a future mapping won't throw an error
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
          id: "phone",
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
          id: "phone",
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
    models: ["Departament", "Group"],
    label: "Departamentos",
    tabs: ["Serviços e Internos", "Grupos"],
    tableColumns: [
      // SERVICE SALES AND INTERNAL DEPARTMENTS TABLE
      [
        {
          id: "name",
          label: "Nome",
        },
        {
          id: "email",
          label: "E-mail",
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
          id: "type",
          label: "Tipo de Departamento",
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
          id: "department",
          label: "Departamento",
        },
        {
          id: "materials",
          label: "Materiais",
        },
        {
          id: "executionTime",
          label: "Duração",
        },
        {
          id: "value",
          label: "Valor",
        },
      ],
      // SERVICE PLANS TABLE
      [
        {
          id: "name",
          label: "Nome do Plano",
        },
      ],
    ],
  },
  {
    page: "quotes",
    models: ["QuoteJob", "QuoteSale"],
    label: "Orçamentos",
    tabs: ["Jobs", "Vendas"],
    tableColumns: [
      // JOB QUOTES TABLE
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "service",
          label: "Serviço",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "user",
          label: "Colaborador",
        },
        {
          id: "department",
          label: "Departamento",
        },
        {
          id: "value",
          label: "Valor Total",
        },
      ],
      // SALE QUOTES TABLE
      [
        {
          id: "number",
          label: "#",
        },
        {
          id: "materials",
          label: "Itens",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "user",
          label: "Colaborador",
        },
        {
          id: "department",
          label: "Departamento",
        },
        {
          id: "price",
          label: "Valor Total",
        },
      ],
    ],
  },
  {
    // TO-DO
    page: "stock",
    label: "Estoque",
    models: ["Product", "Material", "StockEntry"],
    tabs: ["Produtos", "Materiais", "Entradas"],
    // review this
    tableColumns: [
      // STOCK PRODUCTS TABLE
      [
        {
          id: "number",
          label: "#",
        },
      ],
      // STOCK MATERIALS TABLE
      [
        {
          id: "number",
          label: "#",
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
    models: ["BaseProduct", "CreatedProduct"],
    tabs: [],
  },
  {
    // TO-DO
    page: "materials",
    models: ["BaseMaterial", "CreatedMaterial"],
    label: "Materiais",
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
    page: "projects",
    label: "Projetos",
    tabs: ["Em Execução"],
    models: ["BaseProjects", "CreatedProjetos"],
    // review this
    tableColumns: [
      [
        {
          id: "name",
          label: "Nome do Projeto",
        },
        {
          id: "type",
          label: "Tipo",
        },
        {
          id: "customer",
          label: "Cliente",
        },
        {
          id: "stage",
          label: "Fase Atual",
        },
        {
          id: "creator",
          label: "Criador",
        },
        {
          id: "status",
          label: "Status",
        },
      ],
    ],
  },
  {
    page: "finance",
    label: "Financeiro",
    tabs: ["A Receber", "A Pagar"],
    models: ["Income", "Outcome"],
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
          label: "Nome do Cargo",
        },
        {
          id: "members",
          label: "Colaboradores",
        },
      ],
    ],
  },
];

export default routeOptions;
