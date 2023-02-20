import { Button, Form, Input } from "antd";
import { callGPT3 } from "../gpt";
import db from "../firebase";
import { doc, addDoc, collection } from "firebase/firestore";
const { TextArea } = Input;

const TeacherDashboard = () => {
  const [form] = Form.useForm();

  const buildPrompt = ({ event, perspective, setting, learning }) => {
    return `You are the narrator of a story. Here is the framework for your story.

    The story is split into 5 chapters, where each chapter has at least 3 paragraphs. Each chapter should have an appropriate title.

    Your story must be historically accurate.

    Your story should have the following structure.

    response:[{"name": "<chapter name>", "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter name>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter name>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter name>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter name>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]}]

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
    const values = form.getFieldsValue(true);
    const context = buildPrompt(values);

    const story = await callGPT3(context);
    let chapters = {};

    try {
      const cleaned_story = story.replaceAll("\n", "").trim();
      console.log(cleaned_story);
      chapters = JSON.parse(cleaned_story);
    } catch (e) {
      console.error(e);
    }

    console.log(chapters);

    const docData = {
      metaData: values,
      chapters,
    };

    const storiesRef = collection(db, "stories");

    await addDoc(storiesRef, docData);
  };

  return (
    <div
      style={{
        margin: "0 auto",
        width: "500px",
        color: "white !important",
      }}
      className="pt-24"
    >
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
