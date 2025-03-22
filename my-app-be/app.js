import express from "express";
import cors from "cors";
import logger from "morgan";


const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Server is running!");
  });

export default app;