import react, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection } from "firebase/firestore";
import db from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { Button } from "antd";
import Typewriter from "typewriter-effect/dist/core";

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

  useEffect(() => {
    if (story) {
      const content =
        story.chapters[parseInt(chapter) - 1].story[parseInt(segment) - 1];
      const typewriter = new Typewriter(document.getElementById("content"), {
        autoStart: true,
        delay: 20,
      });

      typewriter.pauseFor(50).typeString(content).start();
    }
  }, [story, chapter, segment]);

  return (
    story && (
      <div className="flex flex-col justify-between overflow-hidden">
        <div className="pl-16 text-4xl font-bold bg-black h-36 flex content-center flex-wrap">
          Chapter {chapter}
        </div>
        <img
          className="object-cover"
          style={{
            maxHeight: "600px",
          }}
          src="https://r2.stablediffusionweb.com/images/stable-diffusion-demo-2.webp"
        />
        <div className="p-16 absolute bottom-0 bg-black flex-col flex w-full h-48">
          <div id="content" className="w-full"></div>
          <Button
            className="self-end"
            onClick={() => {
              if (segment === "3") {
                props.history.push(
                  `/stories/${id}/${parseInt(chapter) + 1}/${1}`
                );
              } else {
                props.history.push(
                  `/stories/${id}/${chapter}/${parseInt(segment) + 1}`
                );
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>
    )
  );
};

export default GameScreen;
