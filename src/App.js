import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const sendMessage = () => {
    if (userMessage.trim() !== '') {
      setMessages([...messages, { text: userMessage, sender: 'user' }]);
      setUserMessage('');
    }
  };

  const calculateTextColor = () => {
    const charCount = userMessage.length;
    const maxChars = 750;
    const darkness = Math.min(1, charCount / maxChars); // Value between 0 and 1

    // Convert darkness to hex (00 to FF)
    const hexValue = Math.round(darkness * 255).toString(16).padStart(2, '0');
    
    return `#${hexValue}0000`; // Red color with varying darkness
  };
  
  return (
    <div id="container">
        <div className="chat-messages">
            {messages.map((message, index) => (
                <div key={index} className={`message-bubble ${message.sender}`}>{message.text}</div>
            ))}
        </div>
        <div className="chat-container">
            <div className="user-input">
                <div className="input-container">
                    <textarea
                        id="messageInput"
                        placeholder="Type your message..."
                        value={userMessage}
                        onChange={(e) => {
                    setUserMessage(e.target.value);
                    e.target.style.height = '1.5em';
                    e.target.style.height = (e.target.scrollHeight) + 'px';
                    }}
                    maxLength={750}
                    />
                    <div className="char-counter" style={{ color: calculateTextColor() }}>{userMessage.length}/750</div>
                </div>
                <button id="sendMessageBtn" onClick={sendMessage}>Send</button>
            </div>
        </div>
    </div>
  );
}

export default App;