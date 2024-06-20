import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { useSelector } from 'react-redux';
import { baseUrl } from '../api/config';
import userIcon from '../assets/user-icon.png'; // Import iconiță utilizator
import botIcon from '../assets/bot-icon.png'; // Import iconiță chatbot
import backArrow from '../assets/back-arrow.png';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState('');
    const [showOptions, setShowOptions] = useState(true);
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

    const handleOptionClick = (option) => {
        setShowOptions(false);
        if (option === 'asistenta') {
            setMessages([
                ...messages,
                { text: 'Comenzile disponibile sunt: \n1. Adaugă obiectiv\n2. Vizualizează obiectivele\n3. Șterge obiectiv\n4. Actualizează statutul datoriei\n5. Adaugă datorie\n6. Șterge datorie\n7. Schimbă scadența datoriei', sender: 'bot' }
            ]);
        }
    };

    if (showOptions) {
        return (
            <div className="chat-container">
                <img src={backArrow} alt="Back" className="back-arrow" onClick={() => setShowOptions(true)} />
                <div className="chat-box">
                    <div className="chat-message bot">
                        <img src={botIcon} alt="Bot" className="icon" />
                        <div className="message-text">Bine ai venit! Te pot ajuta cu:</div>
                    </div>
                    <div className="chat-message bot" onClick={() => handleOptionClick('intrebari')}>
                        <img src={botIcon} alt="Bot" className="icon" />
                        <div className="message-text">Întrebări generale</div>
                    </div>
                    <div className="chat-message bot" onClick={() => handleOptionClick('asistenta')}>
                        <img src={botIcon} alt="Bot" className="icon" />
                        <div className="message-text">Asistență chatbot</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <img src={backArrow} alt="Back" className="back-arrow" onClick={() => setShowOptions(true)} />
            <div className="chat-box">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <img src={message.sender === 'user' ? userIcon : botIcon} alt={message.sender} className="icon" />
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
