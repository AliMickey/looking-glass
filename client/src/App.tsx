import { Switch, Route } from "wouter";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route>404 Page Not Found</Route>
    </Switch>
  );
}

export default App;
