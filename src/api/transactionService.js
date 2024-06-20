import axios from "axios";
import { baseUrl } from "./config";

export async function createTransaction(token, amount, description, paymentType, dateTime, categoryId, accountId) {
    try {
        const response = await axios.post(`${baseUrl}/transactions`, {
            amount,
            description,
            paymentType,
            dateTime,
            categoryId,
            accountId,
            budgetId: accountId,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data; // Ensure this returns an object with a 'message' property
        }
        throw error;
    }
}

export async function updateTransaction(token, amount, description, paymentType, dateTime, categoryId, accountId, transactionId) {
    try {
        const response = await axios.put(`${baseUrl}/transactions?transactionId=${transactionId}`, {
            amount,
            description,
            paymentType,
            dateTime,
            categoryId,
            accountId,
            budgetId: accountId,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data; // Ensure this returns an object with a 'message' property
        }
        throw error;
    }
}

export async function getTransaction(token) {
    try {
        const response = await axios.get(`${baseUrl}/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data; // Ensure this returns an object with a 'message' property
        }
        throw error;
    }
}

export async function deleteTransaction(token, transactionId) {
    try {
        const response = await axios.delete(`${baseUrl}/transactions?transactionId=${transactionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data; // Ensure this returns an object with a 'message' property
        }
        throw error;
    }
}
