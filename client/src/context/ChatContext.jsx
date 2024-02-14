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
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("notifications", notifications);
  console.log("currentChat", currentChat);
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

    // const recipientId = currentChat?.members.find((id) => id !== user?.id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // Receive messages and notification
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?.id != res.chatId) return;

      setMessages((prev) => {
        console.log("messages", messages);
        return [...prev, res];
      });
    });

    console.log("r", typeof currentChat?.members);
    socket.on("getNotification", (res) => {
      let recipientId;

      console.log("r", currentChat);
      console.log("r", currentChat?.members);
      console.log("r", typeof currentChat?.members);
      if (Array.isArray(currentChat?.members)) {
        console.log("masuk pertama");
        recipientId = currentChat?.members;
        console.log("masuk pertama", typeof recipientId);
      } else if (currentChat?.members) {
        console.log("masuk kedua");
        recipientId = JSON.parse(currentChat?.members);
        console.log("masuk kedua", typeof recipientId);
      } else {
        recipientId = [];
        console.log("masuk ketiga", recipientId);
      }

      const isChatOpen = recipientId.some((id) => {
        console.log("id", id);
        console.log("id", typeof id);
        console.log("res.senderId", res.senderId);
        console.log("res.senderId", typeof res.senderId);

        return id == res.senderId;
      });
      console.log("ischatopen", isChatOpen);
      console.log("ischatopen", typeof isChatOpen);

      if (isChatOpen) {
        setNotifications((prev) => {
          console.log("res", res);
          // console.log("res", ...res);
          console.log("prev", prev);
          console.log("prev", ...prev);
          return [{ ...res, isRead: true }, ...prev];
        });
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
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
          isChatCreated = userChat?.some((chat) => {
            let tes = null;
            if (typeof chat?.members == "string") {
              tes = JSON.parse(chat?.members);
            } else {
              tes = chat?.members;
            }

            return tes[0] == u.id || tes[1] == u.id;
          });
        }

        return !isChatCreated;
      });
      setPotentialChat(pChats);
      setAllUsers(response);
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
  }, [user, notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessageLoading(true);
      setMessagesError(null);
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?.id}`
      );

      setIsMessageLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
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
      setMessages((prev) => {
        if (typeof prev == "string") {
          return [response];
        }
        return [...prev, response];
      });
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

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChat, user, notifications) => {
      // Find chat to open
      console.log("n", n);
      console.log("userChats", userChat);
      console.log("user", user);
      console.log("notifications", notifications);
      const desiredChat = userChat.find((chat) => {
        const chatMembers = [user.id, n.senderId];
        let tes = null;
        if (typeof chat?.members == "string") {
          tes = JSON.parse(chat?.members);
        } else {
          tes = chat?.members;
        }
        const isDesiredChat = tes.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      // Mark notification as read
      const mNotifications = notifications.map((el) => {
        if (n.senderId == el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotifications(mNotifications);
    },
    []
  );

  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      // Mark notification as read
      const mNotification = notifications.map((el) => {
        let notification;
        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });

        return notification;
      });

      setNotifications(mNotification);
    },
    []
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
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
