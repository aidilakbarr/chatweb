import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChat from "../components/chat/PotentialChat";
import ChatBox from "../components/chat/ChatBox";

function Chat() {
  const { user } = useContext(AuthContext);
  const { userChat, isUserChatLoading, updateCurrentChat } =
    useContext(ChatContext);

  return (
    <Container>
      <PotentialChat />
      {userChat?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatLoading && <p>Loading chats...</p>}
            {typeof userChat == "object" &&
              userChat?.map((chat, index) => {
                return (
                  <div key={index} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={user} />
                  </div>
                );
              })}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
}

export default Chat;
