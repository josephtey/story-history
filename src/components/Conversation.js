import react, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { callGPT3 } from "../gpt";

const Conversation = ({ characterInfo, storySoFar, nextPage }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const context = `You are going to be engaging in conversation with a reader. Begin the conversation by introducing your name, a brief background about your life, and an introductory question to your reader. 

  This is who you are: ${characterInfo.introduction}
  
  This is the story you are a part of:  ${JSON.stringify(storySoFar)}
  `;

  const composePrompt = (messages) => {
    let history = `${context}\n`;

    for (let i = 0; i < messages.length; i++) {
      history += messages[i].user + ": " + messages[i].text + "\n";
    }

    history += characterInfo.name + ":";

    console.log(history);
    return history;
  };

  useEffect(() => {
    const init = async () => {
      const firstMessage = await callGPT3(
        context + "\n" + characterInfo.name + ":"
      );
      setMessages([
        {
          user: characterInfo.name,
          text: firstMessage,
        },
      ]);
    };

    init();
  }, []);

  return (
    <div
      style={{
        margin: "auto",
        width: "1000px",
        padding: "80px",
      }}
      className="flex flex-col h-screen gap-10"
    >
      <div className="flex flex-col gap-4">
        <img
          src={characterInfo.img_url}
          style={{
            width: "150px",
            height: "150px",
            alignSelf: "center",
            borderRadius: "20px",
          }}
        />
        <div className="flex flex-col gap-2 text-center">
          <div className="font-bold text-3xl">{characterInfo.name}</div>
          {characterInfo.role ? <p>{characterInfo.role}</p> : null}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 rounded-lg bg-stone-900 p-8 h-96 overflow-scroll">
        {messages.map((message) => {
          return (
            <div
              className={`text-white ${
                message.user === "You"
                  ? "bg-blue-500 self-end"
                  : "bg-stone-700 self-start"
              } text-sm w-96 p-3 rounded-lg`}
            >
              {message.text}
            </div>
          );
        })}
      </div>
      <Input
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
        onPressEnter={async () => {
          const newMessage = {
            user: "You",
            text: currentMessage,
          };
          setMessages([...messages, newMessage]);
          setCurrentMessage("");
          const context = composePrompt([...messages, newMessage]);
          const response = await callGPT3(context);
          setMessages([
            ...messages,
            newMessage,
            {
              user: characterInfo.name,
              text: response,
            },
          ]);
        }}
      />
      <Button
        className="self-end"
        type="dashed"
        onClick={() => {
          nextPage();
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default Conversation;
