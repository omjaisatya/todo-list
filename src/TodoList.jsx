import "./App.css";
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoItem from "./TodoItem";

const TodoList = () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const [tasks, setTasks] = useState(storedTasks);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterByPriority, setFilterByPriority] = useState("all");
  const [filterByCompletion, setFilterByCompletion] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  const editTask = (
    index,
    newText,
    newDueDate,
    newPriority,
    newCategories,
    newReminder,
    newNotes,
    newAttachedFiles
  ) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = newText;
    updatedTasks[index].dueDate = newDueDate;
    updatedTasks[index].priority = newPriority;
    updatedTasks[index].categories = newCategories;
    updatedTasks[index].reminder = newReminder;
    updatedTasks[index].notes = newNotes;
    updatedTasks[index].attachedFiles = newAttachedFiles;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const addTask = (text) => {
    const newTask = {
      id: tasks.length + 1,
      text,
      dueDate: new Date().toISOString(),
      priority: "normal",
      completed: false,
      categories: [],
      reminder: "",
      notes: "",
      attachedFiles: [],
    };
    setTasks([...tasks, newTask]);
  };

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const filterByDate = (date) => {
    setSelectedDate(date);
  };

  const filterByPriorityHandler = (priority) => {
    setFilterByPriority(priority);
  };

  const filterByCompletionHandler = (completion) => {
    setFilterByCompletion(completion);
  };

  const searchHandler = (term) => {
    setSearchTerm(term);
  };

  const filteredTasks = tasks
    .filter((task) => !selectedDate || task.dueDate?.startsWith(selectedDate))
    .filter(
      (task) => filterByPriority === "all" || task.priority === filterByPriority
    )
    .filter(
      (task) =>
        filterByCompletion === "all" ||
        (filterByCompletion === "completed" && task.completed) ||
        (filterByCompletion === "uncompleted" && !task.completed)
    )
    .filter(
      (task) =>
        !searchTerm ||
        task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.categories.some((category) =>
          category.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        task.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          maxWidth: "auto",
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid black",
          // backgroundColor: "white",
          background:
            "radial-gradient(circle, rgba(229,215,211,1) 0%, rgba(202,224,208,1) 46%, rgba(249,233,233,1) 100%)",
        }}
      >
        <h1
          style={{ textAlign: "center", marginBottom: "20px", color: "black" }}
        >
          Todo / Task List
        </h1>
        <div style={{ marginBottom: "16px" }}>
          <button
            className="bi bi-list-task"
            onClick={() => addTask(prompt("Enter a new task:"))}
            style={{
              padding: "8px",
              fontSize: "14px",
              // marginRight: "8px",
              backgroundColor: "green",
              borderRadius: "10px",
              color: "white",
              border: "none",
              cursor: "pointer",
              margin: "10px",
            }}
          >
            Add New Task
          </button>
          <input
            className="bi bi-calendar-check"
            type="date"
            onChange={(e) => filterByDate(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "14px",
              // marginRight: "8px",
              backgroundColor: "green",
              borderRadius: "10px",
              color: "white",
              border: "none",
              cursor: "pointer",
              margin: "8px",
            }}
          />
          <select
            value={filterByPriority}
            onChange={(e) => filterByPriorityHandler(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "14px",
              // marginRight: "8px",
              backgroundColor: "green",
              borderRadius: "10px",
              color: "white",
              border: "none",
              cursor: "pointer",
              margin: "8px",
            }}
          >
            <option
              className="bi bi-stack"
              value="all"
              style={{ backgroundColor: "#3cc435" }}
            >
              All Priorities
            </option>
            <option value="low" style={{ backgroundColor: "#3cc435" }}>
              Low Priority
            </option>
            <option value="normal" style={{ backgroundColor: "#3cc435" }}>
              Normal Priority
            </option>
            <option value="high" style={{ backgroundColor: "#3cc435" }}>
              High Priority
            </option>
          </select>
          <select
            value={filterByCompletion}
            onChange={(e) => filterByCompletionHandler(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "14px",
              // marginRight: "8px",
              backgroundColor: "green",
              borderRadius: "10px",
              color: "white",
              border: "none",
              cursor: "pointer",
              margin: "8px",
            }}
          >
            <option value="all" style={{ backgroundColor: "#3cc435" }}>
              All Tasks
            </option>
            <option value="completed" style={{ backgroundColor: "#3cc435" }}>
              Completed Tasks
            </option>
            <option value="uncompleted" style={{ backgroundColor: "#3cc435" }}>
              Uncompleted Tasks
            </option>
          </select>
          <input
            type="text"
            placeholder="Search tasks"
            value={searchTerm}
            onChange={(e) => searchHandler(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "14px",
              // marginRight: "8px",
              borderRadius: "10px",
              color: "black",
              border: "1px solid green",
              cursor: "pointer",
              margin: "8px",
            }}
          />
        </div>
        <div>
          {filteredTasks.map((task, index) => (
            <TodoItem
              key={task.id}
              index={index}
              task={task}
              moveTask={moveTask}
              editTask={editTask}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
            />
          ))}
        </div>
        <Name />
      </div>
    </DndProvider>
  );
};

const Name = () => {
  return (
    <div style={{ display: "flex", justifyContent: "right" }}>
      <p>Copyright&#169;</p>
      <a
        href="https://github.com/omjaisatya"
        rel="noreferrer"
        target="_blank"
        style={{ textDecoration: "none", color: "green" }}
      >
        <p style={{ color: "green" }}>Satya Prakash</p>
      </a>
    </div>
  );
};

export default TodoList;
