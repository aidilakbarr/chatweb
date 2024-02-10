import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

function PotentialChat() {
  const { user } = useContext(AuthContext);
  const { potentialChat, createChat, onlineUsers } = useContext(ChatContext);

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
                <span
                  className={
                    onlineUsers?.some((user) => user?.userId === u?.id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default PotentialChat;
