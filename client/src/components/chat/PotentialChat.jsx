import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

function PotentialChat() {
  const { user } = useContext(AuthContext);
  const { potentialChat, createChat } = useContext(ChatContext);

  return (
    <>
      <div className="all-users">
        {potentialChat &&
          potentialChat.map((u, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user.id, u.id)}
              >
                {u.name}
                <span className="user-online"></span>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default PotentialChat;
