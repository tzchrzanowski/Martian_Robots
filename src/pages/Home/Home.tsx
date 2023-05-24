import React, { useState, ChangeEvent } from 'react';
import './Home.css';

export function Home () {
    const [text, setText] = useState('');
    const [outputText, setOutputText] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    return (
        <div className={"Home"}>
            <h1>Martian Robot</h1>

            <label htmlFor="multiline-input">Robots input commands: </label>
            <textarea
                id="multiline-input"
                value={text}
                onChange={handleInputChange}
                rows={9}
                cols={40}
            />
            <p>Entered Text: {text}</p>
            <textarea
                id="multiline-output"
                value={outputText}
                onChange={handleInputChange}
                rows={4}
                cols={40}
            />
        </div>
    )
}
