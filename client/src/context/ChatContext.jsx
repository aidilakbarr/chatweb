import { createContext, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChat, setUserChat] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);

  useEffect(() => {
    const getUserChat = async () => {
      if (user?.id) {
        setIsUserChatLoading(true);
        setUserChatError(null);
        const response = await getRequest(`${baseUrl}/chat/${user?.id}`);

        console.log(`${baseUrl}/chat/${user?.id}`);
        setIsUserChatLoading(false);
        if (response.error) {
          return setUserChatError(response);
        }

        setUserChat(response);
      }
    };

    getUserChat();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChat,
        isUserChatLoading,
        userChatError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
