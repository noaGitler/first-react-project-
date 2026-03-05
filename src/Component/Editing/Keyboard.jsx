import React from "react";
import { useState } from "react";
import "./Keyboard.css";

// מציג מקלדת בהתאם לשפה
function Keyboard({ language, handleTextChange }) {
    const board = {
        english: [
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
            ["z", "x", "c", "v", "b", "n", "m"],
            [" "]
        ],
        hebrew: [
            ["ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"],
            ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף"],
            ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת"],
            [" "]
        ],
        emoji: [
            ["😀", "😁", "😂", "🤣", "😊"],
            ["😍", "😘", "😅", "😉", "😭"],
            ["👍", "🙏", "🔥", "✨", "🎉"],
            [" "]
        ],
        char: [
            ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            ["-", "/", ";", ":", "(", ")", "$", "&", "@"],
            ["\"", ".", ",", "?", "!", "%"],
            [" "]
        ]
    };

    return (
        <div className="keyboard-area">
            {board[language].map((row, i) => (
                <div key={i} className="keyboard-row">
                    {row.map((char, j) => (
                        <button key={j} onClick={() => handleTextChange(char)} style={{ margin: "2px", padding: "8px" }}>{char === " " ? "Space" : char}</button>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Keyboard;