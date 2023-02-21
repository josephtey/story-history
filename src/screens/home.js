import { Card } from "antd";

const Home = (props) => {
  return (
    <div className="flex w-full justify-center content-center h-screen flex-wrap flex-col">
      <div className="text-7xl font-bold text-center">Relive the Past</div>
      <Card className="self-center mt-8 mb-24">
        We give you the <b>power</b> to create your own imaginative, educational
        stories.
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
