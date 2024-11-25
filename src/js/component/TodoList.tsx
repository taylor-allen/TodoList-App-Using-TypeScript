import React, { useEffect, useState } from "react";
import { X, PlusCircleFill } from "react-bootstrap-icons";

interface Todo {
  id?: number;
  label: string;
  done: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const userName = "taylor-allen";
  const apiUserURL = `https://playground.4geeks.com/todo/users/${userName}`;
  const apiTodosURL = `https://playground.4geeks.com/todo/todos/${userName}`;

  const apiRequest = (
    url: string,
    method: string,
    body?: object
  ): Promise<Response> => {
    return fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method !== "GET" && body ? JSON.stringify(body) : undefined,
    });
  };

  const createUser = async () => {
    const response = await fetch(apiUserURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("User created successfully!");
    } else {
      setErrorMessage("Failed to create user");
      window.location.reload();
    }
  };

  const fetchTodos = async () => {
    const response = await fetch(apiUserURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      await createUser();
      return;
    }

    const data = await response.json();
    console.log("API response:", data);
    if (data && Array.isArray(data.todos)) {
      setTodos(data.todos);
    } else {
      setErrorMessage(
        "Expected an array, received: " + JSON.stringify(data.todos)
      );
      setTodos([]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (inputValue.trim() !== "") {
      const newTask = { label: inputValue, done: false };

      setTodos([...todos, newTask]);
      setInputValue("");

      const response = await fetch(apiTodosURL, {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setErrorMessage("Failed to add new task");
        return;
      }

      const data = await response.json();
      console.log("Task added successfully:", data);

      setTodos((prevTodos) =>
        prevTodos.map((todo, index) =>
          index === prevTodos.length - 1 ? { ...todo, id: data.id } : todo
        )
      );
    }
  };

  const handleDelete = async (id?: number): Promise<void> => {
    if (!id) return;
    console.log("Attempting to delete todo with ID:", id);

    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      console.log("Task deleted successfully");
    } else {
      setErrorMessage("Failed to delete task: " + response.statusText);
      setTodos((prevTodos) => [
        ...prevTodos,
        todos.find((todo) => todo.id === id)!,
      ]);
    }
  };

  const handleClearAll = async () => {
    const deletePromises = todos.map((todo) =>
      fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const responses = await Promise.all(deletePromises);
    const successfulDeletes = responses.filter(
      (response) => response.status === 204
    );

    if (successfulDeletes.length === todos.length) {
      console.log("All tasks cleared successfully");
      setTodos([]);
    } else {
      setErrorMessage("Failed to clear some tasks");
    }
  };

  return (
    <div className="container w-25">
      <div
        className="card d-flex flex-column"
        style={{ minHeight: "400px", minWidth: "350px" }}
      >
        <h1 className="card-header text-center ">Taylor's To-Do List</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group m-0 p-0">
            <input
              type="text"
              placeholder="What's on your mind?"
              value={inputValue}
              onChange={handleChange}
              className="inputForm form-control border border-1 rounded-pill p-2 m-4"
              required
            />
            <div className="input-group-append">
              <button type="submit" className="btn my-4 me-2">
                <PlusCircleFill size={20} />
              </button>
            </div>
          </div>
        </form>
        <div className="cardBody flex-grow-1 px-5">
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          {todos.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            <ul>
              {todos.map((todo, index) => (
                <li
                  key={todo.id || index} // Use todo.id as the key if it exists, otherwise fallback to index
                  className="d-flex justify-content-between align-items-center"
                >
                  {todo.label}
                  <button onClick={() => handleDelete(todo.id)} className="btn">
                    <X size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="footer  d-flex justify-content-between p-3">
          <p className="d-flex justify-content-start">
            {todos.length} Task(s) Left
          </p>
          <button
            onClick={handleClearAll}
            className="btn btn-outline-light d-flex justify-content-end p-1"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
