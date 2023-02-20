import react, { useEffect, useState } from "react";
import db from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Card, Button } from "antd";

const Stories = (props) => {
  const [stories, setStories] = useState([]);

  const fetchData = async () => {
    const storiesRef = collection(db, "stories");
    const q = query(storiesRef);

    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setStories(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-24">
      <Button
        type="dashed"
        onClick={() => {
          props.history.push("/");
        }}
        className="mb-8"
      >
        Back
      </Button>
      <h1 className="text-3xl font-bold mb-8">Stories</h1>
      <div className="flex gap-4 flex-wrap">
        {stories.map((story) => {
          return (
            <Link to={"/stories/" + story.id + "/1/1"}>
              <Card
                hoverable
                size="medium"
                title={story.metaData.event}
                style={{ width: 300 }}
              >
                <div>
                  <b>Story: </b>
                  {story.metaData.setting}
                </div>
                <div>
                  <b>Learning: </b>
                  {story.metaData.learning}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Stories;
