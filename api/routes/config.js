const express = require("express");
const router = express.Router();
const Config = require("../../models/models/Config");
const Notifications = require("../../models/models/Notifications");

// CREATE INITIAL CONFIG
router.post("/", async (req, res) => {
  const newConfig = new Config();
  const newNotifications = new Notifications();
  try {
    const createdConfig = await newConfig.save();
    const createdNotifications = await newNotifications.save();
    res.status(200).json({ createdConfig, createdNotifications });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET ALL CONFIGS
router.get("/", async (req, res) => {
  try {
    const configs = await Config.find();
    res.status(200).json(configs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET SPECIFIC CONFIG
router.get("/specific", async (req, res) => {
  const { key, items } = req.query;

  try {
    const config = await Config.findOne();
    if (!config || !config[key]) {
      return res
        .status(404)
        .json({ message: `Key "${key}" not found in config` });
    }

    const data = {};
    items.forEach((item) => {
      if (config[key][item] !== undefined) {
        data[item] = config[key][item];
      }
    });

    res.status(200).json(data);
  } catch (err) {
    console.error("\nError fetching specific config:", err);
    res.status(500).json({ message: "Error fetching specific config" });
  }
});

// DASHBOARD
router.put("/dashboard", async (req, res) => {
  try {
    const { showAgenda } = req.body;

    const config = await Config.findOne();

    config.dashboard.showAgenda = showAgenda;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CUSTOMERS
router.put("/customers", async (req, res) => {
  try {
    const {
      customersCanBeDeleted,
      clientsCanBeDeleted,
      allowSameNameCustomer,
    } = req.body;

    const config = await Config.findOne();

    config.customers.customersCanBeDeleted = customersCanBeDeleted;
    config.customers.clientsCanBeDeleted = clientsCanBeDeleted;
    config.customers.allowSameNameCustomer = allowSameNameCustomer;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// USERS
router.put("/users", async (req, res) => {
  try {
    const { usersCanBeDeleted } = req.body;

    const config = await Config.findOne();

    config.users.usersCanBeDeleted = usersCanBeDeleted;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// REQUESTS
router.put("/requests", async (req, res) => {
  try {
    const {
      requestsNeedApproval,
      requestsCanBeDeleted,
      requestsApproverManager,
      statuses,
    } = req.body;

    const config = await Config.findOne();

    config.requests.requestsNeedApproval = requestsNeedApproval;
    config.requests.canBeDeleted = requestsCanBeDeleted;
    config.requests.requestsApproverManager = requestsApproverManager;
    config.requests.requestStatuses = statuses;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// STOCK
router.put("/stock", async (req, res) => {
  try {
    const {
      stockEntriesDispatcherManager,
      stockEntriesNeedApproval,
      stockEntriesCanBeChallenged,
    } = req.body;

    const config = await Config.findOne();

    config.stock.stockEntriesDispatcherManager = stockEntriesDispatcherManager;
    config.stock.stockEntriesNeedApproval = stockEntriesNeedApproval;
    config.stock.stockEntriesCanBeChallenged = stockEntriesCanBeChallenged;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// AGENDA
router.put("/agenda", async (req, res) => {
  try {
    const { minTime, maxTime, newJobEventTypeColor, showServiceColorOnEvents } =
      req.body;

    let eventTypes = req.body.eventTypes;

    const config = await Config.findOne();

    config.agenda.minTime = minTime;
    config.agenda.maxTime = maxTime;
    config.agenda.showServiceColorOnEvents = showServiceColorOnEvents;

    if (newJobEventTypeColor) {
      eventTypes[0] = {
        name: "Job",
        color: newJobEventTypeColor,
      };
    }

    config.agenda.eventTypes = eventTypes;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// FINANCE
router.put("/finance", async (req, res) => {
  try {
    const { canReceiveInstallments } = req.body;

    const config = await Config.findOne();

    config.finance.canReceiveInstallments = canReceiveInstallments;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SERVICES
router.put("/services", async (req, res) => {
  try {
    const { canBeDeleted, serviceTypes } = req.body;

    const config = await Config.findOne();

    config.services.canBeDeleted = canBeDeleted;
    config.services.serviceTypes = serviceTypes;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CUSTOMIZATION
router.put("/customization", async (req, res) => {
  try {
    const { mainColor, fontColor, logo, logoBlack } = req.body;

    const config = await Config.findOne();

    config.customization.mainColor = mainColor;
    config.customization.fontColor = fontColor;
    config.customization.logo = logo;
    config.customization.logoBlack = logoBlack;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DEPARTMENTS
router.put("/departments", async (req, res) => {
  try {
    const { departmentsCanBeDeleted, departmentsNeedManager } = req.body;

    const config = await Config.findOne();

    config.departments.departmentsCanBeDeleted = departmentsCanBeDeleted;
    config.departments.departmentsNeedManager = departmentsNeedManager;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SECURITY
router.put("/security", async (req, res) => {
  try {
    const { passwordComplexity } = req.body;

    const config = await Config.findOne();

    config.security.passwordComplexity = passwordComplexity;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PERMISSIONS
router.put("/permissions", async (req, res) => {
  try {
    const payload = req.body;

    const config = await Config.findOneAndUpdate(
      {},
      { permissions: payload },
      { new: true }
    );

    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PRODUCTS
router.put("/products", async (req, res) => {
  try {
    const { productsCanBeDeleted } = req.body;

    const config = await Config.findOne();

    config.products.productsCanBeDeleted = productsCanBeDeleted;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// TABLES
router.put("/tables", async (req, res) => {
  try {
    const payload = req.body;
    const config = await Config.findOneAndUpdate(
      {},
      { tables: payload },
      { new: true }
    );

    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
