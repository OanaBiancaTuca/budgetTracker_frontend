import axios from "axios";
import { baseUrl } from "./config";

export async function createBudget(token, categoryId, amount) {
    return await axios.post(`${baseUrl}/budgets`, {
        categoryId: categoryId,
        amount: amount
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function updateBudget(token, budgetId, categoryId, amount) {
    return await axios.put(`${baseUrl}/budgets/${budgetId}`, {
        categoryId: categoryId,
        amount: amount
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function deleteBudget(token, budgetId) {
    return await axios.delete(`${baseUrl}/budgets/${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function getBudget(token) {
    return await axios.get(`${baseUrl}/budgets`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function resetBudgetAmount(token, budgetId) {
    return await axios.post(`${baseUrl}/budgets/${budgetId}/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function updateBudgetTime(token, budgetId, amount, used, balance) {
    return await axios.post(`${baseUrl}/budgets/${budgetId}/reset`, {
        amount,
        used,
        balance
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
}
