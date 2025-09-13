const HttpError = require("../models/errorModel");
const ConversationModel = require("../models/conversationModel");
const MessageModel = require("../models/messageModel");
const { getReceiverSocketId } = require("../socket/socket");

// ========== CREATE MESSAGE ==========
// POST : api/messages/:receiverId
// PROTECTED
const createMessage = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const { messageBody } = req.body;
    // check if there's an existing conversation between sender and receiver
    let conversation = await ConversationModel.findOne({
      // finds the first match
      participants: { $all: [req.user.id, receiverId] }, // matches if all specified values are present in the array
    });
    // create a new conversation if none was found
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [req.user.id, receiverId],
        lastMessage: { text: messageBody, senderId: req.user.id },
      });
    }
    // create a new message
    const newMessage = await MessageModel.create({
      conversationId: conversation._id,
      senderId: req.user.id,
      text: messageBody,
    });
    await conversation.updateOne({
      lastMessage: { text: messageBody, senderId: req.user.id },
    });
    res.json(newMessage);
    // res.json("Create Message");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET MESSAGES ==========
// GET : api/messages/:receiverId
// PROTECTED
const getMessages = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const conversation = await ConversationModel.findOne({
      participants: { $all: [req.user.id, receiverId] },
    });
    if (!conversation) {
      return next(new HttpError("No conversation found", 404));
    }
    const messages = await MessageModel.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.json(messages);
    // res.json("Get Messages");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ========== GET CONVERSATIONS ==========
// POST : api/conversations
// PROTECTED
const getConversations = async (req, res, next) => {
  try {
    // finds all conversations that include the user
    let conversations = await ConversationModel.find({
      participants: req.user.id,
    })
      .populate({ path: "participants", select: "fullName profilePhoto" }) // populates participants array with user names and photos
      .sort({ createdAt: -1 });
    conversations.forEach((conversation) => {
      // look through each
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== req.user.id // filter out the user themselves
      );
    });
    const getReceiverSocketId = getReceiverSocketId(receiverId);
    if (getReceiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.json(conversations);
    // res.json("Get Conversations");
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createMessage,
  getMessages,
  getConversations,
};
