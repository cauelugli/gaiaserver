const { Server } = require("socket.io");
const Role = require("../models/models/Role");
const User = require("../models/models/User");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverSelectionTimeoutMS: 300000, // Aumentar o timeout para 300 segundos
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

    socket.on("newDataRefreshButton", (data) => {
      io.emit("newDataRefreshButton", data);
    });

    socket.on("recentActivityRefresh", () => {
      io.emit("recentActivityRefresh");
    });

    socket.on("whenUserIsCreated", async (data) => {
      try {
        // receives the Roles as a list, and returns the users separatedly in a variable
        const usersToNotify = await Promise.all(
          data.list.flatMap(async (role) => {
            const roleDetails = await Role.findById(role._id);

            if (!roleDetails) {
              return [];
            }

            return await Promise.all(
              roleDetails.members.map(async (userId) => {
                const user = await User.findById(userId);
                return user;
              })
            );
          })
        ).then((usersNested) => usersNested.flat());

        for (const user of usersToNotify) {
          if (!user) {
            continue;
          }

          const newNotification = {
            id: Date.now(),
            type: "Novo Usuário",
            noteBody: `Usuário ${data.createdUser} criado por ${data.sender} em ${data.date}.`,
            sender: data.sender,
            createdAt: data.date,
            status: "Não Lida",
          };

          let updatedUser;

          if (user instanceof User) {
            await User.updateOne(
              { _id: user._id },
              { $set: { [`notifications.${Date.now()}`]: newNotification } }
            );
            updatedUser = await User.findById(user._id);
          }

          const receiverSocketId = userSocketMap[user._id];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("notificationsUpdate", {
              notifications: updatedUser.notifications,
            });
          }
        }
      } catch (error) {
        console.error("Error processing whenUserIsCreated:", error);
      }
    });

    // need to make, or use whenUserIsCreated
    // socket.on("whenManagerIsCreated", async (data) => {}

    socket.on("whenJobIsCreated", async (data) => {
      try {
        const usersToNotify = await Promise.all(
          data.list.flatMap(async (role) => {
            const roleDetails = await Role.findById(role._id);

            if (!roleDetails) {
              return [];
            }

            return await Promise.all(
              roleDetails.members.map(async (userId) => {
                const user = await User.findById(userId);
                return user;
              })
            );
          })
        ).then((usersNested) => usersNested.flat());

        for (const user of usersToNotify) {
          if (!user) continue;

          const newNotification = {
            id: Date.now(),
            type: "Novo Job",
            noteBody: `Novo Job ${data.title} criado por ${data.sender} em ${data.date}.`,
            createdAt: data.date,
            sender: data.sender,
            status: "Não Lida",
          };

          let updatedUser;

          if (user instanceof User) {
            await User.updateOne(
              { _id: user._id },
              { $set: { [`notifications.${Date.now()}`]: newNotification } }
            );
            updatedUser = await User.findById(user._id);
          }
          const receiverSocketId = userSocketMap[user._id];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("notificationsUpdate", {
              notifications: updatedUser.notifications,
            });
          }
        }
      } catch (error) {
        console.error("Error processing whenJobIsCreated:", error);
      }
    });

    socket.on("whenSaleIsCreated", async (data) => {
      try {
        const usersToNotify = await Promise.all(
          data.list.flatMap(async (role) => {
            const roleDetails = await Role.findById(role._id);

            if (!roleDetails) {
              return [];
            }

            return await Promise.all(
              roleDetails.members.map(async (userId) => {
                const user = await User.findById(userId);
                return user;
              })
            );
          })
        ).then((usersNested) => usersNested.flat());

        for (const user of usersToNotify) {
          if (!user) continue;

          const newNotification = {
            id: Date.now(),
            type: "Nova Venda",
            noteBody: `Nova Venda criada por ${data.sender} em ${data.date}.`,
            createdAt: data.date,
            sender: data.sender,
            status: "Não Lida",
          };

          let updatedUser;

          if (user instanceof User) {
            await User.updateOne(
              { _id: user._id },
              { $set: { [`notifications.${Date.now()}`]: newNotification } }
            );
            updatedUser = await User.findById(user._id);
          }

          const receiverSocketId = userSocketMap[user._id];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("notificationsUpdate", {
              notifications: updatedUser.notifications,
            });
          }
        }
      } catch (error) {
        console.error("Error processing whenSaleIsCreated:", error);
      }
    });

    socket.on("requestApproval", async (data) => {
      try {
        const receiverSocketId = userSocketMap[data.receiverId];

        const newNotification = {
          id: Date.now(),
          type: data.type,
          date: data.date,
          createdAt: data.date,
          noteBody: `Olá ${data.receiver}! ${data.sender} 
            está solicitando aprovação para ${data.type} 
            em ${data.date}.`,
          sender: data.sender,
          status: "Não Lida",
        };

        // Sempre salve a notificação
        try {
          await User.findByIdAndUpdate(data.receiverId, {
            $set: { [`notifications.${Date.now()}`]: newNotification },
          });
        } catch (error) {
          console.log("\n\nerro ao salvar gerente", error, "\n");
        }

        const updatedReceiver = await User.findById(data.receiverId);

        if (receiverSocketId) {
          // Emita o evento apenas para o socket do receptor específico
          io.to(receiverSocketId).emit("notificationsUpdate", {
            notifications: updatedReceiver.notifications,
          });
        }
      } catch (error) {
        console.error("Error processing requestApproval:", error);
      }
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });
};

module.exports = initSocket;
