const io = require("../api/node_modules/socket.io-client");
const socket = io("http://localhost:5002");

const Queue = require("bull");
const {
  translateMethod,
  translateModel,
} = require("../controllers/notificationOptions");
const notificationQueue = new Queue("notificationQueue", {
  redis: { port: 6379, host: "127.0.0.1" },
});

// MAIN PROCESSOR
notificationQueue.process(async (job) => {
  const { type, data } = job.data;
  const finalList = job.data.notificationList;
  const isAdmin = job.data.isAdmin;

  try {
    switch (type) {
      case "notifyAdmin":
        await handleNotifyAdmin(data, isAdmin);
        break;
      case "productIsCreated":
        await handleProductIsCreated(data, finalList);
        break;

      default:
        throw new Error(`Tipo de notificação não suportado: ${type}`);
    }

    return true;
  } catch (err) {
    console.error(
      `Erro ao processar notificação do tipo ${type}: ${err.message}`
    );
    throw err;
  }
});

// HANDLERS
const handleNotifyAdmin = async (data, isAdmin) => {
  socket.emit("notifyAdmin", {
    target: data,
    sourceId: data.createdBy,
    method: translateMethod(data.method),
    model: translateModel(data.model),
    isFemaleGender: data.model === "Sale",
    isAdmin: isAdmin,
  });
};

const handleProductIsCreated = async (data, list) => {
  const { name, type, createdBy } = data;

  socket.emit("notificationToList", {
    finalTarget: `do tipo ${type}: "${name}"`,
    method: "add",
    emitterId: createdBy,
    receivers: list,
    label: "Produto",
  });
};

// MONITORING (DEBUG)
// notificationQueue.on("completed", (job) => {
//   console.log(`Tarefa ${job.id} concluída com sucesso.`);
// });
// notificationQueue.on("failed", (job, err) => {
//   console.error(`Tarefa ${job.id} falhou: ${err.message}`);
// });
console.log("Worker Server running on port 6379 and waiting for jobs");

module.exports = notificationQueue;
