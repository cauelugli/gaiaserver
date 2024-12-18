const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const cors = require("cors");

const addRoute = require("./routes/add");
const editRoute = require("./routes/edit");
const editSmallRoute = require("./routes/editSmall");
const deleteRoute = require("./routes/delete");
const getRoute = require("./routes/get");
const notificationsRoute = require("./routes/notifications");
const getConfigRoute = require("./routes/getConfig");
const idIndexListRoute = require("./routes/idIndexList");

const actionsRoute = require("./routes/actions");
const adminRoute = require("./routes/admin");
const agendaRoute = require("./routes/agenda");
const authRoute = require("./routes/auth");
const configRoute = require("./routes/config");
const uploadsRoute = require("./routes/uploads");
const userPreferencesRoute = require("./routes/userPreferences");
const productsRoute = require("./routes/products");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/attachments", express.static(__dirname + "/uploads/attachments"));
app.use("/images", express.static(__dirname + "/uploads/images"));
app.use("/static", express.static("../uploads"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/actions", actionsRoute);
app.use("/api/add", addRoute);
app.use("/api/edit", editRoute);
app.use("/api/editSmall", editSmallRoute);
app.use("/api/delete", deleteRoute);
app.use("/api/get", getRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/idIndexList", idIndexListRoute);
app.use("/api/admin", adminRoute);
app.use("/api/getConfig", getConfigRoute);
app.use("/api/auth", authRoute);
app.use("/api/login", authRoute);
app.use("/api/config", configRoute);
app.use("/api/products", productsRoute);

app.use("/api/uploads", uploadsRoute);
app.use("/api/agenda", agendaRoute);
app.use("/api/userPreferences", userPreferencesRoute);

server.listen(3000, () => {
  console.log("Backend is running.");
});
