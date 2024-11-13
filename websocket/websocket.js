const { Server } = require("socket.io");
const User = require("../models/models/User");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 300000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://gaiaserver",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  const userSocketMap = {};

  io.on("connection", (socket) => {
    socket.on("userId", (userId) => {
      userSocketMap[userId] = socket.id;
    });

    socket.on("test", () => {
      console.log("\nWebsocket Test OK!\n");
    });

    socket.on("forceRefresh", () => {
      io.emit("forceRefresh");
    });

    socket.on("forceIndividualRefresh", (userId) => {
      io.emit("forceIndividualRefresh", userId);
    });

    socket.on("notificationToList", async (data) => {
      for (const roleId of data.receivers) {
        try {
          const users = await User.find({
            role: roleId,
            // !emitterId
            _id: { $ne: data.emitterId },
          });

          let parsedBodyMainString;
          let parsedTitleString;

          switch (data.method) {
            case "add":
              parsedBodyMainString = `${data.isFemale ? "Uma" : "Um"} ${
                data.isFemale ? "nova" : "novo"
              } ${data.label} foi ${data.isFemale ? "criada" : "criado"}: "${
                data.finalTarget
              }".`;
              parsedTitleString = `${data.isFemale ? "Nova" : "Novo"} ${
                data.label
              } ${data.isFemale ? "Criada" : "Criado"}`;
              break;
            case "edit":
              parsedBodyMainString = `${data.isFemale ? "Uma" : "Um"} ${
                data.label
              } foi ${data.isFemale ? "editada" : "editado"}: "${
                data.finalTarget
              }".`;
              parsedTitleString = `${data.label} ${
                data.isFemale ? "Editada" : "Editado"
              }`;
              break;
            case "delete":
              parsedBodyMainString = `${data.isFemale ? "A" : "O"} ${
                data.label
              } "${data.finalTarget}" foi ${
                data.isFemale ? "deletada" : "deletado"
              }.`;
              parsedTitleString = `${data.label} ${
                data.isFemale ? "Deletada" : "Deletado"
              }`;
              break;
            default:
              break;
          }

          for (const user of users) {
            const notificationBody =
              parsedBodyMainString +
              (data.item.department
                ? ` Departamento: ${data.item.department}.`
                : "") +
              (data.item.position ? ` Cargo: ${data.item.position}.` : "");

            user.notifications.push({
              read: false,
              title: parsedTitleString,
              body: notificationBody,
              createdAt: new Date().toISOString(),
            });

            await user.save();
          }
        } catch (err) {
          console.error("Erro ao adicionar notificação", err);
        }
      }

      io.emit("newNotificationToList", data);
    });

    socket.on("notifyAssignee", async (data) => {
      try {
        let user;
        user = await User.findById(data.receiver);

        const parsedTitleString = `${
          data.label === "Job"
            ? "Novo Job atribuido a Você"
            : "Nova Venda atribuida a Você"
        } `;
        const notificationBody = `Olá, ${data.receiver}! ${
          data.label === "Job"
            ? "Um novo Job foi atribuído"
            : "Uma nova Venda foi atribuída"
        } a Você ${data.label === "Job" ? `: "${data.target.title}"` : "."} ${
          data.label === "Job" ? `Serviço: ${data.target.service}` : ""
        }
        Cliente: ${data.target.customer}
        Para: ${data.target.scheduledTo}
        `;

        user.notifications.push({
          read: false,
          title: parsedTitleString,
          body: notificationBody,
          createdAt: new Date().toISOString(),
        });

        await user.save();
      } catch (err) {
        console.error("Erro ao adicionar notificação", err);
      }

      io.emit("newNotificationToAssignee", data);
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
