import React from "react";
import { ReactNotifications } from "react-notifications-component";
import TodoContainer from "./components/container/TodoContainer";

// Create the App component
function App() {
  return (
    <div className="App">
      {/* Use ReactNotifications to render notifications */}
      <ReactNotifications />
      {/* Render the TodoContainer component */}
      <TodoContainer />
    </div>
  );
}

export default App;
