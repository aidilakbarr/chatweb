import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipients = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  let recipientId;

  if (Array.isArray(chat?.members)) {
    recipientId = chat?.members?.find((id) => id != user?.id);
  } else if (chat?.members) {
    recipientId = JSON.parse(chat?.members).find((id) => id != user?.id);
  } else {
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
