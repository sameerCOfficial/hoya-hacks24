import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendUserMessage = async () => {
    if (userMessage.trim() !== '') {
      setIsLoading(true);

      // Simulate a delay before the bot responds
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: userMessage, sender: 'user' },
        ]);

        // Trigger the bot response after the user's message
        sendBotMessage();

        setIsLoading(false);
      }, 0);

      setUserMessage('');
    }
  };

  const sendBotMessage = () => {
    // Show loading indicator in the same bubble
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: <LoadingIcons.Puff />,
        sender: 'bot',
        loading: true,
        iconPath: '/path/to/your/image.png', // Replace with the actual file path
      },
    ]);
  
    // Simulate a delay for the bot's response
    setTimeout(() => {
      setMessages((prevMessages) => {
        // Replace the loading indicator with the actual response
        const updatedMessages = [...prevMessages];
        const loadingMessageIndex = updatedMessages.findIndex(
          (message) => message.loading && message.sender === 'bot'
        );
  
        if (loadingMessageIndex !== -1) {
          updatedMessages[loadingMessageIndex] = {
            text: 'SertSertSertSert...SertSertSertSert...SertSertSertSert...SertSertSertSert...SertSertSertSert...SertSertSertSert...SertSertSertSert...', // Replace with your actual response
            sender: 'bot',
            iconPath: '/assets/maryland_logo.pg', // Replace with the actual file path
          };
        }
  
        return updatedMessages;
      });
    }, 2000);
  };
  

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="container">
      <div id="chat-container" className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-bubble ${message.sender}`}>
            {message.sender === 'bot' && message.loading && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {message.text}
              </div>
            )}
            {message.sender === 'bot' && !message.loading && (
              <div className="bot-messages">
                {message.icon && <div className="icon-container">{message.icon}</div>}
               <div>{message.text}</div>
            </div>
            )}

            {message.sender !== 'bot' && <div>{message.text}</div>}
          </div>
        ))}
      </div>
      <div className="chat-container">
        <div className="user-input" style={{ backgroundColor: '#121212' }}>
          <div className="input-container">
            <textarea
              id="messageInput"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => {
                setUserMessage(e.target.value);
                e.target.style.height = '1.5em';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              maxLength={750}
              style={{
                color: 'white',
                backgroundColor: '#121212',
                border: '1px solid white',
                borderRadius: '4px',
                padding: '8px',
                boxSizing: 'border-box',
                resize: 'none',
              }}
            />
            <div className="char-counter" style={{ color: 'white' }}>
              {userMessage.length}/750
            </div>
          </div>
          <button id="sendMessageBtn" onClick={sendUserMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
