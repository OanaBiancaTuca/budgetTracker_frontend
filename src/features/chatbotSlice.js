import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    status: 'idle',
    error: null
};

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        }
    }
});

export const { addMessage } = chatbotSlice.actions;

export default chatbotSlice.reducer;
