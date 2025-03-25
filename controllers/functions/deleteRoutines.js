const { defineModel } = require("../../controllers/functions/routeFunctions");

async function deleteRoutinesClient(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesCustomer(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesJob(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesProduct(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesBaseProduct(id) {
  const Model = defineModel("Product");

  try {
    await Model.findByIdAndDelete(id);
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesSale(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesService(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    for (const id of itemsToDelete) {
      const deletedItem = await Model.findByIdAndDelete(id);

      if (deletedItem) {
        const { department } = deletedItem;

        if (department) {
          await defineModel("Department").findByIdAndUpdate(department, {
            $pull: { services: deletedItem._id.toString() },
          });
        }
      }
    }

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesServicePlan(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

async function deleteRoutinesStockEntry(
  model,
  isMultiple,
  deletedItem,
  sourceId,
  ids
) {
  const Model = defineModel(model);

  if (!Model) {
    console.log("\nModel not found\n");
    return res.status(400).json({ error: "Modelo inválido" });
  }
  try {
    const itemsToDelete = isMultiple ? ids : [deletedItem];

    await Promise.all(
      itemsToDelete.map(async (id) => {
        await Model.findByIdAndDelete(id);
      })
    );

    // notify that sourceId made this
  } catch (err) {
    console.error("Erro na rotina de deleção", err);
  }
}

module.exports = {
  deleteRoutinesClient,
  deleteRoutinesCustomer,
  deleteRoutinesJob,
  deleteRoutinesProduct,
  deleteRoutinesBaseProduct,
  deleteRoutinesSale,
  deleteRoutinesService,
  deleteRoutinesServicePlan,
  deleteRoutinesStockEntry,
};
