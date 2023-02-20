import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useParams } from "react-router";
import db from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const { TextArea } = Input;

const TeacherStoryEditor = () => {
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
    await setDoc(doc(db, "stories", id), {
      metaData: storyData.metaData,
      chapters: [
        {
          name: values["chapter-1-name"],
          story: [
            values["chapter-1-paragraph-1"],
            values["chapter-1-paragraph-2"],
            values["chapter-1-paragraph-3"],
          ],
        },
        {
          name: values["chapter-2-name"],
          story: [
            values["chapter-2-paragraph-1"],
            values["chapter-2-paragraph-2"],
            values["chapter-2-paragraph-3"],
          ],
        },
        {
          name: values["chapter-3-name"],
          story: [
            values["chapter-3-paragraph-1"],
            values["chapter-3-paragraph-2"],
            values["chapter-3-paragraph-3"],
          ],
        },
        {
          name: values["chapter-4-name"],
          story: [
            values["chapter-4-paragraph-1"],
            values["chapter-4-paragraph-2"],
            values["chapter-4-paragraph-3"],
          ],
        },
        {
          name: values["chapter-5-name"],
          story: [
            values["chapter-5-paragraph-1"],
            values["chapter-5-paragraph-2"],
            values["chapter-5-paragraph-3"],
          ],
        },
      ],
    });
  };

  return storyData ? (
    <div
      style={{
        margin: "10px auto",
        width: "500px",
        color: "white !important",
      }}
      className="py-24"
    >
      <h1 className="font-bold text-3xl mb-4">Edit the AI-Generated Story</h1>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={{
          "chapter-1-name": storyData?.chapters?.[0].name,
          "chapter-1-paragraph-1": storyData?.chapters?.[0].story[0],
          "chapter-1-paragraph-2": storyData?.chapters?.[0].story[1],
          "chapter-1-paragraph-3": storyData?.chapters?.[0].story[2],
          "chapter-2-name": storyData?.chapters?.[1].name,
          "chapter-2-paragraph-1": storyData?.chapters?.[1].story[0],
          "chapter-2-paragraph-2": storyData?.chapters?.[1].story[1],
          "chapter-2-paragraph-3": storyData?.chapters?.[1].story[2],
          "chapter-3-name": storyData?.chapters?.[2].name,
          "chapter-3-paragraph-1": storyData?.chapters?.[2].story[0],
          "chapter-3-paragraph-2": storyData?.chapters?.[2].story[1],
          "chapter-3-paragraph-3": storyData?.chapters?.[2].story[2],
        }}
      >
        <Form.Item label="Chapter 1 Name" name="chapter-1-name">
          <Input />
        </Form.Item>

        <Form.Item label="Paragraph 1" name="chapter-1-paragraph-1">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 2" name="chapter-1-paragraph-2">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 3" name="chapter-1-paragraph-3">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Chapter 2 Name" name="chapter-2-name">
          <Input />
        </Form.Item>

        <Form.Item label="Paragraph 1" name="chapter-2-paragraph-1">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 2" name="chapter-2-paragraph-2">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 3" name="chapter-2-paragraph-3">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Chapter 3 Name" name="chapter-3-name">
          <Input />
        </Form.Item>

        <Form.Item label="Paragraph 1" name="chapter-3-paragraph-1">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 2" name="chapter-3-paragraph-2">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 3" name="chapter-3-paragraph-3">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Chapter 4 Name" name="chapter-4-name">
          <Input />
        </Form.Item>

        <Form.Item label="Paragraph 1" name="chapter-4-paragraph-1">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 2" name="chapter-4-paragraph-2">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 3" name="chapter-4-paragraph-3">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Chapter 5 Name" name="chapter-5-name">
          <Input />
        </Form.Item>

        <Form.Item label="Paragraph 1" name="chapter-5-paragraph-1">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 2" name="chapter-5-paragraph-2">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Paragraph 3" name="chapter-5-paragraph-3">
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item>
          <Button type="default" htmlType="submit" onClick={handleSubmit}>
            Confirm!
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : null;
};

export default TeacherStoryEditor;
