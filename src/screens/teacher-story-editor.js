import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useParams } from "react-router";
import db from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const { TextArea } = Input;

const TeacherStoryEditor = (props) => {
  const [form] = Form.useForm();
  const [storyData, setStoryData] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchStory = async () => {
      const docRef = doc(db, "stories", id);
      const docSnap = await getDoc(docRef);
      setStoryData(docSnap.data());
    };

    fetchStory();
  }, []);

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true);
    let chapters = [];

    for (let i = 0; i < storyData.chapters.length; i++) {
      let chapter = {
        name: values[`chapter-${i + 1}-name`],
        img_url: values[`chapter-${i + 1}-image`],
        story: [],
      };

      for (let j = 0; j < storyData.chapters[i].story.length; j++) {
        chapter.story.push(values[`chapter-${i + 1}-paragraph-${j + 1}`]);
      }

      chapters.push(chapter);
    }

    await setDoc(doc(db, "stories", id), {
      metaData: storyData.metaData,
      chapters,
    });
  };

  return (
    storyData && (
      <div
        style={{
          margin: "10px auto",
          width: "500px",
          color: "white !important",
        }}
        className="py-24"
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
        <h1 className="font-bold text-3xl mb-4">Edit the AI-Generated Story</h1>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            "chapter-1-name": storyData?.chapters?.[0].name,
            "chapter-1-image": storyData?.chapters?.[0].img_url,
            "chapter-1-paragraph-1": storyData?.chapters?.[0].story[0],
            "chapter-1-paragraph-2": storyData?.chapters?.[0].story[1],
            "chapter-1-paragraph-3": storyData?.chapters?.[0].story[2],
            "chapter-2-name": storyData?.chapters?.[1].name,
            "chapter-2-image": storyData?.chapters?.[1].img_url,
            "chapter-2-paragraph-1": storyData?.chapters?.[1].story[0],
            "chapter-2-paragraph-2": storyData?.chapters?.[1].story[1],
            "chapter-2-paragraph-3": storyData?.chapters?.[1].story[2],
            "chapter-3-name": storyData?.chapters?.[2].name,
            "chapter-3-image": storyData?.chapters?.[2].img_url,
            "chapter-3-paragraph-1": storyData?.chapters?.[2].story[0],
            "chapter-3-paragraph-2": storyData?.chapters?.[2].story[1],
            "chapter-3-paragraph-3": storyData?.chapters?.[2].story[2],
            "chapter-4-name": storyData?.chapters?.[3].name,
            "chapter-4-image": storyData?.chapters?.[3].img_url,
            "chapter-4-paragraph-1": storyData?.chapters?.[3].story[0],
            "chapter-4-paragraph-2": storyData?.chapters?.[3].story[1],
            "chapter-4-paragraph-3": storyData?.chapters?.[3].story[2],
            "chapter-5-name": storyData?.chapters?.[4].name,
            "chapter-5-image": storyData?.chapters?.[4].img_url,
            "chapter-5-paragraph-1": storyData?.chapters?.[4].story[0],
            "chapter-5-paragraph-2": storyData?.chapters?.[4].story[1],
            "chapter-5-paragraph-3": storyData?.chapters?.[4].story[2],
          }}
        >
          {storyData?.chapters?.map((chapter, chapter_i) => {
            return (
              <>
                <Form.Item
                  label={`Chapter ${chapter_i + 1}`}
                  name={`chapter-${chapter_i + 1}-name`}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={`Image link ${chapter_i + 1}`}
                  name={`chapter-${chapter_i + 1}-image`}
                >
                  <Input />
                </Form.Item>

                {chapter.story.map((segment, segment_i) => {
                  return (
                    <Form.Item
                      label={`Paragraph ${segment_i + 1}`}
                      name={`chapter-${chapter_i + 1}-paragraph-${
                        segment_i + 1
                      }`}
                    >
                      <TextArea rows={6} />
                    </Form.Item>
                  );
                })}
              </>
            );
          })}
          <div className="flex flex-row gap-2">
            <Button type="default" onClick={handleSubmit}>
              Update
            </Button>
            <Button
              type="default"
              onClick={() => {
                props.history.push("/stories/" + id + "/1/1/normal");
              }}
            >
              View Story!
            </Button>
          </div>
        </Form>
      </div>
    )
  );
};

export default TeacherStoryEditor;
