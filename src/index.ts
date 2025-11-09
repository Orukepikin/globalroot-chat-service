import app from "./app";
import { createServer } from "http";
import { initSocket } from "./sockets/socket";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 4000;

const server = createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Chat service listening on port ${PORT}`);
});
