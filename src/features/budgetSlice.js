import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBudget, deleteBudget, getBudget, updateBudget, resetBudgetAmount, updateBudgetTime } from "../api/budgetService";
import _ from "lodash";
import { notifications } from "@mantine/notifications";
import { ReactComponent as SuccessIcon } from "../assets/success-icon.svg";

export const addBudget = createAsyncThunk('budget/addBudget', async (body) => {
    return createBudget(body.token, body.categoryId, body.amount).then((res) => {
        return res.data;
    }).catch((err) => {
        return err.response.date;
    });
});

export const editBudget = createAsyncThunk('budget/editBudget', async (body) => {
    return updateBudget(body.token, body.budgetId, body.categoryId, body.amount).then((res) => {
        return res.data;
    }).catch((err) => {
        return err.response.date;
    });
});

export const removeBudget = createAsyncThunk('budget/removeBudget', async (body) => {
    return deleteBudget(body.token, body.budgetId).then((res) => {
        return res.data;
    }).catch((err) => {
        return err.response.date;
    });
});

export const fetchBudget = createAsyncThunk('budget/fetchBudget', async (body) => {
    return getBudget(body.token).then((res) => {
        return res.data;
    }).catch((err) => {
        return err.response.date;
    });
});

export const resetBudget = createAsyncThunk('budget/resetBudget', async (body) => {
    return resetBudgetAmount(body.token, body.id).then((res) => {
        return res.data;
    }).catch((err) => {
        return err.response.date;
    });
});

export const updateBudgetTimeAction = createAsyncThunk('budget/updateBudgetTime', async (body) => {
    return updateBudgetTime(body.token, body.budgetId, body.amount, body.used, body.balance).then((res) => {
        return res.data;
    }).catch((err) => {
        return err.response.date;
    });
});

const budgetSlice = createSlice({
    name: "budget", initialState: {
        displayBudgetForm: false,
        addBudgetInProcess: false,
        addBudgetEditInProcess: false,
        fetchBudgetInProcess: false,
        budgetList: []
    }, reducers: {
        showBudgetForm: (state) => {
            state.displayBudgetForm = true;
        },
        closeBudgetForm: (state) => {
            state.displayBudgetForm = false;
        }
    },
    extraReducers: {
        [addBudget.pending]: (state) => {
            state.addBudgetInProcess = true;
        },
        [addBudget.fulfilled]: (state, action) => {
            state.addBudgetInProcess = false;
            if (action.payload?.message === "success") {
                notifications.show({
                    title: 'Buget creat',
                    message: 'Buget creat cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color:"green",
                });
            } else {
                notifications.show({
                    title: "Ceva nu a mers bine..",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            }
            state.displayBudgetForm = false;
        },
        [addBudget.rejected]: (state) => {
            state.addBudgetInProcess = false;
            alert("Crearea bugetului eșuată, încearcă din nou");
        },
        [editBudget.pending]: (state) => {
            state.addBudgetEditInProcess = true;
        },
        [editBudget.fulfilled]: (state, action) => {
            state.addBudgetEditInProcess = false;
            if (action.payload?.message === "success") {
                notifications.show({
                    title: 'Buget actualizat',
                    message: 'Buget updatat cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color:"green",
                });
            } else {
                notifications.show({
                    title: "Ceva nu a mers bine",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            }
        },
        [editBudget.rejected]: (state) => {
            state.addBudgetEditInProcess = false;
            alert("Ceva nu a mers bine, încercați din nou");
        },
        [removeBudget.pending]: (state) => {
            // Placeholder for any pending logic
        },
        [removeBudget.fulfilled]: (state, action) => {
            if (action.payload?.message === "success") {
                notifications.show({
                    title: 'Buget șters',
                    message: 'Buget șters cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color:"green",
                });
            } else {
                notifications.show({
                    title: "Ceva nu a mers bine",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            }
        },
        [removeBudget.rejected]: (state) => {
            alert("Ștergere buget eșuată, încercați din nou");
        },
        [fetchBudget.pending]: (state) => {
            state.fetchBudgetInProcess = true;
        },
        [fetchBudget.fulfilled]: (state, action) => {
            if (action.payload.message === "success") {
                state.budgetList = action.payload.data;
            }
            state.fetchBudgetInProcess = false;
        },
        [fetchBudget.rejected]: (state) => {
            state.fetchBudgetInProcess = false;
            alert("Budget fetch failed,Try again");
        },
        [resetBudget.pending]: (state) => {
            // Placeholder for any pending logic
        },
        [resetBudget.fulfilled]: (state, action) => {
            if (action.payload?.message === "success") {
                notifications.show({
                    title: 'Buget resetat',
                    message: 'Buget resetat cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color:"green",
                });
                state.budgetList = state.budgetList.map(budget =>
                    budget.id === action.payload.data.id ? action.payload.data : budget
                );
            } else {
                notifications.show({
                    title: "Ceva nu a mers bine",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            }
        },
        [resetBudget.rejected]: (state) => {
            alert("Resetare eșuată");
        },
        [updateBudgetTimeAction.pending]: (state) => {
            // Placeholder for any pending logic
        },
        [updateBudgetTimeAction.fulfilled]: (state, action) => {
            if (action.payload?.message === "success") {
                notifications.show({
                    title: 'Timp buget resetat cu succes',
                    message: 'Ora bugetului a fost actualizată cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color:"green",
                });
                state.budgetList = state.budgetList.map(budget =>
                    budget.id === action.payload.data.id ? action.payload.data : budget
                );
            } else {
                notifications.show({
                    title: "Ceva nu a mers bine",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            }
        },
        [updateBudgetTimeAction.rejected]: (state) => {
            alert("Budget time update failed,Try again");
        },
    }
});
export const { showBudgetForm, closeBudgetForm } = budgetSlice.actions;

export default budgetSlice;