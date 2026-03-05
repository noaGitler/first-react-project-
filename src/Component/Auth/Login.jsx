import React from "react";
import { useState } from "react";
import "./Login.css";


// --- ניהול טופס התחברות
function Login({ onLogin }) {
    // מצבים פנימיים עבור שם משתמש, סיסמה והודעות
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // --- טיפול בלחיצה על כפתור התחברות
    const handleLoginClick = () => {
        if (username.trim() === "" || password.trim() === "") {
            setMessage("Please enter username and password");
            setMessageType("error");
            return;
        }
        const result = onLogin(username, password);
        setMessage(result.message);
        setMessageType(result.success ? "success" : "error");
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input type="text" placeholder="user name" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="login-btn" onClick={handleLoginClick}>Connect</button>
            {message && (
                <p className={messageType === "error" ? "error-msg" : "success-msg"}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default Login;