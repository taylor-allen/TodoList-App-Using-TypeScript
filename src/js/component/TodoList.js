var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X, PlusCircleFill } from "react-bootstrap-icons";
function TodoList() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingValue, setEditingValue] = useState("");
    const userName = "taylor-allen";
    const apiUserURL = `https://playground.4geeks.com/todo/users/${userName}`;
    const apiTodosURL = `https://playground.4geeks.com/todo/todos/${userName}`;
    const apiRequest = (url, method, body) => {
        return fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: method !== "GET" && body ? JSON.stringify(body) : undefined, // Ensure body is only sent for non-GET requests
        });
    };
    // const [todos, setTodos] = useState([]);
    // const [inputValue, setInputValue] = useState("");
    // const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages
    // const userName = "taylor-allen";
    // const apiUserURL = `https://playground.4geeks.com/todo/users/${userName}`;
    // const apiTodosURL = `https://playground.4geeks.com/todo/todos/${userName}`;
    const createUser = () => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(apiUserURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            console.log("User created successfully!");
        }
        else {
            setErrorMessage("Failed to create user");
            window.location.reload();
        }
    });
    const fetchTodos = () => __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(apiUserURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 404) {
            yield createUser(); // Create user if not found
            return; // Exit function early
        }
        const data = yield response.json(); // Parse the JSON
        console.log("API response:", data); // Log the API response
        if (data && Array.isArray(data.todos)) {
            setTodos(data.todos); // Access the `todos` array within the object
        }
        else {
            setErrorMessage("Expected an array, received: " + JSON.stringify(data.todos));
            setTodos([]);
        }
    });
    useEffect(() => {
        fetchTodos(); // Fetch todos when the component mounts
    }, []);
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (inputValue.trim() !== "") {
            const newTask = { label: inputValue, done: false };
            // Update local state first
            setTodos([...todos, newTask]);
            setInputValue("");
            // Send the new task to the server
            const response = yield fetch(apiTodosURL, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                setErrorMessage("Failed to add new task");
                return; // Exit function early
            }
            const data = yield response.json(); // Parse the JSON response
            console.log("Task added successfully:", data);
            // Update the local state to include the ID from the response
            setTodos((prevTodos) => prevTodos.map((todo, index) => index === prevTodos.length - 1 ? Object.assign(Object.assign({}, todo), { id: data.id }) : todo));
        }
    });
    const handleDelete = (id) => __awaiter(this, void 0, void 0, function* () {
        if (!id)
            return;
        console.log("Attempting to delete todo with ID:", id);
        // Update todos locally first (optimistic update)
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        // Delete the task from the server
        const response = yield fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            console.log("Task deleted successfully");
        }
        else {
            setErrorMessage("Failed to delete task: " + response.statusText);
            // If delete fails, revert the local state
            setTodos((prevTodos) => [
                ...prevTodos,
                todos.find((todo) => todo.id === id),
            ]);
        }
    });
    const handleClearAll = () => __awaiter(this, void 0, void 0, function* () {
        const deletePromises = todos.map((todo) => fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }));
        // Wait for all delete requests to finish
        const responses = yield Promise.all(deletePromises);
        const successfulDeletes = responses.filter((response) => response.status === 204);
        if (successfulDeletes.length === todos.length) {
            console.log("All tasks cleared successfully");
            setTodos([]); // Clear local state if successful
        }
        else {
            setErrorMessage("Failed to clear some tasks");
        }
    });
    return (_jsx("div", { className: "container w-25", children: _jsxs("div", { className: "card d-flex flex-column", style: { minHeight: "400px", minWidth: "350px" }, children: [_jsx("h1", { className: "card-header text-center ", children: "Taylor's To-Do List" }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "input-group m-0 p-0", children: [_jsx("input", { type: "text", placeholder: "What's on your mind?", value: inputValue, onChange: handleChange, className: "inputForm form-control border border-1 rounded-pill p-2 m-4", required: true }), _jsx("div", { className: "input-group-append", children: _jsx("button", { type: "submit", className: "btn my-4 me-2", children: _jsx(PlusCircleFill, { size: 20 }) }) })] }) }), _jsxs("div", { className: "cardBody flex-grow-1 px-5", children: [errorMessage && _jsx("p", { className: "text-danger", children: errorMessage }), todos.length === 0 ? (_jsx("p", { children: "No tasks yet." })) : (_jsx("ul", { children: todos.map((todo, index) => (_jsxs("li", { className: "d-flex justify-content-between align-items-center", children: [todo.label, _jsx("button", { onClick: () => handleDelete(todo.id), className: "btn", children: _jsx(X, { size: 20 }) })] }, todo.id || index))) }))] }), _jsxs("div", { className: "footer  d-flex justify-content-between p-3", children: [_jsxs("p", { className: "d-flex justify-content-start", children: [todos.length, " Task(s) Left"] }), _jsx("button", { onClick: handleClearAll, className: "btn btn-outline-light d-flex justify-content-end p-1", children: "Clear All" })] })] }) }));
}
export default TodoList;
