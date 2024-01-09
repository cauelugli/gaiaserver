const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Quote = require("../models/Quote");
const Product = require("../models/Product");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// GET ALL SALES
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE SALES
router.post("/", async (req, res) => {
  const newSale = new Sale(req.body);
  if (newSale.items.length > 0) {
    for (const item of newSale.items) {
      const items = await Product.findById(item._id);
      items.quantity -= item.quantity;
      await items.save();
    }
  }
  try {
    const savedRequest = await newSale.save();
    const newQuote = new Quote({
      number: savedRequest.quoteNumber,
      title: "",
      description: "",
      customer: req.body.customer.name,
      department: req.body.department.name,
      user: req.body.seller.name,
      manager: req.body.manager.name || "",
      service: "",
      type: "sale",
      local: "",
      scheduledTo: req.body.deliveryScheduledTo,
      createdBy: req.body.createdBy,
      value: req.body.price,
      materials: req.body.items,
    });
    const savedQuote = await newQuote.save();
    const doc = new PDFDocument();

    // Construa o caminho completo para o arquivo PDF na pasta estática
    const pdfPath = path.join(
      __dirname,
      "../../uploads/docs",
      `orcamento-${newQuote.type[0]}-${newQuote.number}.pdf`
    );

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.image("../uploads/logo.png", 0, 15, { width: 120 });

    doc
      .fontSize(16)
      .text(`Orçamento de ${newQuote.type === "job" ? "Serviço" : "Venda"}`, {
        align: "center",
      });
    doc.moveDown();

    doc.fontSize(12);
    doc.text("Número do Orçamento:", 120, 120, { align: "left" });
    doc.text(savedQuote.number, 380, 120, { align: "right" });
    doc.text("Título:", 120, 140, { align: "left" });
    doc.text(savedQuote.title, 380, 140, { align: "right" });
    doc.text("Descrição:", 120, 160, { align: "left" });
    doc.text(savedQuote.description, 380, 160, { align: "right" });
    doc.text("Cliente:", 120, 180, { align: "left" });
    doc.text(savedQuote.customer, 380, 180, { align: "right" });
    doc.text("Serviço:", 120, 200, { align: "left" });
    doc.text(savedQuote.service, 380, 200, { align: "right" });
    doc.text("Departamento:", 120, 220, { align: "left" });
    doc.text(savedQuote.department, 380, 220, { align: "right" });
    doc.text("Colaborador:", 120, 240, { align: "left" });
    doc.text(savedQuote.user, 380, 240, { align: "right" });
    doc.text("Gerente Responsável:", 120, 260, { align: "left" });
    doc.text(savedQuote.manager, 380, 260, { align: "right" });
    doc.text("Local de Execução:", 120, 280, { align: "left" });
    doc.text(savedQuote.local, 380, 280, { align: "right" });
    doc.text("Agendado para:", 120, 300, { align: "left" });
    doc.text(savedQuote.scheduledTo, 380, 300, { align: "right" });
    doc.text("Criado por:", 120, 320, { align: "left" });
    doc.text(savedQuote.createdBy, 380, 320, { align: "right" });

    let yPosition = 245;

    doc.text("Lista de Materiais", 120, yPosition + 15, { align: "left" });
    for (const material of savedQuote.materials) {
      doc.text(material.name, 130, yPosition + 30, { align: "left" });
      doc.text(
        "x" + material.quantity + " " + "R$" + material.sellValue,
        250,
        yPosition + 30,
        { align: "right" }
      );
      yPosition += 30;
    }

    doc.text("Valor Total:", 120, yPosition + 70, { align: "left" });
    doc.text(`R$${savedQuote.value.toFixed(2)}`, 420, yPosition + 70, {
      align: "right",
    });

    doc.moveDown();

    doc.end();

    res.status(200).json({ savedRequest, savedQuote });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE SALES
router.delete("/:id", async (req, res) => {
  const saleId = req.params.id;
  try {
    const deletedSale = await Sale.findByIdAndDelete(saleId);
    res.status(200).json(deletedSale);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
