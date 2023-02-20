import react, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection } from "firebase/firestore";
import db from "../firebase";
import { getDoc, doc } from "firebase/firestore";

const GameScreen = () => {
  const [story, setStoryData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchStory = async () => {
      const docRef = doc(db, "stories", id);
      const docSnap = await getDoc(docRef);
      setStoryData(docSnap.data());
    };

    fetchStory();
  }, []);

  return <>{JSON.stringify(story)}</>;
};

export default GameScreen;
