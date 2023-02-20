const { Configuration, OpenAIApi } = require("openai");
const secretKey = "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";

export async function callGPT3(myPrompt) {
  const configuration = new Configuration({
    apiKey: secretKey,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: myPrompt,
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
