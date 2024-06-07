import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { useSelector } from 'react-redux';
import { baseUrl } from '../api/config';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState('');
    const token = useSelector((state) => state.user.token);

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        if (query.trim() === '') return;

        const userMessage = { text: query, sender: 'user' };
        setMessages([...messages, userMessage]);

        try {
            const res = await axios.post(`${baseUrl}/chatbot/query`, { userMessage: query }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const botMessage = { text: res.data, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (err) {
            console.error('Error in response from server:', err.response || err);
            let errorMessage = 'Error in response from server';
            if (err.response) {
                console.error('Server Response:', err.response.data);
                console.error('Server Status:', err.response.status);
                console.error('Server Headers:', err.response.headers);
                if (err.response.status === 500) {
                    errorMessage = 'Internal server error. Please try again later.';
                } else if (err.response.status === 429) {
                    errorMessage = 'Rate limit exceeded. Please wait and try again.';
                } else if (err.response.status === 402) {
                    errorMessage = 'Quota exceeded. Please check your plan and billing details.';
                }
            } else {
                errorMessage = 'Network error. Please check your internet connection.';
            }
            const botMessage = { text: errorMessage, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
        setQuery('');
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <div className="message-text">{message.text}</div>
                    </div>
                ))}
            </div>
            <form className="chat-input-box" onSubmit={handleQuerySubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
