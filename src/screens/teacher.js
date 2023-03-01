import { useState } from "react";
import { Button, Form, Input, Card } from "antd";
import { callDALLE, callGPT3 } from "../gpt";
import { db } from "../firebase";
import { doc, addDoc, collection } from "firebase/firestore";
import ReactLoading from "react-loading";
const { TextArea } = Input;

const TeacherDashboard = (props) => {
  const [form] = Form.useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingState, setGeneratingState] = useState("");
  const [error, setError] = useState(null);

  const buildPrompt = ({ event, summary, perspective, setting, learning }) => {
    return `Transform the following summary of the ${event} into an immersive, dramatic story with a plotline:  
    "${summary}"
    
    The story should fit the following criteria:
    1. The story must have 5 distinct chapters. 
    2. The story must be historically accurate and consistent with the above summary. 
    3. The story is a second-person narrative. 
    4. The story is about: ${event}
    5. The story should teach people about: ${learning}
    6. The reader should take on the persona of: ${perspective}
    7. The story is set in: ${setting} 
    8. Start the story by introducing who the reader is.
        
    For each of the 5 chapters:
    1. Each chapter should have an appropriate title.
    2. Each chapter should have at least 3 paragraphs. 
    3. Each chapter should have one descriptive prompt that will be used to generate an image in Dalle-E. The prompt should have the format, "<prompt description> by Thomas Cole, Breath-taking digital painting with placid colours, amazing art, artstation 3, cottagecore"
        
    story: [{"name": <chapter 1 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter 2 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter 3 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter 4 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]},{"name": <chapter 5 name>, "prompt": <prompt description>, "story": [<paragraph 1>, <paragraph 2>, <paragraph 3>]}]
        
    story: `;
  };

  const buildCharacterMap = (story, values) => {
    return `This is the background of the story: ${JSON.stringify(values)}

    This is the story so far: ${JSON.stringify(story)}

    Given this story, create five characters who's knowledge is limited to everything that has happened in the story. You will be speaking to the reader of the story, and answering any questions they have. The format for the name should be, "Name of the character". The format for the character description should be as follows, "You are <character name>, you are from... " Capture their name, their role, where they are from, a brief background about their life, and what they are feeling right now. Each character should represent different demographics. Create a prompt description for this character that will be used to generate an image with DALLE. The prompt should describe how they look, dress, and the setting of the conversation. The format for the prompt description should be as follows, "<prompt description> by Thomas Cole, Breath-taking digital painting with placid colours, amazing art, artstation 3, cottagecore"

    response: [{"name": "<character name>", "role": "<character role>", "introduction": "<character introduction>", "description": "<prompt description>"},{"name": "<character name>", "role": "<character role>", "introduction": "<character introduction>", "description": "<prompt description>"},{"name": "<character name>", "role": "<character role>", "introduction": "<character introduction>", "description": "<prompt description>"},{"name": "<character name>", "role": "<character role>", "introduction": "<character introduction>", "description": "<prompt description>"},{"name": "<character name>","role": "<character role>", "introduction": "<character introduction>", "description": "<prompt description>"}]
    
    response:`;
  };

  const handleSubmit = async () => {
    setIsGenerating(true);

    const values = form.getFieldsValue(true);
    const context = buildPrompt(values);

    // Story generation
    try {
      console.log("======GENERATING STORY=======");
      setGeneratingState({
        time: "3 minutes left",
        state: "Generating story...",
        description:
          "A story filled with emotion, experience, and beauty - one that will captivate and draw your reader in!",
      });
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
      setGeneratingState({
        time: "1.5 minutes left",
        state: "Generating characters...",
        description:
          "Imagine your student is able to interact with a diverse range of characters that lived during this historical period...",
      });
      const characterContext = buildCharacterMap(chapters.slice(0, 2), values);
      console.log(characterContext);
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
      setGeneratingState({
        time: "1 minute left",
        state: "Generating images for your story...",
        description:
          "A beautiful collection of images that will give life to your story book!",
      });
      for (let i = 0; i < chapters.length; i++) {
        const imgPrompt = chapters[i].prompt;
        const imgUrl = await callDALLE(imgPrompt);
        console.log(imgUrl);

        chapters[i].img_url = imgUrl;
      }

      setGeneratingState({
        time: "30 seconds left",
        state: "Generating images for your characters...",
        description: "Turning personalities into a visual depiction.",
      });
      for (let i = 0; i < characters.length; i++) {
        const imgPrompt = characters[i].description;
        const imgUrl = await callDALLE(imgPrompt);
        console.log(imgUrl);

        characters[i].img_url = imgUrl;
      }
      setGeneratingState("Nearly there!");
      const docData = {
        metaData: values,
        chapters,
        characters,
      };

      const storiesRef = collection(db, "stories");

      const newDoc = await addDoc(storiesRef, docData);

      props.history.push("/teacher/" + newDoc.id);
    } catch (e) {
      setError("Something went wrong :(");
    }
  };

  return error ? (
    <div className="flex w-full justify-center content-center h-screen flex-wrap flex-col text-center gap-4">
      <h1 className="text-rose-500 font-bold text-center">{error}</h1>
      <Button
        type="dashed"
        className="self-center"
        onClick={() => {
          setError(null);
          setIsGenerating(false);
          setGeneratingState(false);
        }}
      >
        Try again
      </Button>
    </div>
  ) : isGenerating ? (
    <div className="flex w-full justify-center content-center h-screen flex-wrap flex-col gap-4">
      <Card
        className="mt-4 self-center"
        title={
          <div className="flex flex-row gap-2">
            <ReactLoading
              className="self-center"
              type={"spin"}
              color={"white"}
              height={15}
              width={15}
            />
            {generatingState?.state}
          </div>
        }
        extra={generatingState?.time}
      >
        <p>{generatingState?.description}</p>
      </Card>
      {/* <Button
        type="dashed"
        className="self-center"
        onClick={() => {
          setIsGenerating(false);
          setError(false);
          setGeneratingState("");
        }}
      >
        Cancel
      </Button> */}
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
      <h1 className="font-bold text-3xl mb-4">Create Your Story</h1>
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="What historical event would you like to teach?"
          name="event"
        >
          <Input placeholder="e.g. The Attack on Pearl Harbour" />
        </Form.Item>
        <Form.Item
          label="Paste a historically accurate summary of this event (use Wikipedia!)"
          name="summary"
        >
          <TextArea
            maxLength={1000}
            showCount
            placeholder="e.g. The attack commenced at 7:48 a.m. Hawaiian Time (6:18 p.m. GMT). The base was attacked by 353 Imperial Japanese aircraft (including fighters, level and dive bombers, and torpedo bombers) in two waves, launched from six aircraft carriers. Of the eight U.S. Navy battleships present, all were damaged, with four sunk. All but USS Arizona were later raised, and six were returned to service and went on to fight in the war. The Japanese also sank or damaged three cruisers, three destroyers, an anti-aircraft training ship, and one minelayer. More than 180 US aircraft were destroyed. 2,403 Americans were killed and 1,178 others were wounded. Important base installations such as the power station, dry dock, shipyard, maintenance, and fuel and torpedo storage facilities, as well as the submarine piers and headquarters building (also home of the intelligence section) were not attacked. Japanese losses were light: 29 aircraft and five midget submarines lost, and 64 servicemen killed. Kazuo Sakamaki, the commanding officer of one of the submarines, was captured."
          />
        </Form.Item>

        <Form.Item
          label="What perspective should your student take on?"
          name="perspective"
        >
          <Input placeholder="e.g. U.S. Soldier" />
        </Form.Item>

        <Form.Item label="Your story is set in..." name="setting">
          <Input placeholder="e.g. Pearl Harbour" />
        </Form.Item>

        <Form.Item
          label="At the end of the story, what do you want your students to learn?"
          name="learning"
        >
          <Input placeholder="e.g. The Tragedies of War" />
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
