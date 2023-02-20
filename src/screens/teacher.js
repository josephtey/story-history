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

  const handleSubmit = async () => {
    setIsGenerating(true);

    const values = form.getFieldsValue(true);
    const context = buildPrompt(values);

    const story = await callGPT3(context);
    let chapters = [];

    try {
      const cleaned_story = story.replaceAll("\n", "").trim();
      console.log(cleaned_story);
      chapters = JSON.parse(cleaned_story);
    } catch (e) {
      console.error(e);
    }

    console.log("BEFORE DALLE ", chapters);

    for (let i = 0; i < chapters.length; i++) {
      const imgPrompt = chapters[i].prompt;
      const imgUrl = await callDALLE(imgPrompt);

      chapters[i].img_url = imgUrl;
    }

    console.log("AFTER DALLE: ", chapters);

    const docData = {
      metaData: values,
      chapters,
    };

    const storiesRef = collection(db, "stories");

    const newDoc = await addDoc(storiesRef, docData);

    props.history.push("/stories/" + newDoc.id);
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
