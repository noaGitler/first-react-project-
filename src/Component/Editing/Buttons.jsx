import React from "react";
import { useState } from "react";
import "./Buttons.css";

function Buttons({ language, setLanguage, style, handleFromHereOn, replaceChar, applyStyleToAll }) {
    const [tempStyle, setTempStyle] = useState(style);

    const changeFontSize = (delta) => setTempStyle(prev => ({ ...prev, fontSize: prev.fontSize + delta }));
    const changeColor = (color) => setTempStyle(prev => ({ ...prev, color }));
    const changeFontFamily = (family) => setTempStyle(prev => ({ ...prev, fontFamily: family }));
    const fontFamilies = ["Arial", "Times New Roman", "Courier New", "Verdana"];
    const colors = ["black", "red", "green", "blue", "orange", "purple", "pink"];

    return (
        <div className="buttons-container">
            <div className="language-buttons">
                <button onClick={() => setLanguage(language === 'english' ? 'hebrew' : 'english')}>Language</button>
                <button onClick={() => setLanguage("emoji")}>Emoji</button>
                <button onClick={() => setLanguage("char")}>Char</button>
            </div>

            <div className="style-buttons">
                <button onClick={() => changeFontSize(2)}>A+</button>
                <button onClick={() => changeFontSize(-2)}>A-</button>


                <select
                    onChange={(e) => changeFontFamily(e.target.value)}
                    value={tempStyle.fontFamily}
                >
                    {fontFamilies.map((family) => (
                        <option key={family} value={family}>{family}</option>
                    ))}
                </select>

                <select
                    onChange={(e) => changeColor(e.target.value)}
                    value={tempStyle.color}
                >
                    {colors.map((color) => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>

                <div className="style-buttons">
                    <button onClick={() => handleFromHereOn(tempStyle)}>From now on</button>
                    <button onClick={() => applyStyleToAll(tempStyle)}>Will apply to everything</button>
                </div>

                <div className="replace-char-container">
                    <input type="text" placeholder="Search character" id="searchChar" maxLength={1} />
                    <input type="text" placeholder="New character" id="replaceChar" maxLength={1} />
                    <button onClick={() => {
                        const oldCharInput = document.getElementById("searchChar");
                        const newCharInput = document.getElementById("replaceChar");
                        const oldChar = oldCharInput?.value;
                        const newChar = newCharInput?.value;
                        if (!oldChar || !newChar) {
                            alert("Please fill in both fields before replacing");
                            return;
                        }
                        replaceChar(oldChar, newChar);
                        oldCharInput.value = "";
                        newCharInput.value = "";
                    }}>
                        Character replacement
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Buttons;