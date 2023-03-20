import { ChatOpenAI } from "langchain/chat_models";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

const { Configuration, OpenAIApi } = require("openai");

const secretKey = process.env.REACT_APP_OPENAI_API_KEY;

export async function callGPT4(myPrompt) {
  const chat = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4",
    openAIApiKey: secretKey,
  });

  const response = await chat.call([new HumanChatMessage(myPrompt)]);

  return response.text;
}
export async function callGPT3(myPrompt) {
  const configuration = new Configuration({
    apiKey: secretKey,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "davinci",
    messages: myPrompt,
    temperature: 0.7,
    max_tokens: 2700,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.data.choices[0].text;
}

export async function callDALLE(prompt) {
  const configuration = new Configuration({
    apiKey: secretKey,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createImage({
    prompt,
    n: 1,
    size: "512x512",
  });

  const image_url = response.data.data[0].url;

  return image_url;
}
