import { Switch, Route } from "wouter";
import Dashboard from "@/pages/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route>404 Page Not Found</Route>
        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;
