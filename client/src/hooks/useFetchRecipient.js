import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipients = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const memberString = chat?.members || "[]";

  let member;
  try {
    member = JSON.parse(memberString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    member = [];
  }
  console.log("member 1: ", member);
  console.log(typeof member);
  console.log("member 2: ", chat?.members);
  console.log(typeof chat?.members);

  const recipientId = member.find((id) => id !== user?.id);

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
