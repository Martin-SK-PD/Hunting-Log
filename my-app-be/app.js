import express from "express";
import cors from "cors";
import logger from "morgan";

import registerRoute from "./routes/register.js"
import loginRoute from "./routes/register.js"
import verifyRoute from "./routes/verify.js"

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());


app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/verify", verifyRoute); 

app.get("/", (req, res) => {
    res.send("Server is running!");
  });

export default app;