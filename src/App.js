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
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/stories">
              <Stories />
            </Route>
            <Route exact path="/teacher">
              <TeacherDashboard />
            </Route>
            <Route path="/teacher/:id">
              <TeacherStoryEditor />
            </Route>
            <Route path="/game/:id">
              <GameScreen />
            </Route>
          </Switch>
        </Router>
      </div>
    </ConfigProvider>
  );
}

export default App;
