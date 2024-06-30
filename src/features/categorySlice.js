import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createCategory, getCategory} from "../api/categoryService";
import {notifications} from "@mantine/notifications";
import {ReactComponent as SuccessIcon} from "../assets/success-icon.svg";

export const addCategory =
    createAsyncThunk('category/addCategory',async (body)=>{
        return  createCategory(
            body.token,
            body.name,
            body.description,
            body.type
        ).then((res) =>{
            return res.data
        }).catch((err) =>{
            return err.response.date
        })
    })

export const fetchCategory =
    createAsyncThunk('category/fetchCategory',async (body)=>{
        return  getCategory(
            body.token
        ).then((res) =>{
            return res.data
        }).catch((err) =>{
            return err.response.date
        })
    })


const categorySlice = createSlice({
    name: "category", initialState: {
        displayCategoryForm:false,
        addCategoryInProcess:false,
        fetchCategoryInProcess:false,
        categoryList: []
    }, reducers: {
        showCategoryForm: (state) => {
            state.displayCategoryForm = true
        },
        closeCategoryForm:(state) =>{
            state.displayCategoryForm = false
        }
    },
    extraReducers:{
        [addCategory.pending]:(state) => {
            state.addCategoryInProcess = true
            console.log("pending")
        },
        [addCategory.fulfilled]:(state,action) =>{
            if(action.payload.message ==="success"){
                notifications.show({
                    title: 'Categorie adăugată',
                    message: 'Categorie adăugată cu succes!!',
                    icon: <SuccessIcon />,
                    radius:"lg",
                    autoClose: 5000,
                    color:"green",
                })
            }else {
                notifications.show({
                    title: action.payload.message,
                    message: 'Te rugăm să încerci din nou!!',
                    radius:"lg",
                    color:"red",
                    autoClose: 5000,
                })
            }
            state.addCategoryInProcess =false
            state.displayCategoryForm = false
        },
        [addCategory.rejected]:(state)=>{
            state.addCategoryInProcess = false
            notifications.show({
                title: "Crearea categoriei a eșuat",
                message: 'Te rugăm să încerci din nou!!',
                radius:"lg",
                color:"red",
                autoClose: 5000,
            })
        },
        [fetchCategory.pending]:(state) => {
            state.fetchCategoryInProcess = true
        },
        [fetchCategory.fulfilled]:(state,action) =>{
            if(action.payload.message ==="success"){

                state.categoryList = action.payload.data
                
            }else {
                console.log(action.payload.message)
            }
            state.fetchCategoryInProcess =false
        },
        [fetchCategory.rejected]:(state)=>{
            state.fetchCategoryInProcess = false
         
        },
    }
})

export const {showCategoryForm,closeCategoryForm} = categorySlice.actions;

export default categorySlice;