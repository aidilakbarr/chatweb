import messageSchema from "../models/messageModel.js";

export const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const response = await messageSchema.create({
      chatId,
      senderId,
      text,
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getMassages = async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const messages = await messageSchema.findAll({
      where: {
        chatId: chatId,
      },
    });

    if (messages && messages.length > 0) {
      const messageData = messages.map((e) => e.toJSON());
      res.status(200).json(messageData);
    } else {
      res.status(200).json("No matching records found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
