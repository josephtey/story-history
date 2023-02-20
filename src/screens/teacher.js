import { useState } from "react";
import { Button, Form, Input } from "antd";
import { callDALLE, callGPT3 } from "../gpt";
import db from "../firebase";
import { doc, addDoc, collection } from "firebase/firestore";
import ReactLoading from "react-loading";
const { TextArea } = Input;

const TeacherDashboard = (props) => {
  const [form] = Form.useForm();
  const [isGenerating, setIsGenerating] = useState(false);

  const buildPrompt = ({ event, perspective, setting, learning }) => {
    return `You are the narrator of a story. Here is the framework for your story.

    The story is split into 5 chapters, where each chapter has at least 3 paragraphs. 
    
    Each chapter should have an appropriate title.Each chapter should have one descriptive prompt that will be used to generate an image in Dalle-E. 
    The prompt should have the format, "<prompt description> by Thomas Cole, Breath-taking digital painting with placid colours, amazing art, artstation 3, cottagecore"

    Your story must be historically accurate.

    Your story should have the following structure.

    response:[{"name": <chapter 1 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter 2 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter 3 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter 4 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter 5 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]}]

    prompt:   
    Your story is a second-person narrative about: 
    ${event}

    Your reader is taking on the following the persona:
    ${perspective}

    By the end of your story, your reader should learn about: 
    ${learning}

    Your story is set in: 
    ${setting}
    
    response:`;
  };

  const buildCharacterMap = ({ story }) => {
    return `Given a story, create five characters who's knowledge is limited to everything that has happened in the story. You will be speaking to the reader of the story, and answering any questions they have. The format for the name should be, "Name of the character". The format for the character description should be as follows, "You are <character name>, you are from... " Capture their name, where they are from, a brief background about their life, and what they are feeling right now. Each character should represent different demographics. Create a prompt description for this character that will be used to generate an image with DALLE. The prompt should describe how they look, dress, and the setting of the conversation. The format for the prompt description should be as follows, "<prompt description> by Thomas Cole, Breath-taking digital painting with placid colours, amazing art, artstation 3, cottagecore"

    This should be the structure of your response:
    
    response:
    [{"name": "<character name>", "introduction": "<character introduction>", "description": "<prompt description>"},{"name": "<character name>", "introduction": "<character introduction>", "description": "<prompt description>"},{"name": "<character name>", "introduction": "<character introduction>", "description": "<prompt description>"},{"name": "<character name>", "introduction": "<character introduction>", "description": "<prompt description>"},{"name": "<character name>", "introduction": "<character introduction>", "description": "<prompt description>"}]
    
    This is the story so far: ${story}
    
    response:`;
  };

  const handleSubmit = async () => {
    setIsGenerating(true);

    const values = form.getFieldsValue(true);
    const context = buildPrompt(values);

    // Story generation
    console.log("======GENERATING STORY=======");
    const story = await callGPT3(context);
    let chapters = [];
    let cleaned_story = "";
    try {
      cleaned_story = story.replaceAll("\n", "").trim();
      console.log(cleaned_story);
      chapters = JSON.parse(cleaned_story);
    } catch (e) {
      console.error(e);
    }

    // Character generation
    console.log("========GENERATING CHARACTERS========");
    const characterContext = buildCharacterMap(cleaned_story);
    const raw_characters = await callGPT3(characterContext);
    console.log(raw_characters);
    let cleaned_characters = "";
    let characters = [];
    try {
      cleaned_characters = raw_characters.replaceAll("\n", "").trim();
      console.log(cleaned_characters);
      characters = JSON.parse(cleaned_characters);
      console.log(characters);
    } catch (e) {
      console.error(e);
    }

    console.log("========GENERATING DALL E IMAGES========");
    for (let i = 0; i < chapters.length; i++) {
      const imgPrompt = chapters[i].prompt;
      const imgUrl = await callDALLE(imgPrompt);
      console.log(imgUrl);

      chapters[i].img_url = imgUrl;
    }

    for (let i = 0; i < characters.length; i++) {
      const imgPrompt = characters[i].description;
      const imgUrl = await callDALLE(imgPrompt);
      console.log(imgUrl);

      characters[i].img_url = imgUrl;
    }

    const docData = {
      metaData: values,
      chapters,
      characters,
    };

    const storiesRef = collection(db, "stories");

    const newDoc = await addDoc(storiesRef, docData);

    props.history.push("/teacher/" + newDoc.id);
  };

  return isGenerating ? (
    <div className="flex w-full justify-center content-center h-screen flex-wrap flex-col">
      <ReactLoading type={"spin"} color={"white"} height={100} width={100} />
    </div>
  ) : (
    <div
      style={{
        margin: "0 auto",
        width: "500px",
        color: "white !important",
      }}
      className="pt-24"
    >
      <Button
        type="dashed"
        onClick={() => {
          props.history.push("/");
        }}
        className="mb-8"
      >
        Back
      </Button>
      <h1 className="font-bold text-3xl mb-4">Generate a Historical Story!</h1>
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="What historical event would you like to teach?"
          name="event"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="What perspective should your student take on?"
          name="perspective"
        >
          <Input />
        </Form.Item>

        <Form.Item label="Your story is set in..." name="setting">
          <Input />
        </Form.Item>

        <Form.Item
          label="At the end of the story, what do you want your students to learn?"
          name="learning"
        >
          <Input />
        </Form.Item>
        {/* 
        <Form.Item
          label="What is a trusted paragraph of source material for this event?"
          name="learning"
        >
          <TextArea />
        </Form.Item> */}

        <Form.Item>
          <Button type="default" htmlType="submit" onClick={handleSubmit}>
            Generate Story!
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TeacherDashboard;
