import express from "express";
import cors from "cors";
import logger from "morgan";

import registerRoute from "./routes/register.js"
import loginRoute from "./routes/login.js"
import verifyRoute from "./routes/verify.js"

import visitsRouter from "./routes/api_v1/visits.js";
import huntingRecordsRouter from "./routes/api_v1/huntingRecords.js";

import areaRoutes from "./routes/api_v1/areas.js";
import structureRoutes from "./routes/api_v1/structures.js";

import hunters from "./routes/api_v1/users.js"

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());


app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/verify", verifyRoute); 

app.use("/api/v1/visits", visitsRouter);
app.use("/api/v1/hunting-records", huntingRecordsRouter);

app.use("/api/v1/areas", areaRoutes);
app.use("/api/v1/structures", structureRoutes);

app.use("/api/v1/hunters", hunters);

app.get("/", (req, res) => {
    res.send("Server is running!");
  });

export default app;