import { Router } from "express";
import * as chatController from "../controllers/chat.controller";

const router = Router();

router.post("/conversations", chatController.createConversation);
router.get("/conversations", chatController.listConversations);
router.get("/conversations/getMessage", chatController.getMessages);
router.post("/conversations/postMessage", chatController.postMessage);

export default router;
