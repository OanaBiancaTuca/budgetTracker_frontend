import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAccount, deleteAccount, getAccount, updateAccount } from "../api/accountService";
import { notifications } from "@mantine/notifications";
import { ReactComponent as SuccessIcon } from "../assets/success-icon.svg";

export const addAccount = createAsyncThunk('account/addAccount', async (body) => {
    try {
        const response = await createAccount(
            body.token,
            body.name,
            body.currentBalance,
            body.paymentTypes
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const changeAccount = createAsyncThunk('account/changeAccount', async (body) => {
    try {
        const response = await updateAccount(body.token, body);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const removeAccount = createAsyncThunk('account/removeAccount', async (body) => {
    try {
        const response = await deleteAccount(body.token, body.accountId);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const fetchAccount = createAsyncThunk('account/fetchAccount', async (body) => {
    try {
        const response = await getAccount(body.token);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

const accountSlice = createSlice({
    name: "account",
    initialState: {
        displayAccountForm: false,
        addAccountInProcess: false,
        fetchAccountInProcess: false,
        accountList: []
    },
    reducers: {
        showAccountForm: (state) => {
            state.displayAccountForm = true;
        },
        closeAccountForm: (state) => {
            state.displayAccountForm = false;
        }
    },
    extraReducers: {
        [addAccount.pending]: (state) => {
            state.addAccountInProcess = true;
        },
        [addAccount.fulfilled]: (state, action) => {
            if (action.payload.message === "success") {
                notifications.show({
                    title: 'Account Added',
                    message: 'Contul tău a fost adăugat cu succes!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                });
            } else {
                notifications.show({
                    title: action.payload.message,
                    message: 'Te rugăm să încerci din nou!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            }
            state.addAccountInProcess = false;
            state.displayAccountForm = false;
        },
        [addAccount.rejected]: (state, action) => {
            state.addAccountInProcess = false;
            notifications.show({
                title: "Account Creation Failed",
                message: action.error.message || 'Te rugăm să încerci din nou!!!',
                radius: "lg",
                color: "red",
                autoClose: 5000,
            });
        },
        [fetchAccount.pending]: (state) => {
            state.fetchAccountInProcess = true;
        },
        [fetchAccount.fulfilled]: (state, action) => {
            if (action.payload.message === "success") {
                state.accountList = action.payload.data;
            } else {
                console.log(action.payload.message);
            }
            state.fetchAccountInProcess = false;
        },
        [fetchAccount.rejected]: (state, action) => {
            state.fetchAccountInProcess = false;
            console.log("Account fetch failed");
        },
        [changeAccount.pending]: () => {
            console.log("Account update pending");
        },
        [changeAccount.fulfilled]: (state, action) => {
            if (action.payload.message === "success") {
                notifications.show({
                    title: 'Account Updated',
                    message: 'Contul tău a fost actualizat cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                });
            } else {
                console.log(action.payload.message);
                notifications.show({
                    title: action.payload.message,
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            }
        },
        [changeAccount.rejected]: () => {
            console.log("Actualizarea contului a eșuat");
            notifications.show({
                title: "Account Update Failed",
                message: 'Te rugăm să încerci din nou!!',
                radius: "lg",
                color: "red",
                autoClose: 5000,
            });
        },
        [removeAccount.pending]: () => {
            console.log("Account delete pending");
        },
        [removeAccount.fulfilled]: (state, action) => {
            if (action.payload.message === "success") {
                notifications.show({
                    title: 'Account Deleted',
                    message: 'Contul tău a fost șters cu succes!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                });
            } else {
                console.log(action.payload.message);
                notifications.show({
                    title: action.payload.message,
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            }
        },
        [removeAccount.rejected]: () => {
            console.log("Account Delete failed");
            notifications.show({
                title: "Ștergerea contului a eșuat",
                message: 'Te rugăm să încerci din nou!!',
                radius: "lg",
                color: "red",
                autoClose: 5000,
            });
        },
    }
});

export const { showAccountForm, closeAccountForm } = accountSlice.actions;

export default accountSlice;
