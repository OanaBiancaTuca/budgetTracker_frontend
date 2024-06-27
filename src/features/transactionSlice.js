import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createTransaction, deleteTransaction, getTransaction, updateTransaction, importTransactionsPdf } from "../api/transactionService";
import { notifications } from "@mantine/notifications";
import { ReactComponent as SuccessIcon } from "../assets/success-icon.svg";

export const addTransaction = createAsyncThunk('transaction/addTransaction', async (body) => {
    try {
        const response = await createTransaction(
            body.token,
            body.amount,
            body.description,
            body.paymentType,
            body.dateTime,
            body.categoryId,
            body.accountId
        );
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
});

export const editTransaction = createAsyncThunk('transaction/editTransaction', async (body) => {
    try {
        const response = await updateTransaction(
            body.token,
            body.amount,
            body.description,
            body.paymentType,
            body.dateTime,
            body.categoryId,
            body.accountId,
            body.transactionId
        );
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
});

export const fetchTransaction = createAsyncThunk('transaction/fetchTransaction', async (body) => {
    try {
        const response = await getTransaction(body.token);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
});

export const removeTransaction = createAsyncThunk('transaction/removeTransaction', async (body) => {
    try {
        const response = await deleteTransaction(body.token, body.transactionId);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
});

export const importTransactions = createAsyncThunk('transaction/importTransactions', async (body) => {
    try {
        const response = await importTransactionsPdf(body.file, body.token);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
});

const transactionSlice = createSlice({
    name: "transaction",
    initialState: {
        count: 0,
        displayTransactionForm: false,
        addTransactionInProcess: false,
        editTransactionInProcess: false,
        fetchTransactionInProcess: false,
        importTransactionInProcess: false,
        transactionList: []
    },
    reducers: {
        showTransactionForm: (state) => {
            state.displayTransactionForm = true;
        },
        closeTransactionForm: (state) => {
            state.displayTransactionForm = false;
        }
    },
    extraReducers: {
        [addTransaction.pending]: (state) => {
            state.addTransactionInProcess = true;
            console.log("Adăugare tranzacție în așteptare");
        },
        [addTransaction.fulfilled]: (state, action) => {
            const payload = action.payload || {};
            console.log("Răspuns Tranzacție:", payload);

            if (payload.message && payload.message === "success") {
                notifications.show({
                    title: 'Tranzacție Adăugată',
                    message: 'Tranzacție adăugată cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color: "green",
                });
                console.log("Tranzacție creată");
            } else {
                notifications.show({
                    title: "Eroare",
                    message: payload.message || 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                });
                console.log(payload.message);
            }
            state.addTransactionInProcess = false;
            state.displayTransactionForm = false;
        },
        [addTransaction.rejected]: (state, action) => {
            state.addTransactionInProcess = false;
            console.log("Crearea tranzacției a eșuat", action.error);
            notifications.show({
                title: "Crearea tranzacției a eșuat",
                message: 'Te rugăm să încerci din nou!!',
                radius: "lg",
                color: "red",
            });
        },
        [editTransaction.pending]: (state) => {
            console.log("Editarea tranzacției în așteptare");
            state.editTransactionInProcess = true;
        },
        [editTransaction.fulfilled]: (state, action) => {
            const payload = action.payload || {};
            console.log("Răspuns Tranzacție:", payload);

            if (payload.message && payload.message === "success") {
                notifications.show({
                    title: 'Tranzacție Updatată',
                    message: 'Tranzacție updatată cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color: "green",
                });
                console.log("Tranzacție updatată");
            } else {
                notifications.show({
                    title: "Eroare",
                    message: payload.message || 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                });
                console.log(payload.message);
            }
            state.editTransactionInProcess = false;
        },
        [editTransaction.rejected]: (state, action) => {
            notifications.show({
                title: "Editarea tranzacției a eșuat",
                message: 'Te rugăm să încerci din nou!!',
                radius: "lg",
                color: "red",
            });
            state.editTransactionInProcess = false;
        },
        [removeTransaction.pending]: (state) => {
            console.log("Ștergerea tranzacției în așteptare");
        },
        [removeTransaction.fulfilled]: (state, action) => {
            const payload = action.payload || {};
            console.log("Răspuns Tranzacție:", payload);

            if (payload.message && payload.message === "success") {
                notifications.show({
                    title: 'Tranzacție Ștearsă',
                    message: 'Tranzacție ștearsă cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color: "green",
                });
                console.log("Tranzacție ștearsă");
            } else {
                notifications.show({
                    title: "Eroare",
                    message: payload.message || 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                });
                console.log(payload.message);
            }
        },
        [removeTransaction.rejected]: (state, action) => {
            notifications.show({
                title: "Ștergerea tranzacției a eșuat",
                message: 'Te rugăm să încerci din nou!!',
                radius: "lg",
                color: "red",
            });
        },
        [fetchTransaction.pending]: (state) => {
            state.fetchTransactionInProcess = true;
            console.log("Preluarea tranzacției în așteptare");
        },
        [fetchTransaction.fulfilled]: (state, action) => {
            const payload = action.payload || {};
            console.log("Răspuns Tranzacție:", payload);

            if (payload.message && payload.message === "success") {
                state.transactionList = payload.data || [];
                console.log("Tranzacție preluată");
            } else {
                console.log(payload.message);
            }
            state.fetchTransactionInProcess = false;
        },
        [fetchTransaction.rejected]: (state, action) => {
            state.fetchTransactionInProcess = false;
            console.log("Preluarea tranzacției a eșuat", action.error);
        },
        [importTransactions.pending]: (state) => {
            state.importTransactionInProcess = true;
            console.log("Import tranzacție în așteptare");
        },
        [importTransactions.fulfilled]: (state, action) => {
            const payload = action.payload || {};
            console.log("Răspuns Import Tranzacție:", payload);

            if (payload.message && payload.message === "success") {
                notifications.show({
                    title: 'Tranzacții Importate',
                    message: 'Tranzacții importate cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color: "green",
                });
                state.transactionList = payload.transactions || [];
                console.log("Tranzacții importate");
            } else {
                notifications.show({
                    title: "Eroare",
                    message: payload.message || 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                });
                console.log(payload.message);
            }
            state.importTransactionInProcess = false;
        },
        [importTransactions.rejected]: (state, action) => {
            state.importTransactionInProcess = false;
            console.log("Importul tranzacțiilor a eșuat", action.error);
            notifications.show({
                title: "Importul tranzacțiilor a eșuat",
                message: 'Te rugăm să încerci din nou!!',
                radius: "lg",
                color: "red",
            });
        },
    }
});

export const { showTransactionForm, closeTransactionForm } = transactionSlice.actions;

export default transactionSlice.reducer;
