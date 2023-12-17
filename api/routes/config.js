const express = require("express");
const router = express.Router();
const Config = require("../models/Config");

// CREATE INITIAL CONFIG
router.post("/", async (req, res) => {
  const newConfig = new Config();
  try {
    const createdConfig = await newConfig.save();
    res.status(200).json(createdConfig);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET ALL CONFIGS
router.get("/", async (req, res) => {
  try {
    const configs = await Config.find();
    res.status(200).json(configs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// REQUESTS
router.put("/requests", async (req, res) => {
  try {
    const { requestsNeedApproval, requestsCanBeDeletedBySomeoneElse } =
      req.body;

    const config = await Config.findOne();

    config.requests.requestsNeedApproval = requestsNeedApproval;
    config.requests.canDeleteSomeoneElsesRequest =
      requestsCanBeDeletedBySomeoneElse;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
