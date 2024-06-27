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
            return error.response.data;
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
            return error.response.data;
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
            return error.response.data;
        }
        throw error;
    }
}

export async function deleteTransaction(token, transactionId) {
    try {
        console.log("Token delete:", token)
        const response = await axios.delete(`${baseUrl}/transactions?transactionId=${transactionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
}

export async function importTransactionsPdf(file, token) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        console.log("Token before import:", token); // Log pentru a verifica token-ul înainte de import
        const response = await axios.post(`${baseUrl}/transactions/import-pdf`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": 'multipart/form-data'
            }
        });
        console.log("Response data:", response.data); // Log pentru a verifica răspunsul
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("Error response:", error.response); // Log pentru a verifica răspunsul de eroare
            return error.response.data;
        }
        throw error;
    }
}
