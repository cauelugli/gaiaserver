const express = require("express");
const router = express.Router();
const StockItem = require("../../models/models/StockItem");

// GET ALL STOCK ITEMS
router.get("/", async (req, res) => {
  try {
    const stockItems = await StockItem.find();
    res.status(200).json(stockItems);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE STOCK ITEM
router.post("/", async (req, res) => {
  const newStockItem = new StockItem(req.body);
  try {
    const savedStockItem = await newStockItem.save();
    res.status(200).json(savedStockItem);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE STOCK ITEM
router.delete("/:id", async (req, res) => {
  const stockItemId = req.params.id;

  try {
    const deletedStockItem = await StockItem.findByIdAndDelete(stockItemId);
    res.status(200).json(deletedStockItem);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

// UPDATE STOCK ITEM
router.put("/", async (req, res) => {
  try {
    const updatedStockItem = await StockItem.findByIdAndUpdate(
      req.body.stockItemId,
      {
        name: req.body.name,
        sellValue: req.body.sellValue,
        buyValue: req.body.buyValue,
        image: req.body.image,
      },
      { new: true }
    );
    res.status(200).json(updatedStockItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
