import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons';
import {
  ChatOpenAI
} from 'langchain';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendUserMessage = async () => {
    if (userMessage.trim() !== '') {
      setIsLoading(true);

      // Simulate a delay before the bot responds
      setTimeout(async () => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: userMessage, sender: 'user' },
        ]);

        // Trigger the bot response after the user's message
        await sendBotMessage(userMessage);

        setIsLoading(false);
      }, 0);

      setUserMessage('');
    }
  };

  const sendBotMessage = async (userMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: <LoadingIcons.Puff />,
        sender: 'bot',
        loading: true,
        iconPath: '/path/to/your/image.png', // Replace with the actual file path
      },
    ]);

    try {
      const res = await chatConversationChain.call({
        question: userMessage,
      });

      // Simulate a delay for the bot's response
      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const loadingMessageIndex = updatedMessages.findIndex(
            (message) => message.loading && message.sender === 'bot'
          );

          if (loadingMessageIndex !== -1) {
            updatedMessages[loadingMessageIndex] = {
              text: res, // Replace with the actual response
              sender: 'bot',
              iconPath: '/assets/maryland_logo.pg', // Replace with the actual file path
            };
          }

          return updatedMessages;
        });
      }, 2000);
    } catch (error) {
      console.error('Error fetching bot response:', error);
    }
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
                {message.icon && (
                  <div className="icon-container">{message.icon}</div>
                )}
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

// Set up the required objects outside the component
const loader = new TextLoader('./state_of_the_union.txt');
const rawDocuments = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0,
});
const documents = await splitter.splitDocuments(rawDocuments);

const store = await AzureAISearchVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings(), // You might need to import OpenAIEmbeddings or use a suitable replacement
  {
    search: {
      type: AzureAISearchQueryType.SimilarityHybrid,
    },
  }
);

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    "You are a nice chatbot having an informative conversation with a student pursuing college that is seeking answers to their college-related questions. However, you must assume that the question is asking about the year " +
      new Date().getFullYear() +
      ', unless specified otherwise. Please ask for confirmation if the questions are missing necessary details and answer the student\'s question if you have enough details. After receiving the necessary details, make sure to answer the question being asked, without being prompted again. If you were already given context, use the context that was given unless given other instructions by the user.',
  ],
  ['human', '{chat_history}\n{question}'],
]);

const model = new ChatOpenAI({
  azureOpenAIApiKey: 'df03eae4e9ac4e9cbae0f8faf41013c7',
  azureOpenAIApiInstanceName: 'hoya-hacks-2024-umd',
  azureOpenAIApiDeploymentName: 'gpt-35-turbo',
  azureOpenAIApiVersion: '2023-09-15-preview',
  temperature: 0,
});

const memory = new ConversationSummaryMemory({
  memoryKey: 'chat_history',
  llm: model,
});

const chatConversationChain = new LLMChain({
  llm: model,
  prompt: prompt,
  verbose: false,
  memory: memory,
});

export default ChatApp;