import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { useSelector } from 'react-redux';
import userIcon from '../assets/user-icon.png';
import botIcon from '../assets/bot-icon.png';
import backArrow from '../assets/back-arrow.png';
import { AppShell, Header } from '@mantine/core';
import SideBar from './SideBar'; // Importă componenta SideBar
import HeaderBar from './HeaderBar'; // Importă componenta HeaderBar

const baseUrl = 'http://localhost:8080';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState('');
    const [showOptions, setShowOptions] = useState(true);
    const [showOperations, setShowOperations] = useState(false);
    const [currentOperation, setCurrentOperation] = useState('');
    const [operationSteps, setOperationSteps] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState([]);
    const token = useSelector((state) => state.user.token);

    const [navOpened, setNavOpened] = useState(false);
    const isMobile = window.innerWidth <= 768; // Determinați dacă este mobil

    useEffect(() => {
        if (currentOperation === 'Vizualizează obiectivele') {
            fetchData('/api/chatbot/goals');
        } else if (currentOperation === 'Vizualizează datoriile') {
            fetchData('/api/chatbot/debts');
        }
    }, [currentOperation]);

    const fetchData = async (endpoint) => {
        try {
            const res = await axios.get(`${baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(res.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        if (query.trim() === '') return;

        const userMessage = { text: query, sender: 'user' };
        setMessages([...messages, userMessage]);
        setQuery('');  // Reset the input field after sending the message

        if (currentOperation && currentStep > 0) {
            const newOperationSteps = { ...operationSteps, [currentStep]: query };
            setOperationSteps(newOperationSteps);
            proceedWithOperation(newOperationSteps);
            return;
        }

        try {
            const res = await axios.post(`${baseUrl}/api/chatbot/query`, { userMessage: query }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const botMessage = { text: res.data, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (err) {
            console.error('Error in response from server:', err.response || err);
            let errorMessage = 'Eroare la răspunsul de la server';
            if (err.response) {
                console.error('Răspunsul serverului:', err.response.data);
                console.error('Starea serverului:', err.response.status);
                console.error('Headerele serverului:', err.response.headers);
                if (err.response.status === 500) {
                    errorMessage = 'Eroare internă a serverului. Te rugăm să încerci mai târziu.';
                } else if (err.response.status === 429) {
                    errorMessage = 'Limita de rată depășită. Te rugăm să aștepți și să încerci din nou.';
                } else if (err.response.status === 402) {
                    errorMessage = 'Cota depășită. Te rugăm să verifici planul și detaliile de facturare.';
                }
            } else {
                errorMessage = 'Eroare de rețea. Te rugăm să verifici conexiunea la internet.';
            }
            const botMessage = { text: errorMessage, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
    };

    const proceedWithOperation = (steps) => {
        const stepKeys = Object.keys(steps);
        if (currentStep < stepKeys.length) {
            const nextStep = parseInt(stepKeys[currentStep], 10) + 1;
            setCurrentStep(nextStep);
            const instruction = getOperationInstruction(currentOperation, nextStep);
            setMessages((prevMessages) => [...prevMessages, { text: instruction, sender: 'bot' }]);
        } else {
            completeOperation(steps);
        }
    };

    const completeOperation = async (steps) => {
        const finalMessage = formatFinalMessage(currentOperation, steps);
        try {
            const res = await axios.post(`${baseUrl}/api/chatbot/query`, { userMessage: finalMessage }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const botMessage = { text: res.data, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (err) {
            console.error('Error in response from server:', err.response || err);
            const errorMessage = 'Eroare la răspunsul de la server';
            const botMessage = { text: errorMessage, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
        resetOperationState();
    };

    const resetOperationState = () => {
        setCurrentOperation('');
        setOperationSteps({});
        setCurrentStep(0);
        setShowOptions(true);
        setData([]); // Clear data when operation is reset
    };

    const getOperationInstruction = (operation, step) => {
        const instructions = {
            'Adaugă obiectiv': [
                'Urmareste instructiunile. Raspunde cu DA daca esti pregatit:',
                'Te rog să trimiți suma obiectivului (în lei):',
                'Te rog să trimiți data țintă (zz-ll-aaaa):'
            ],
            'Vizualizează obiectivele': [],
            'Vizualizează datoriile': [],
            'Șterge obiectiv': [
                'Te rog să trimiți id-ul obiectivului pe care dorești să îl ștergi:'
            ],
            'Actualizează statusul datoriei': [
                'Urmareste instructiunile. Raspunde cu DA daca esti pregatit::',
                'Te rog să trimiți noul statut al datoriei:'
            ],
            'Adaugă datorie': [
                'Urmareste instructiunile. Raspunde cu DA daca esti pregatit::',
                'Te rog să trimiți suma datoriei (în lei):',
                'Te rog să trimiți furnizorul datoriei:',
                'Te rog să trimiți data scadenței (zz-ll-aaaa):'
            ],
            'Șterge datorie': [
                'Urmareste instructiunile. Raspunde cu DA daca esti pregatit::'
            ],
            'Schimbă scadența datoriei': [
                'Urmareste instructiunile. Raspunde cu DA daca esti pregatit:',
                'Te rog să trimiți noua dată a scadenței (zz-ll-aaaa):'
            ]
        };
        return instructions[operation][step - 1];
    };

    const formatFinalMessage = (operation, steps) => {
        switch (operation) {
            case 'Adaugă obiectiv':
                return `Adaugă obiectivul cu numele ${steps[1]}, suma ${steps[2]} lei, targetDate ${steps[3]}`;
            case 'Șterge obiectiv':
                return `Șterge obiectivul cu id ${steps[1]}`;
            case 'Actualizează statusul datoriei':
                return `Actualizează statusul datoriei cu id ${steps[1]} la ${steps[2]}`;
            case 'Adaugă datorie':
                return `Adaugă datoria cu descrierea ${steps[1]}, suma ${steps[2]} lei, furnizor ${steps[3]}, scadența ${steps[4]}`;
            case 'Șterge datorie':
                return `Șterge datoria cu id ${steps[1]}`;
            case 'Schimbă scadența datoriei':
                return `Schimbă scadența datoriei cu id ${steps[1]} la ${steps[2]}`;
            default:
                return '';
        }
    };

    const handleOptionClick = (option) => {
        if (option === 'comenzi') {
            setShowOptions(false);
            setShowOperations(true);
        } else if (option === 'intrebari') {
            setShowOptions(false);
            setMessages([
                ...messages,
                { text: 'Salut! Pot să te ajut cu orice întrebare legată de termeni economici.', sender: 'bot' }
            ]);
        }
    };

    const handleOperationClick = (operation) => {
        setShowOperations(false);
        setCurrentOperation(operation);
        setCurrentStep(1);
        const instruction = getOperationInstruction(operation, 1);
        setMessages([...messages, { text: instruction, sender: 'bot' }]);
    };

    const handleBackClick = () => {
        setShowOperations(false);
        setShowOptions(true);
        setCurrentOperation('');
        setMessages([]); // Reset the messages when going back
    };

    return (
        <AppShell
            padding="md"
            navbar={<SideBar navOpened={navOpened} isMobile={isMobile} currentPage="Chat" />}
            header={<Header height={60} p="xs"><HeaderBar navOpened={navOpened} setNavOpened={setNavOpened} isMobile={isMobile} /></Header>}
        >
            <div className="chat-container">
                <div className="chat-box" style={{ height: '80vh' }}>
                    {showOptions && (
                        <>
                            <div className="chat-message bot">
                                <img src={botIcon} alt="Bot" className="icon" />
                                <div className="message-text">Salutare! Sunt Dana, asistenta ta online! Cum îți pot fi de folos astăzi? Alege din lista de mai jos:</div>
                            </div>
                            <div className="options-container">
                                <div className="option-button" onClick={() => handleOptionClick('comenzi')}>Operațiuni disponibile</div>
                                <div className="option-button" onClick={() => handleOptionClick('intrebari')}>Întrebări generale</div>
                            </div>
                        </>
                    )}

                    {showOperations && (
                        <>
                            <div className="chat-message bot">
                                <img src={botIcon} alt="Bot" className="icon" />
                                <div className="message-text">Alege o operațiune:</div>
                            </div>
                            <div className="options-container">
                                <div className="option-button" onClick={() => handleOperationClick('Adaugă obiectiv')}>Adaugă obiectiv</div>
                                <div className="option-button" onClick={() => handleOperationClick('Vizualizează obiectivele')}>Vizualizează obiectivele</div>
                                <div className="option-button" onClick={() => handleOperationClick('Șterge obiectiv')}>Șterge obiectiv</div>
                                <div className="option-button" onClick={() => handleOperationClick('Adaugă datorie')}>Adaugă datorie</div>
                                <div className="option-button" onClick={() => handleOperationClick('Vizualizează datoriile')}>Vizualizează datoriile</div>
                                <div className="option-button" onClick={() => handleOperationClick('Actualizează statusul datoriei')}>Actualizează statusul datoriei</div>

                                <div className="option-button" onClick={() => handleOperationClick('Șterge datorie')}>Șterge datorie</div>
                                <div className="option-button" onClick={() => handleOperationClick('Schimbă scadența datoriei')}>Schimbă scadența datoriei</div>
                            </div>
                            <div className="option-button back-button" onClick={handleBackClick}>
                                <img src={backArrow} alt="Înapoi" className="icon" /> Înapoi
                            </div>
                        </>
                    )}

                    {currentOperation === 'Vizualizează obiectivele' && data.length > 0 && (
                        <>
                            <div className="option-button back-button" onClick={handleBackClick}>
                                <img src={backArrow} alt="Înapoi" className="icon" /> Înapoi
                            </div>
                            <div className="data-table">
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nume</th>
                                            <th>Suma</th>
                                            <th>Data țintă</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.targetAmount}</td>
                                                <td>{new Date(item.targetDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {currentOperation === 'Vizualizează datoriile' && data.length > 0 && (
                        <>
                            <div className="option-button back-button" onClick={handleBackClick}>
                                <img src={backArrow} alt="Înapoi" className="icon" /> Înapoi
                            </div>
                            <div className="data-table">
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Furnizor</th>
                                            <th>Status</th>
                                            <th>Suma</th>
                                            <th>Data scadenței</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(item => (
                                            <tr key={item.debtId}>
                                                <td>{item.debtId}</td>
                                                <td>{item.moneyFrom}</td>
                                                <td>{item.status}</td>
                                                <td>{item.amount}</td>
                                                <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {currentOperation !== '' && currentOperation !== 'Vizualizează obiectivele' && currentOperation !== 'Vizualizează datoriile' && (
                        <div className="option-button back-button" onClick={handleBackClick}>
                            <img src={backArrow} alt="Înapoi" className="icon" /> Înapoi
                        </div>
                    )}

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
                        placeholder="Scrie un mesaj..."
                        className="chat-input"
                    />
                    <button type="submit" className="send-button">Trimite</button>
                </form>
            </div>
        </AppShell>
    );
};

export default Chatbot;
