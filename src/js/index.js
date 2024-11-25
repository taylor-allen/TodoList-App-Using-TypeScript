// Import React and ReactDOM
import React from "react";
import ReactDOM from "react-dom/client";

// Include your styles into the Webpack bundle
import "../styles/index.css";

// Import your TodoList component (ensure this path is correct)
import TodoList from "./component/TodoList"; 

// Render your React application
ReactDOM.createRoot(document.getElementById("app")).render(<TodoList />);
