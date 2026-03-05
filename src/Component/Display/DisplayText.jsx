import React from "react";
import { useState } from "react";
import "./DisplayText.css";


function DisplayText({ chunks, isActive, fileName }) {
    return (
        <div className={`text-chunk ${isActive ? "active" : ""}`}>
            <div className="text-chunk-title">{fileName || "Note"}</div>
            {chunks && Array.isArray(chunks) && chunks.map((chunk, i) => (
                <span key={i} style={chunk.style}>{chunk.text}</span>
            ))}
        </div>
    );
}

export default DisplayText;
