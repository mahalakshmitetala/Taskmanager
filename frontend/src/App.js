import { useState } from "react";
import { registerUser, loginUser, getTasks, createTask, updateTask, deleteTask } from "./api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const role = localStorage.getItem("role");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(""), 3000); };

  const handleRegister = async () => {
    if (!name || !email || !password) return showMsg("All fields are required");
    const res = await registerUser(name, email, password);
    if (res.message) showMsg(res.message + " - Now login!");
    else {
      const detail = Array.isArray(res.detail)
        ? res.detail.map(e => e.msg).join(", ")
        : (res.detail || "Error");
      showMsg(detail);
    }
  };

  const handleLogin = async () => {
  const res = await loginUser(email, password);
  if (res.access_token) {
    localStorage.setItem("token", res.access_token);

    localStorage.setItem("role", res.role);

    setToken(res.access_token);
    showMsg("Logged in successfully!");
    loadTasks(res.access_token);
  } else showMsg(res.detail || "Login failed");
};

  const loadTasks = async (t) => {
    const res = await getTasks(t || token);
    if (Array.isArray(res)) setTasks(res);
  };

  const handleCreate = async () => {
    if (!taskTitle) return showMsg("Title is required");
    const res = await createTask(token, taskTitle, taskDesc);
    if (res.id) { showMsg("Task created!"); setTaskTitle(""); setTaskDesc(""); loadTasks(); }
    else showMsg(res.detail || "Error creating task");
  };

  const handleDelete = async (id) => {
    await deleteTask(token, id);
    showMsg("Task deleted!");
    loadTasks();
  };

  const handleUpdate = async (id) => {
    await updateTask(token, id, { title: editTitle, description: editDesc });
    showMsg("Task updated!");
    setEditingId(null);
    loadTasks();
  };

  const handleComplete = async (id) => {
    await updateTask(token, id, { status: "completed" });
    showMsg("Task marked as complete!");
    loadTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

     setToken("");
     setTasks([]);
     setName("");
     setEmail("");
     setPassword("");
  };
  const styles = {
    container: { maxWidth: 600, margin: "40px auto", padding: 20 },
    card: { background: "white", borderRadius: 10, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
    input: { width: "100%", padding: "10px", marginBottom: 10, border: "1px solid #ddd", borderRadius: 6, fontSize: 14 },
    btn: { padding: "10px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 },
    msg: { background: message.includes("successfully") || message.includes("created") || message.includes("updated") || message.includes("deleted") || message.includes("complete") || message.includes("login") ? "#d4edda" : "#f8d7da", padding: 10, borderRadius: 6, marginBottom: 16, textAlign: "center" },
    taskCard: { background: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: 8, padding: 16, marginBottom: 12 },
    link: { background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline", marginTop: 10, display: "block" },
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center", marginBottom: 24, color: "#333" }}>Task Manager</h1>
      {role === "admin" && (
        <p style={{ color: "green", textAlign: "center" }}>
          Admin Access Enabled
      </p>
      )}

      {message && <div style={styles.msg}>{message}</div>}

      {!token ? (
        <div style={styles.card}>
          <h2 style={{ marginBottom: 16 }}>{isRegistering ? "Register" : "Login"}</h2>

          {isRegistering && (
            <input style={styles.input} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          )}
          <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

          {isRegistering ? (
            <>
              <button style={{ ...styles.btn, background: "#28a745", color: "white" }} onClick={handleRegister}>Register</button>
              <button style={styles.link} onClick={() => setIsRegistering(false)}>Already have an account? Login</button>
            </>
          ) : (
            <>
              <button style={{ ...styles.btn, background: "#007bff", color: "white" }} onClick={handleLogin}>Login</button>
              <button style={styles.link} onClick={() => setIsRegistering(true)}>Don't have an account? Register</button>
            </>
          )}
        </div>
      ) : (
        <>
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2>Add New Task</h2>
              <button style={{ ...styles.btn, background: "#dc3545", color: "white" }} onClick={handleLogout}>Logout</button>
            </div>
            <input style={styles.input} placeholder="Task Title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
            <input style={styles.input} placeholder="Description" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
            <button style={{ ...styles.btn, background: "#007bff", color: "white" }} onClick={handleCreate}>Create Task</button>
            <button style={{ ...styles.btn, background: "#6c757d", color: "white" }} onClick={() => loadTasks()}>Refresh</button>
          </div>

          <div style={styles.card}>
            <h2 style={{ marginBottom: 16 }}>
              {role === "admin" ? "All Tasks" : "My Tasks"} ({tasks.length})
            </h2>
            {tasks.length === 0 && <p style={{ color: "#888" }}>No tasks yet. Create one above!</p>}
            {tasks.map(task => (
              <div key={task.id} style={styles.taskCard}>
                {editingId === task.id ? (
                  <>
                    <input style={styles.input} value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <input style={styles.input} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                    <button style={{ ...styles.btn, background: "#28a745", color: "white" }} onClick={() => handleUpdate(task.id)}>Save</button>
                    <button style={{ ...styles.btn, background: "#6c757d", color: "white" }} onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h3 style={{ marginBottom: 4 }}>{task.title}</h3>
                    <p style={{ color: "#666", marginBottom: 8 }}>{task.description}</p>

                    {role === "admin" && (
                      <p style={{ fontSize: 12, color: "#999" }}>
                        Created by: {task.user_email}
                      </p>
                    )}
                    
                    <span style={{ background: task.status === "completed" ? "#d4edda" : "#fff3cd", padding: "2px 8px", borderRadius: 12, fontSize: 12, marginRight: 8 }}>
                      {task.status === "completed" ? "Done" : "Pending"}
                    </span>
                    <button style={{ ...styles.btn, background: "#ffc107", color: "black", marginTop: 8 }} onClick={() => { setEditingId(task.id); setEditTitle(task.title); setEditDesc(task.description); }}>Edit</button>
                    <button style={{ ...styles.btn, background: "#dc3545", color: "white", marginTop: 8 }} onClick={() => handleDelete(task.id)}>Delete</button>
                    {task.status !== "completed" && (
                      <button style={{ ...styles.btn, background: "#28a745", color: "white", marginTop: 8 }} onClick={() => handleComplete(task.id)}>Mark Complete</button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}