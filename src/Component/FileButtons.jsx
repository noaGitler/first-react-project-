import React from "react";
import { useState } from "react";
import "./FileButtons.css";

function FileButtons({ allFiles, onSave, onSaveAs, onOpen, createNewText, closeText, texts, setActiveTextId }) {
    return (
        <div style={{ padding: "10px", width: "200px", borderRight: "1px solid gray" }}>
            <h3>Saved files:</h3>
            {allFiles.length === 0 && <p>No files</p>}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {allFiles.map((file) => (
                    <li key={file} style={{ margin: "5px 0" }}>
                        <button style={{ width: "100%", textAlign: "left" }} onClick={() => onOpen(file)}>
                            Open: {file}
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Open texts:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {texts.map(text => (
                    <li key={text.id} style={{ margin: "5px 0" }}>
                        <button style={{ width: "100%", textAlign: "left" }} onClick={() => setActiveTextId(text.id)}>
                            Edit: {text.fileName || `Untitled-${text.id}`}
                        </button>
                        <button style={{ marginLeft: "5px" }} onClick={() => closeText(text.id)}>X</button>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: "10px" }}>
                <button onClick={onSave}>💾 Save</button>
                <button onClick={onSaveAs}>📁 Save As</button>
                <button onClick={createNewText}>📂 New</button>
            </div>
        </div>
    );
}

export default FileButtons;
