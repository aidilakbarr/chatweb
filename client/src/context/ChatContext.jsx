import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChat, setUserChat] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);
  const [potentialChat, setPotentialChat] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);

  console.log("onlineUsers", onlineUsers);
  // initial socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?.id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // Send Messages
  useEffect(() => {
    if (socket === null) return;

    let recipientId;

    if (Array.isArray(currentChat?.members)) {
      recipientId = currentChat?.members?.find((id) => id != user?.id);
    } else if (currentChat?.members) {
      recipientId = JSON.parse(currentChat?.members).find(
        (id) => id != user?.id
      );
    } else {
      recipientId = undefined;
    }

    console.log("currentt", currentChat);
    console.log("type currentt", typeof currentChat);
    console.log("type currentt", typeof currentChat?.members);

    // const recipientId = currentChat?.members.find((id) => id !== user?.id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // Receive messages
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?.id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/findall`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;

        if (user?.id === u.id) return false;

        if (userChat) {
          console.log("haha", userChat);
          console.log("haha::", typeof userChat);

          isChatCreated = userChat?.some((chat) => {
            let tes = null;
            if (typeof chat?.members == "string") {
              tes = JSON.parse(chat?.members);
            } else {
              tes = chat?.members;
            }
            console.log("tes", tes);
            console.log(chat);

            return tes[0] == u.id || tes[1] == u.id;
          });
        }

        return !isChatCreated;
      });
      setPotentialChat(pChats);
    };
    getUsers();
  }, [user, userChat]);

  useEffect(() => {
    const getUserChat = async () => {
      if (user?.id) {
        setIsUserChatLoading(true);
        setUserChatError(null);
        const response = await getRequest(`${baseUrl}/chat/${user?.id}`);

        setIsUserChatLoading(false);
        if (response.error) {
          return setUserChatError(response);
        }

        setUserChat(response);
      }
    };

    getUserChat();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessageLoading(true);
      setMessagesError(null);
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?.id}`
      );

      console.log(`${baseUrl}/messages/${currentChat?.id}`);

      setIsMessageLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      console.log("res", response);
      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must type something...");
      const response = await postRequest(
        `${baseUrl}/message`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender.id,
          text: textMessage,
        })
      );
      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(
    async (firstId, secondId) => {
      console.log(firstId);
      console.log(secondId);
      const response = await postRequest(
        `${baseUrl}/chat`,
        JSON.stringify({
          firstId,
          secondId,
        })
      );

      console.log(response);
      if (response.error) {
        return console.log("Error Creating chat", response);
      }

      setUserChat((prev) => {
        if (typeof prev == "string") {
          return [response];
        }
        return [...prev, response];
      });

      console.log("tes pertama: ", userChat);
    },
    [userChat]
  );

  return (
    <ChatContext.Provider
      value={{
        userChat,
        isUserChatLoading,
        userChatError,
        potentialChat,
        createChat,
        currentChat,
        updateCurrentChat,
        messages,
        isMessageLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
