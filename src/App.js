import React from 'react';
import { Route, Routes, Navigate, HashRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import LandingScreen from './screens/LandingScreen';
import DashboardScreen from './screens/DashboardScreen';
import AccountScreen from "./screens/AccountScreen";
import ReportScreen from './screens/ReportScreen';
import GoalScreen from './screens/GoalScreen';
import TransactionScreen from './screens/TransactionScreen';
import ProfileScreen from './screens/ProfileScreen';
import BudgetScreen from "./screens/BudgetScreen";
import DebtScreen from './screens/DebtScreen';
import Chatbot from "./components/Chatbot"; // Corect importul componentei Chatbot

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route exact path='/' element={<AlreadyLoggedin><LandingScreen /></AlreadyLoggedin>} />
                <Route path='/dashboard' element={<RequireAuth><DashboardScreen /></RequireAuth>} />
                <Route path='/account' element={<RequireAuth><AccountScreen /></RequireAuth>} />
                <Route path='/debts' element={<RequireAuth><DebtScreen /></RequireAuth>} />
                <Route path='/report' element={<RequireAuth><ReportScreen /></RequireAuth>} />
                <Route path='/goal' element={<RequireAuth><GoalScreen /></RequireAuth>} />
                <Route path='/transaction' element={<RequireAuth><TransactionScreen /></RequireAuth>} />
                <Route path='/profile' element={<RequireAuth><ProfileScreen /></RequireAuth>} />
                <Route path='/budget' element={<RequireAuth><BudgetScreen /></RequireAuth>} />
                <Route path='/chat' element={<RequireAuth><Chatbot /></RequireAuth>} /> {/* Adăugați componenta Chatbot */}
                <Route path='/*' element={<p>Page not found</p>} />
            </Routes>
        </HashRouter>
    );
}

function RequireAuth({ children }) {
    const token = useSelector(state => state.user.token);
    if (!token) {
        return <Navigate to="/" />;
    } else {
        return children;
    }
}

function AlreadyLoggedin({ children }) {
    const token = useSelector(state => state.user.token);
    return token ? <Navigate to="/dashboard" /> : children;
}

export default App;
