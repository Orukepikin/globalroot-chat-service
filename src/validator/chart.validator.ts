import Joi from "joi";
import { validator } from "./validator.utils";

/**
 * Create Conversation
 * - participantIds: required array of user IDs
 * - title: optional (for group chat)
 * - isGroup: optional boolean
 */
export const validateCreateConversation = validator(
    Joi.object({
        participantIds: Joi.array().items(Joi.string().required()).min(1).required(),
        title: Joi.string().min(3).max(120).optional(),
        isGroup: Joi.boolean().optional().default(false),
    })
);

/**
 * List Conversations
 * - No body required, only validates headers (if needed)
 */
export const validateListConversations = validator(Joi.object({}));

/**
 * Get Messages
 * - id (conversationId): from params
 * - limit: optional query param
 * - cursor: optional query param
 */
export const validateGetMessages = validator(
    Joi.object({
        id: Joi.string().uuid().required(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        cursor: Joi.string().optional(),
    })
);

/**
 * Post Message
 * - content: required unless mediaUrl present
 * - mediaUrl: optional
 * - type: defaults to "text"
 */
export const validatePostMessage = validator(
    Joi.object({
        content: Joi.string().allow(null, "").when("mediaUrl", {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required(),
        }),
        mediaUrl: Joi.string().uri().optional(),
        type: Joi.string().valid("text", "image", "video", "file").default("text"),
    })
);

