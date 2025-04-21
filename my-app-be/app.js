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
import announcements from "./routes/api_v1/announcements.js"

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());


if (process.env.STATUS === 'production') {
  app.set('trust proxy', 1);
}


app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/verify", verifyRoute); 

app.use("/api/v1/visits", visitsRouter);
app.use("/api/v1/hunting-records", huntingRecordsRouter);

app.use("/api/v1/areas", areaRoutes);
app.use("/api/v1/structures", structureRoutes);

app.use("/api/v1/hunters", hunters);
app.use("/api/v1/announcements", announcements);

app.get("/", (req, res) => {
    res.send("Server is running!");
  });

export default app;