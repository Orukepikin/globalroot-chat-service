import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.routes";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/chat", chatRoutes);

app.get("/", (req, res) => res.json({ status: "ok", service: "chat-service" }));

export default app;
