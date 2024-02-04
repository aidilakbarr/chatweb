import ChatSchema from "../models/chatModel.js";
import { Op, literal } from "sequelize";

export const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await ChatSchema.findOne({
      where: {
        members: {
          [Op.overlap]: [firstId, secondId],
        },
      },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = await ChatSchema.create({
      members: [firstId, secondId],
    });

    res.status(200).json(newChat.toJSON());
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await ChatSchema.findAll({
      where: {
        members: {
          [Op.and]: [
            literal(`JSON_CONTAINS(\`Chat\`.\`members\`, '["${userId}"]')`),
            // Add other conditions if needed
          ],
        },
      },
    });

    if (chats && chats.length > 0) {
      const chatData = chats.map((chat) => chat.toJSON());

      res.status(200).json(chatData);
    } else {
      res.status(200).json("No matching records found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await ChatSchema.findAll({
      where: {
        members: {
          [Op.and]: [
            literal(`JSON_CONTAINS(\`Chat\`.\`members\`, '["${firstId}"]')`),
            literal(`JSON_CONTAINS(\`Chat\`.\`members\`, '["${secondId}"]')`),
          ],
        },
      },
    });
    console.log(chat);

    if (chat && chat.length > 0) {
      const chatData = chat.map((e) => e.toJSON());
      res.status(200).json(chatData);
    } else {
      res.status(200).json("No matching records found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
