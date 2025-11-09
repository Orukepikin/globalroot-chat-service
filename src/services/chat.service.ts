import db from "../utils/db";

export const createConversation = async (creatorId: string, participantIds: string[], title?: string, isGroup = false) => {
  const allParticipants = [...new Set([creatorId, ...participantIds])];

  if (!isGroup && allParticipants.length === 2) {
    const existing = await db.conversation.findFirst({
      where: {
        isGroup: false,
        members: {
          every: {
            userId: { in: allParticipants },
          },
        },
      },
      include: { members: true },
    });

    if (existing) return existing;
  }

  const conv = await db.conversation.create({
    data: {
      title,
      isGroup,
      members: {
        create: allParticipants.map((userId: string) => ({ userId })),
      },
    },
    include: { members: true },
  });

  return conv;
};

export const listConversations = async (userId: string) => {
  const memberships = await db.conversationMember.findMany({
    where: { userId },
    include: {
      conversation: {
        include: {
          messages: { take: 1, orderBy: { createdAt: "desc" } },
          members: true,
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return memberships.map((m) => m.conversation);
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (conversationId: string, limit = 50, cursor?: string) => {
  const where: any = { conversationId };
  if (cursor) where.id = { lt: cursor };

  const messages = await db.message.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return messages.reverse();
};

/**
 * Post a new message
 */
export const postMessage = async (
  conversationId: string,
  senderId: string,
  payload: { content?: string; mediaUrl?: string; type?: string }
) => {
  const member = await db.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId: senderId } },
  });

  if (!member) throw new Error("Not a member of conversation");

  const msg = await db.message.create({
    data: {
      conversationId,
      senderId,
      content: payload.content,
      mediaUrl: payload.mediaUrl,
      type: payload.type || "text",
    },
  });

  return msg;
};