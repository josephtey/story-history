import "./App.css";
import Home from "./screens/home";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TeacherDashboard from "./screens/teacher";
import GameScreen from "./screens/game";
import { ConfigProvider, theme } from "antd";

function App() {
  const { darkAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
      }}
    >
      <div className="bg-black text-white h-screen">
        <Router>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/teacher">
              <TeacherDashboard />
            </Route>
            <Route path="/game">
              <GameScreen />
            </Route>
          </Switch>
        </Router>
      </div>
    </ConfigProvider>
  );
}

export default App;
