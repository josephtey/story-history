import react, { useState } from "react";
import { Input } from "antd";

const context =
  "You are a psychologist that is gentle, empathetic, and cares for others.";

const composePrompt = (messages) => {
  let history = `${context}\n`;

  for (let i = 0; i < messages.length; i++) {
    history += messages[i].user + ": " + messages[i].text + "\n";
  }

  history += "You:";
  return history;
};

const Conversation = () => {
  const [messages, setMessages] = useState([
    {
      user: "Horatio",
      text: "Hi! How are you?",
    },
    {
      user: "You",
      text: "Good!",
    },
    {
      user: "Horatio",
      text: "Amazing!",
    },
  ]);
  return (
    <div
      style={{
        margin: "auto",
        padding: "80px",
      }}
      className="flex flex-col h-screen gap-8"
    >
      <div className="flex flex-col gap-4">
        <img
          src="https://media.istockphoto.com/id/1170061515/vector/funny-cartoon-monster-face-vector-halloween-monster-square-avatar.jpg?s=170667a&w=0&k=20&c=_gHVYItZYrriusEraKlORqU_kYoefNy_Ah6QrGAbgxE="
          style={{
            width: "200px",
            height: "200px",
            alignSelf: "center",
            borderRadius: "9999px",
          }}
        />
        <div className="font-bold text-3xl text-center">Horatio</div>
      </div>
      <div className="flex-1 flex flex-col gap-2 rounded-lg bg-stone-900 p-8">
        {messages.map((message) => {
          return (
            <div
              className={`text-white ${
                message.user === "You"
                  ? "bg-blue-500 self-end"
                  : "bg-stone-500 self-start"
              } p-2 rounded-lg`}
            >
              {message.text}
            </div>
          );
        })}
      </div>
      <Input />
    </div>
  );
};

export default Conversation;
