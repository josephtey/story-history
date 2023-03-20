import "./App.css";
import Home from "./screens/home";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TeacherDashboard from "./screens/teacher";
import GameScreen from "./screens/game";
import { ConfigProvider, theme } from "antd";
import TeacherStoryEditor from "./screens/teacher-story-editor";
import Stories from "./screens/stories";

function App() {
  const { darkAlgorithm } = theme;
  
  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
      }}
    >
      <div className="text-white h-screen">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/stories/:id/:chapter/:segment/:type"
              component={GameScreen}
            />
            <Route exact path="/stories" component={Stories} />
            <Route exact path="/teacher" component={TeacherDashboard} />
            <Route path="/teacher/:id" component={TeacherStoryEditor} />
          </Switch>
        </Router>
      </div>
    </ConfigProvider>
  );
}

export default App;
