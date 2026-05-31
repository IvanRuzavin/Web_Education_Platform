const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log("Server started");
});

const authRoutes =
    require("./routes/auth");

app.use("/auth", authRoutes);

const userRoutes =
    require("./routes/users");

app.use("/users", userRoutes);

const projectRoutes =
    require("./routes/projects");

app.use("/projects", projectRoutes);