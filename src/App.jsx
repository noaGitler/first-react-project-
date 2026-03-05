import { useState } from 'react'
import DisplayText from "./Component/Display/DisplayText";
import EditingText from "./Component/Editing/EditingText";
import FileButtons from "./Component/FileButtons"
import Login from "./Component/Auth/Login";
import "./APP.css"


//  התחברות משתמש  
function App() {

    // --- ניהול מצבים כלליים
    const [texts, setTexts] = useState([]); // כל המסמכים הפתוחים כרגע
    const [activeTextId, setActiveTextId] = useState(null); // מזהה המסמך הפעיל
    const [language, setLanguage] = useState("english"); // שפת המקלדת
    const [loggedUser, setLoggedUser] = useState(null); // שם המשתמש המחובר כרגע

    // --- התחברות משתמש
    const handleLogin = (username, password) => {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const cleanPassword = password.trim();

        const existingUser = users.find(u => u.username === username.trim() && u.password === cleanPassword);
        if (existingUser) {
            setLoggedUser(existingUser);
            return { success: true, message: "" };
        }

        const passwordExists = users.some(u => u.password === cleanPassword);
        if (passwordExists) {
            return { success: false, message: "This password already exists, choose a different password" };
        }
        const user = {
            id: Date.now(),
            username: username.trim(),
            password: cleanPassword,
            files: {}
        };
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));

        setLoggedUser(user);
        return { success: true, message: ""};
    };

    // אם המשתמש לא מחובר – מציגים את עמוד ההתחברות
    if (!loggedUser) {
        return <Login onLogin={handleLogin} />;
    }

    //יצירת טקסט חדש     
    const createNewText = () => {
        const newId = Date.now();
        const newText = {
            id: newId,
            chunks: [],
            style: { color: "black", fontSize: 16, fontFamily: "Arial" },
            history: [],
            historyIndex: 0,
            fileName: "",
            fromHereOn: false
        };
        setTexts((prev) => [...prev, newText]);
        setActiveTextId(newId);
    };

    // פתיחת קובץ קיים של המשתמש
    const onOpen = (fileName) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.id === loggedUser.id);
        if (!user || !user.files || !user.files[fileName]) {
            alert("File not found");
            return;
        }

        const data = user.files[fileName];
        const alreadyOpen = texts.some(t => t.fileName === fileName);
        if (alreadyOpen) {
            alert(`File "${fileName}" is already open!`);
            return;
        }

        const newId = Date.now();
        const newText = {
            id: newId,
            chunks: data.chunks || [],
            style: data.style || { color: "black", fontSize: 16, fontFamily: "Arial" },
            history: [{ chunks: data.chunks, style: data.style }],
            historyIndex: 0,
            fileName,
            fromHereOn: false
        };
        setTexts(prev => [...prev, newText]);
        setActiveTextId(newId);
        alert(`File "${fileName}" opened successfully!`);
    };

    // סגירת קובץ פתוח ושמירתו    
    const closeText = (textId) => {
        if (activeTextId === textId) saveActiveFile();
        setTexts((prev) => {
            const remaining = prev.filter((t) => t.id !== textId);
            setActiveTextId(remaining.length > 0 ? remaining[0].id : null);
            return remaining;
        });
    };

    //  עדכון טקסט פעיל 
    const updateActiveText = (updates) => {
        if (!activeTextId) return;
        setTexts((prev) =>
            prev.map((t) => (t.id === activeTextId ? { ...t, ...updates } : t))
        );
    };

    //  הוספת תו חדש   
    const handleTextChange = (newChar) => {
        if (!activeTextId) return;
        setTexts((prev) =>
            prev.map((t) => {
                if (t.id !== activeTextId) return t;
                const chunks = Array.isArray(t.chunks) ? [...t.chunks] : [];
                let newFromHereOn = t.fromHereOn;
                if (chunks.length === 0 || t.fromHereOn) {
                    chunks.push({ text: newChar, style: t.style });
                    newFromHereOn = false;
                } else {
                    const lastChunk = { ...chunks[chunks.length - 1] };
                    lastChunk.text += newChar;
                    chunks[chunks.length - 1] = lastChunk;
                }
                const history = [
                    ...t.history.slice(0, t.historyIndex + 1),
                    { chunks: [...chunks], style: t.style },
                ];
                return { ...t, chunks, history, historyIndex: history.length - 1, fromHereOn: newFromHereOn };
            })
        );
    };

    //  שמירת מצב קודם בהיסטוריה  
    const savePrevStateToHistory = () => {
        if (!activeTextId) return;
        setTexts((prev) =>
            prev.map((t) => {
                if (t.id !== activeTextId) return t;
                const prevState = { chunks: t.chunks.map(c => ({ ...c })), style: { ...t.style } };
                const updatedHistory = t.history.slice(0, t.historyIndex + 1);
                updatedHistory.push(prevState);
                return { ...t, history: updatedHistory, historyIndex: updatedHistory.length - 1 };
            })
        );
    };

    //  Undo
    const undo = () => {
        if (!activeTextId) return;
        setTexts((prev) =>
            prev.map((t) => {
                if (t.id !== activeTextId) return t;
                const newIndex = t.historyIndex - 1;
                if (newIndex < 0) return t;
                const prevState = t.history[newIndex];
                return { ...t, chunks: prevState.chunks, style: prevState.style, historyIndex: newIndex };
            })
        );
    };
    
    //מכאן והלאה
    const handleFromHereOn = (newStyle) => {
        if (!activeTextId) return;
        setTexts((prev) =>
            prev.map((t) => {
                if (t.id !== activeTextId) return t;
                const updatedStyle = { ...t.style, ...newStyle };
                const history = [...t.history.slice(0, t.historyIndex + 1), { chunks: [...t.chunks], style: updatedStyle }];
                return { ...t, style: updatedStyle, fromHereOn: true, history, historyIndex: history.length - 1 };
            })
        );
    };

    //שינוי סגנון כללי לכל הטקסט 
    const applyStyleToAll = (newStyle) => {
        if (!activeTextId) return;
        setTexts((prev) =>
            prev.map((t) => {
                if (t.id !== activeTextId) return t;
                const chunks = t.chunks.map((c) => ({ ...c, style: { ...c.style, ...newStyle } }));
                const history = [...t.history.slice(0, t.historyIndex + 1), { chunks: [...chunks], style: { ...t.style, ...newStyle } }];
                return { ...t, chunks, style: { ...t.style, ...newStyle }, history, historyIndex: history.length - 1 };
            })
        );
    };

    //  שמירה בשם חדש 
    const saveActiveFileAs = () => {
        if (!activeTextId || !loggedUser) return;
        const active = texts.find((t) => t.id === activeTextId);
        const name = prompt("Type a new file name:");
        if (!name) return;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.map(u => {
            if (u.id === loggedUser.id) {
                const files = u.files || {};
                files[name] = { chunks: active.chunks, style: active.style };
                return { ...u, files };
            }
            return u;
        });

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        updateActiveText({ fileName: name });
        alert(`Saved as: ${name}`);
    };

    //  שמירה רגילה של הקובץ הפעיל
    const saveActiveFile = () => {
        if (!activeTextId || !loggedUser) return;
        const active = texts.find(t => t.id === activeTextId);
        if (!active.fileName) return saveActiveFileAs();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.map(u => {
            if (u.id === loggedUser.id) {
                const files = u.files || {};
                const fileName = active.fileName || prompt("Type a new file name:");
                if (!fileName) return u;

                files[fileName] = {
                    chunks: active.chunks,
                    style: active.style
                };
                return { ...u, files };
            }
            return u;
        });

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        alert(`Saved successfully!`);
    };

    //  שליפה של כל הקבצים של המשתמש
    const getUserFiles = () => {
        if (!loggedUser) return [];
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.id === loggedUser.id);
        return user?.files ? Object.keys(user.files) : [];
    };

    //  תצוגת הדף הראשי
    const activeText = texts.find((t) => t.id === activeTextId) || { chunks: [], style: { color: 'black', fontSize: 16, fontFamily: 'Arial' } };

    return (
        <div className="app-container">
            <button className="logout-button"
                onClick={() => { setLoggedUser(null); setTexts([]) }}>exit
            </button>
            <div className="main-area" style={{ flex: 1, padding: "10px" }}>
                <div className="display-area">
                    {texts.map((t) => (
                        <DisplayText
                            key={t.id}
                            chunks={t.chunks}
                            isActive={t.id === activeTextId}
                            fileName={t.fileName}
                        />
                    ))}
                </div>
                <div className="editing-area">
                    <EditingText
                        chunks={activeText.chunks}
                        handleTextChange={handleTextChange}
                        handleFromHereOn={handleFromHereOn}
                        language={language}
                        setLanguage={setLanguage}
                        undo={undo}
                        style={activeText.style}
                        updateStyleGlobal={applyStyleToAll}
                        setChunks={(chunks) => updateActiveText({ chunks })}
                        savePrevStateToHistory={savePrevStateToHistory}
                    />
                </div>
            </div>
            <div className="file-panel" style={{ display: "flex" }}>
                <FileButtons allFiles={getUserFiles()}
                    onSave={saveActiveFile}
                    onSaveAs={saveActiveFileAs}
                    onOpen={onOpen}
                    createNewText={createNewText}
                    closeText={closeText}
                    texts={texts}
                    setActiveTextId={setActiveTextId}
                />
            </div>
        </div>
    );
}

export default App;