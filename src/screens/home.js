import { Card } from "antd";

const Home = (props) => {
  return (
    <div className="flex w-full justify-center content-center h-screen flex-wrap flex-col">
      <div className="text-5xl font-bold text-center">
        Create Immersive Educational Stories
      </div>
      <Card className="self-center mt-12 mb-24 text-center">
        We give you the <b>power</b> to create your own imaginative, educational
        stories. <br />
        <br />
        Jump into immersive, generated worlds and interact with historical
        characters.
        <br />
      </Card>
      <div
        className="rounded-lg text-white bg-blue-500 hover:bg-blue-600 cursor-pointer px-8 py-4 font-bold w-48 text-center self-center mb-4"
        onClick={() => {
          props.history.push("/teacher");
        }}
      >
        Get Started!
      </div>
      {/* <div
        className="rounded-lg text-white bg-gray-500 hover:bg-gray-600 cursor-pointer px-8 py-4 font-bold w-48 text-center self-center"
        onClick={() => {
          props.history.push("/teacher");
        }}
      >
        I'm a Teacher
      </div> */}
    </div>
  );
};

export default Home;
