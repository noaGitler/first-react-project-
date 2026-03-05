import React from "react";
import { useState } from "react";
import "./EditingText.css";

import Keyboard from "./Keyboard";
import Buttons from "./Buttons";

// אזור עריכת טקסט
function EditingText({ chunks, handleTextChange, language, setLanguage, undo, style, updateStyleGlobal, handleFromHereOn, setChunks, savePrevStateToHistory }) {

  // --- שינוי סגנון מקומי לכל הטקסטים
  const applyStyleToAllLocal = (newStyle) => {
    savePrevStateToHistory();
    const newChunks = chunks.map(chunk => ({ ...chunk, style: { ...chunk.style, ...newStyle } }));
    setChunks(newChunks); 
    updateStyleGlobal(newStyle); 
  };

  // --- החלפת תווים בטקסט
  const replaceChar = (oldChar, newChar) => {
    savePrevStateToHistory();
    const newChunks = chunks.map(chunk => ({ ...chunk, text: chunk.text.split(oldChar).join(newChar) }));
    setChunks(newChunks);
  };

  return (
    <div className="editing-container">
      <textarea
        placeholder="Type..."
        value={chunks.map(c => c.text).join('')}
        onChange={(e) => {
          const currentValue = e.target.value;
          const prevValue = chunks.map(c => c.text).join('');
          if (currentValue.startsWith(prevValue) && currentValue.length > prevValue.length) {
            const newChar = currentValue.slice(prevValue.length);
            handleTextChange(newChar);
          } else {
            savePrevStateToHistory();
            const newChunks = [{ text: currentValue, style }];
            setChunks(newChunks);
          }
        }}
      />
      <div className="keyboard-and-delete">
        <Keyboard language={language} handleTextChange={handleTextChange} />
        <div className="special-buttons">
          <button onClick={() => {
            if (!chunks || chunks.length === 0) return;
            const lastChunk = { ...chunks[chunks.length - 1] };
            let newChunks;
            if (lastChunk.text.length > 1) {
              lastChunk.text = lastChunk.text.slice(0, -1);
              newChunks = [...chunks.slice(0, -1), lastChunk];
            } else {
              newChunks = chunks.slice(0, -1);
            }
            setChunks(newChunks);
          }}>Deleting a character</button>

          <button onClick={() => { savePrevStateToHistory(); setChunks([]); }}>Deleting everything</button>
          <button onClick={undo}>↩️ Undo</button>
        </div>
      </div>
      <div className="controls">
        <Buttons
          language={language}
          setLanguage={setLanguage}
          style={style}
          updateStyleGlobal={updateStyleGlobal}
          handleFromHereOn={handleFromHereOn}
          replaceChar={replaceChar}
          applyStyleToAll={applyStyleToAllLocal}
        />
      </div>
    </div>
  );
}

export default EditingText;
