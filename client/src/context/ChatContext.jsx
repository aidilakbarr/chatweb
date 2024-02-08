import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

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
            if (typeof chat.members == "string") {
              tes = JSON.parse(chat.members);
            } else {
              tes = chat.members;
            }

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
