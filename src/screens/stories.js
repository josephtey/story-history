import react, { useEffect, useState } from "react";
import db from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Card } from "antd";

const Stories = () => {
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
      <h1 className="text-3xl font-bold">Stories</h1> <br />
      {stories.map((story) => {
        return (
          <Card
            hoverable
            onClick={() => {
              window.location.href = "/stories/" + story.id;
            }}
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
        );
      })}
    </div>
  );
};

export default Stories;
