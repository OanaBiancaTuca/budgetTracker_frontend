import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createGoal, deleteGoal, getGoal, updateGoal } from "../api/goalService";
import _ from "lodash";
import { notifications } from "@mantine/notifications";
import { ReactComponent as SuccessIcon } from "../assets/success-icon.svg";

export const addGoal =
    createAsyncThunk('goal/addGoal', async (body) => {
        return createGoal(
            body.token,
            body
        ).then((res) => {
            return res.data
        }).catch((err) => {
            return err.response.date
        })
    })

export const editGoal =
    createAsyncThunk('goal/editGoal', async (body) => {
        return updateGoal(
            body.token,
            body
        ).then((res) => {
            return res.data
        }).catch((err) => {
            return err.response.date
        })
    })

export const removeGoal =
    createAsyncThunk('goal/removeGoal', async (body) => {
        return deleteGoal(
            body.token,
            body.goalId
        ).then((res) => {
            return res.data
        }).catch((err) => {
            return err.response.date
        })
    })

export const fetchGoal =
    createAsyncThunk('goal/fetchGoal', async (body) => {
        return getGoal(
            body.token
        ).then((res) => {
            return res.data
        }).catch((err) => {
            return err.response.date
        })
    })

const goalSlice = createSlice({
    name: "goal", initialState: {
        displayGoalForm: false,
        addGoalInProcess: false,
        addGoalEditInProcess: false,
        fetchGoalInProcess: false,
        goalList: []
    }, reducers: {
        showGoalForm: (state) => {
            state.displayGoalForm = true
        },
        closeGoalForm: (state) => {
            state.displayGoalForm = false
        }
    },
    extraReducers: {
        [addGoal.pending]: (state) => {
            state.addGoalInProcess = true
        },
        [addGoal.fulfilled]: (state, action) => {
            state.addGoalInProcess = false
            if (action.payload?.message === "success") {
                console.log("Obiectiv creat")
                notifications.show({
                    title: 'Obiectiv creat',
                    message: `Obiectiv creat cu succes!! Predicție: ${(action.payload.prediction / 30).toFixed(1)} luni.`,
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color: "green",
                })
            } else if (_.isEmpty(action.payload)) {
                notifications.show({
                    title: "Ceva nu a mers bine",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                })
            } else {
                notifications.show({
                    title: action.payload?.message,
                    message: action.payload?.message,
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                })
            }
            state.displayGoalForm = false
        },
        [addGoal.rejected]: (state) => {
            state.addGoalInProcess = false
            console.log("Crearea obiectivului eșuată")
            alert("Încearcă din nou!")
        },
        [editGoal.pending]: (state) => {
            state.addGoalEditInProcess = true
        },
        [editGoal.fulfilled]: (state, action) => {
            state.addGoalEditInProcess = false
            if (action.payload?.message === "success") {
                notifications.show({
                    title: 'Obiectiv actualizat',
                    message: 'Obiectiv updatat cu succes!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color: "green",
                })
            } else if (_.isEmpty(action.payload)) {
                notifications.show({
                    title: "Ceva nu a mers bine",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                })
            } else {
                notifications.show({
                    title: action.payload?.message,
                    message: action.payload?.message,
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                })
            }
        },
        [editGoal.rejected]: (state) => {
            state.addGoalEditInProcess = false
            alert("Updatarea a eșuat")
        },
        [removeGoal.pending]: (state) => {
            console.log("Goal Add pending")
        },
        [removeGoal.fulfilled]: (state, action) => {
            if (action.payload?.message === "success") {
                notifications.show({
                    title: 'Obiectiv șters',
                    message: 'Obiectiv șters cu success!!',
                    icon: <SuccessIcon />,
                    radius: "lg",
                    autoClose: 5000,
                    color: "green",
                })
            } else if (_.isEmpty(action.payload)) {
                notifications.show({
                    title: "Ceva nu a mers bine",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                })
            } else {
                notifications.show({
                    title: action.payload?.message,
                    message: action.payload?.message,
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                })
            }
        },
        [removeGoal.rejected]: (state) => {
            console.log("Goal remove failed")
            alert("Încearcă din nou")
        },
        [fetchGoal.pending]: (state) => {
            state.fetchGoalInProcess = true
            console.log("Goal fetch pending")
        },
        [fetchGoal.fulfilled]: (state, action) => {
            if (action.payload.message === "success") {
                console.log(state.goalList)
                state.goalList = action.payload.data
                console.log("Goal fetched")
                console.log(state.goalList)
            } else {
                console.log(action.payload.message)
            }
            state.fetchGoalInProcess = false
        },
        [fetchGoal.rejected]: (state) => {
            state.fetchGoalInProcess = false
            console.log("Goal fetch failed")
        },
    }
})

export const { showGoalForm, closeGoalForm } = goalSlice.actions;

export default goalSlice;
