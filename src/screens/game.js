import react, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection } from "firebase/firestore";
import db from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { Button } from "antd";
import Typewriter from "typewriter-effect/dist/core";
import Conversation from "../components/Conversation";

const GameScreen = (props) => {
  const [story, setStoryData] = useState();
  const [currentImg, setCurrentImg] = useState("");
  const { id, chapter, segment, type } = useParams();

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

      setCurrentImg(story.chapters[parseInt(chapter) - 1].img_url);
    }
  }, [story, chapter, segment, type]);

  return (
    story && (
      <>
        {type === "normal" ? (
          <div className="flex flex-col justify-between w-full overflow-hidden">
            <div className="pl-16 text-4xl font-bold bg-black h-36 flex content-center flex-wrap">
              {story.chapters[parseInt(chapter) - 1].name}
            </div>
            <img
              style={{
                width: "400px",
                alignSelf: "center",
              }}
              className="rounded-xl"
              src={currentImg}
            />
            <div className="p-16 absolute bottom-0 bg-black flex-col flex w-full h-48">
              <div id="content" className="w-full"></div>
              <Button
                className="self-end"
                onClick={() => {
                  if (
                    chapter === "5" &&
                    parseInt(segment) ===
                      story.chapters[parseInt(chapter) - 1].story.length
                  ) {
                    props.history.push("/stories");
                  } else {
                    if (type === "chat") {
                      props.history.push(
                        `/stories/${id}/${parseInt(chapter) + 1}/${1}/regular`
                      );
                    } else {
                      // at the end of a chapter!
                      if (
                        parseInt(segment) ===
                        story.chapters[parseInt(chapter) - 1].story.length
                      ) {
                        props.history.push(
                          `/stories/${id}/${chapter}/${segment}/chat`
                        );
                        // NOT at the end of a chapter!
                      } else {
                        props.history.push(
                          `/stories/${id}/${chapter}/${
                            parseInt(segment) + 1
                          }/normal`
                        );
                      }
                    }
                  }
                }}
              >
                Next
              </Button>
            </div>
          </div>
        ) : type === "chat" ? (
          <Conversation
            characterInfo={story.characters[parseInt(chapter) - 1]}
            storySoFar={story.chapters.slice(0, parseInt(chapter))}
            nextPage={() => {
              props.history.push(
                `/stories/${id}/${parseInt(chapter) + 1}/${1}/normal`
              );
            }}
          />
        ) : null}
      </>
    )
  );
};

export default GameScreen;
