import React, { useState } from "react";
import { useDrag } from "react-dnd";
import "./App.css";

const TodoItem = ({
  index,
  task,
  moveTask,
  editTask,
  deleteTask,
  toggleComplete,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TODO_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [isEditing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState(task.priority || "normal");
  const [categories, setCategories] = useState(task.categories || []);
  const [reminder, setReminder] = useState(task.reminder || "");
  const [notes, setNotes] = useState(task.notes || "");
  const [attachedFiles, setAttachedFiles] = useState(task.attachedFiles || []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    editTask(
      index,
      editedText,
      dueDate,
      priority,
      categories,
      reminder,
      notes,
      attachedFiles
    );
    setEditing(false);
  };

  const handleDelete = () => {
    deleteTask(index);
  };

  const handleToggleComplete = () => {
    toggleComplete(index);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const updatedAttachedFiles = [...attachedFiles];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileObject = {
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
      };
      updatedAttachedFiles.push(fileObject);
    }

    setAttachedFiles(updatedAttachedFiles);
  };

  const removeAttachedFile = (fileIndex) => {
    const updatedAttachedFiles = attachedFiles.filter(
      (file, index) => index !== fileIndex
    );
    setAttachedFiles(updatedAttachedFiles);
  };

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "8px",
        backgroundColor: isDragging ? "#f5f5f5" : "white",
        transition: "background-color 0.3s, opacity 0.3s",
        position: "relative",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ flex: 1, marginBottom: "8px" }}>
        {!isEditing ? (
          <div>
            <div
              style={{
                fontSize: "16px",
                marginBottom: "4px",
                fontWeight: "700",
              }}
            >
              {editedText}
            </div>
            {dueDate && (
              <div style={{ fontSize: "12px", color: "#555" }}>
                Due: {new Date(dueDate).toLocaleString()}
              </div>
            )}
            <div style={{ fontSize: "12px", color: "#555" }}>
              Priority:{" "}
              <strong style={{ fontWeight: "bold", color: "purple" }}>
                {priority}
              </strong>
            </div>
            {categories.length > 0 && (
              <div style={{ fontSize: "12px", color: "#555" }}>
                Categories: {categories.join(", ")}
              </div>
            )}
            {reminder && (
              <div style={{ fontSize: "12px", color: "#555" }}>
                Reminder: {new Date(reminder).toLocaleString()}
              </div>
            )}
            {notes && (
              <div style={{ fontSize: "12px", color: "#555" }}>
                Notes: {notes}
              </div>
            )}
            {attachedFiles.length > 0 && (
              <div>
                <p style={{ fontSize: "12px", color: "#555" }}>
                  Attached Files:
                </p>
                <ul>
                  {attachedFiles.map((file, fileIndex) => (
                    <li
                      key={fileIndex}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <img
                        src={file.preview}
                        alt={file.name}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "8px",
                        }}
                      />
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      <button
                        className="bi bi-eraser-fill"
                        onClick={() => removeAttachedFile(fileIndex)}
                        style={{
                          marginLeft: "8px",
                          padding: "7px",
                          backgroundColor: "red",
                          borderRadius: "10px",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginBottom: "8px",
              }}
            />
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginBottom: "8px",
              }}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginBottom: "8px",
              }}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <input
              type="text"
              placeholder="Categories (comma-separated)"
              value={categories.join(", ")}
              onChange={(e) =>
                setCategories(
                  e.target.value.split(",").map((category) => category.trim())
                )
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginBottom: "8px",
              }}
            />
            <input
              type="datetime-local"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginBottom: "8px",
              }}
            />
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginBottom: "8px",
              }}
            />
            <input
              type="file"
              onChange={handleFileChange}
              style={{ marginBottom: "8px" }}
              multiple
            />
            {attachedFiles.length > 0 && (
              <div>
                <p style={{ fontSize: "12px", color: "#555" }}>
                  Attached Files:
                </p>
                <ul>
                  {attachedFiles.map((file, fileIndex) => (
                    <li
                      key={fileIndex}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <img
                        src={file.preview}
                        alt={file.name}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "8px",
                        }}
                      />
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      <button
                        className="bi bi-eraser-fill"
                        onClick={() => removeAttachedFile(fileIndex)}
                        style={{
                          marginLeft: "8px",
                          padding: "7px",
                          backgroundColor: "red",
                          borderRadius: "10px",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ display: "flex" }}>
        {!isEditing ? (
          <div style={{ display: "flex" }}>
            <button
              className="bi bi-pencil-square"
              onClick={handleEdit}
              style={{
                marginRight: "8px",
                padding: "7px",
                backgroundColor: "#3cc435",
                borderRadius: "10px",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              // className={
              //   task.completed
              //     ? "bi bi-arrow-counterclockwise"
              //     : "bi bi-check2-all"
              // }
              onClick={handleToggleComplete}
              style={{
                marginRight: "8px",
                padding: "7px",
                backgroundColor: task.completed ? "#ff0000" : "#3cc435",
                borderRadius: "10px",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {task.completed ? "Undo Complete" : "Complete"}
            </button>
            <button
              className="bi bi-trash"
              onClick={handleDelete}
              style={{
                padding: "7px",
                backgroundColor: "#3cc435",
                borderRadius: "10px",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div style={{ display: "flex" }}>
            <button
              className="bi bi-floppy"
              onClick={handleSave}
              style={{
                marginRight: "8px",
                padding: "7px",
                backgroundColor: "#3cc435",
                borderRadius: "10px",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              className="bi bi-x-circle"
              onClick={() => setEditing(false)}
              style={{
                padding: "7px",
                backgroundColor: "#3cc435",
                borderRadius: "10px",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
