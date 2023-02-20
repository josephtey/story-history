import react, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { collection } from "firebase/firestore";
import db from "../firebase";
import { getDoc, doc } from "firebase/firestore";

const GameScreen = (props) => {
  const [story, setStoryData] = useState();
  const { id, chapter, segment } = useParams();

  useEffect(() => {
    const fetchStory = async () => {
      const docRef = doc(db, "stories", id);
      const docSnap = await getDoc(docRef);
      setStoryData(docSnap.data());
    };

    fetchStory();
  }, []);

  return (
    story && (
      <div className="flex flex-col justify-between overflow-hidden">
        <div className="p-16 text-4xl font-bold bg-black">
          Chapter {chapter}
        </div>
        <img
          className="object-fill"
          src="https://r2.stablediffusionweb.com/images/stable-diffusion-demo-2.webp"
        />
        <div className="p-16 absolute bottom-0 bg-black">
          {story.chapters[parseInt(chapter) - 1].story[parseInt(segment) - 1]}
        </div>
      </div>
    )
  );
};

export default GameScreen;
