const express = require("express");
const cors = require("cors");

const databaseReady = require("./initDatabase");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const projectRoutes = require("./routes/projects");
app.use("/projects", projectRoutes);

const evaluationRoutes = require("./routes/evaluations");
app.use("/evaluations", evaluationRoutes);

databaseReady.then(() => {
  app.listen(5000, () => {
    console.log("Server started");
  });
});
