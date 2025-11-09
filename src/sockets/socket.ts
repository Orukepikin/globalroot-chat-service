import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import db from "../utils/db";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    console.log("socket connected", socket.id);

    // Expect client to join rooms
    socket.on("join_conversation", async (conversationId: string) => {
      // Basic authorization check could be applied here
      socket.join(`conv:${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(`conv:${conversationId}`);
    });

    socket.on("send_message", async (payload: { conversationId: string; senderId: string; content?: string; mediaUrl?: string; type?: string }) => {
      try {
        // Basic validation & persist
        const member = await db.conversationMember.findUnique({ where: { conversationId_userId: { conversationId: payload.conversationId, userId: payload.senderId } }});
        if (!member) {
          socket.emit("error", "Not a member of conversation");
          return;
        }

        const msg = await db.message.create({
          data: {
            conversationId: payload.conversationId,
            senderId: payload.senderId,
            content: payload.content,
            mediaUrl: payload.mediaUrl,
            type: payload.type || "text",
          }
        });

        io.to(`conv:${payload.conversationId}`).emit("message", msg);
      } catch (err) {
        socket.emit("error", "could not send message");
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
