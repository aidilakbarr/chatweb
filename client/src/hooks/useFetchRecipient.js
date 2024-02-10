import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipients = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  let recipientId;

  if (Array.isArray(chat?.members)) {
    console.log("4 : ", chat);
    recipientId = chat?.members?.find((id) => id != user?.id);
  } else if (chat?.members) {
    console.log("6 : ", chat);
    recipientId = JSON.parse(chat?.members).find((id) => id != user?.id);
  } else {
    console.log("5 : ", chat);
    recipientId = undefined;
  }

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;

      const response = await getRequest(`${baseUrl}/find/${recipientId}`);

      if (response.error) {
        return setError(response);
      }

      setRecipientUser(response);
    };
    getUser();
  }, [recipientId]);

  return { recipientUser };
};
