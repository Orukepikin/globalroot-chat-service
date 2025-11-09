import { Response } from "express";
import * as chatService from "../services/chat.service";
import { AuthRequest } from "../middleware/auth";
import { ServiceWrapper } from "../utils/service-wrapper.util";
import { validateCreateConversation, validateGetMessages, validateListConversations, validatePostMessage } from "../validator/chart.validator";

export const createConversation = async (req: AuthRequest, res: Response) => {
  return ServiceWrapper.executeWithErrorHandling(res, async () => {
    const { error, value } = validateCreateConversation(req.body);
    if (error) {
      throw new Error(`${error.message}`);
    }

    const userId = req.headers["x-user-id"] as string;
    const { participantIds, title, isGroup } = value;

    const conv = await chatService.createConversation(userId, participantIds, title, !!isGroup);
    return res.status(201).json({ status: "success", conversation: conv });
  });
};

// ✅ List Conversations
export const listConversations = async (req: AuthRequest, res: Response) => {
  return ServiceWrapper.executeWithErrorHandling(res, async () => {
    const { error } = validateListConversations(req.body);
    if (error) {
      throw new Error(`${error.message}`);
    }

    const userId = req.headers["x-user-id"] as string;
    const convs = await chatService.listConversations(userId);
    return res.json({ status: "success", conversations: convs });
  });
};

// ✅ Get Messages
export const getMessages = async (req: AuthRequest, res: Response) => {
  return ServiceWrapper.executeWithErrorHandling(res, async () => {
    const input = { ...req.params, ...req.query };
    const { error, value } = validateGetMessages(input);
    if (error) {
      throw new Error(`${error.message}`);
    }

    const { id, limit = 50, cursor } = value;
    const msgs = await chatService.getMessages(id, parseInt(limit as string) || 50, cursor);
    return res.json({ status: "success", messages: msgs });
  });
};

// ✅ Post Message
export const postMessage = async (req: AuthRequest, res: Response) => {
  return ServiceWrapper.executeWithErrorHandling(res, async () => {
    const { error, value } = validatePostMessage(req.body);
    if (error) {
      throw new Error(`${error.message}`);
    }

    const conversationId = req.query.conversationId as string;
    console.log("Conversation ID:", conversationId);
    const userId = req.headers["x-user-id"] as string;
    const { content, mediaUrl, type } = value;

    const msg = await chatService.postMessage(conversationId, userId, { content, mediaUrl, type });
    return res.status(201).json({ status: "success", message: msg });
  });
};
