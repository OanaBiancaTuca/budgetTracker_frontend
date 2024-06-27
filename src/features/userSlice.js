import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    createAccountService,
    loginAccountService,
    validateTokenService,
    editNameService,
    editEmailService,
    editPasswordService,
    editImageService,
    verifySecurityCode,
    sendVerificationSecurityCode,
    sendVerificationSecurityCodeForFP,
    resetPassword
} from "../api/userService";
import { notifications } from "@mantine/notifications";
import { ReactComponent as SuccessIcon } from "../assets/success-icon.svg";

// Thunks for user actions
export const createAccount = createAsyncThunk('user/createAccount', async (body) => {
    return createAccountService(body.firstName, body.lastName, body.email, body.password)
        .then((response) => response.data)
        .catch((error) => error.response.data);
});

export const loginAccount = createAsyncThunk('user/loginAccount', async (body) => {
    return loginAccountService(body.email, body.password)
        .then((response) => response.data)
        .catch((error) => error.response.data);
});

export const validateToken = createAsyncThunk('user/validateToken', async (token) => {
    return validateTokenService(token)
        .then((response) => response.data)
        .catch((error) => error.response.data);
});

export const sendVerificationCode = createAsyncThunk('user/sendVerificationCode', async (body) => {
    return sendVerificationSecurityCode(body.email)
        .then((response) => response)
        .catch((error) => error.response);
});

export const sendVerificationCodeForFP = createAsyncThunk('user/sendVerificationCodeForFP', async (body) => {
    return sendVerificationSecurityCodeForFP(body.email)
        .then((response) => response)
        .catch((error) => error.response);
});

export const newPassword = createAsyncThunk('user/newPassword', async (body) => {
    return resetPassword(body.email, body.password)
        .then((response) => response)
        .catch((error) => error.response);
});

export const verifyCode = createAsyncThunk('user/verifyCode', async (body) => {
    return verifySecurityCode(body.email, body.otp)
        .then((response) => response)
        .catch((error) => error.response);
});

export const editName = createAsyncThunk('user/editName', async (body) => {
    return editNameService(body.token, body.firstName, body.lastName)
        .then((res) => res.data)
        .catch((err) => err.response);
});

export const editEmail = createAsyncThunk('user/editEmail', async (body) => {
    return editEmailService(body.token, body.email)
        .then((res) => res.data)
        .catch((err) => err.response.data);
});

export const editPassword = createAsyncThunk('user/editPassword', async (body) => {
    return editPasswordService(body.token, body.oldPassword, body.password)
        .then((res) => res.data)
        .catch((err) => err.response.data.message);
});

export const editImage = createAsyncThunk('user/editImage', async (body) => {
    return editImageService(body.token, body.image)
        .then((res) => res.data)
        .catch((err) => err.response.data.message);
});

// Initial state
const initialState = {
    currentUser: {
        firstName: '',
        lastName: '',
        email: '',
        userId: '',
        profileImage: '',
    },
    token: null,
    displaySignupForm: false,
    displaySigninForm: false,
    displayForgotPasswordForm: false,
    signupInProgress: false,
    signinInProgress: false,
    displayUserDetailsForm: true,
    displayOtpForm: false,
    displayPasswordForm: false,
    displayMailForm: true,
    forgotPasswordInProgress: false,
    signupError: null,
    loginError: null,
};

// User slice
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logoutAccount: () => initialState,
        openSignupForm: (state) => { state.displaySignupForm = true },
        openSigninForm: (state) => { state.displaySigninForm = true },
        openForgotPasswordForm: (state) => {
            state.displaySigninForm = false;
            state.displayForgotPasswordForm = true;
            state.displayMailForm = true;
            state.displayOtpForm = false;
            state.displayPasswordForm = false;
        },
        closeForgotPasswordForm: (state) => { state.displayForgotPasswordForm = false },
        closeSignupForm: (state) => { state.displaySignupForm = false },
        closeSigninForm: (state) => { state.displaySigninForm = false },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.pending, (state) => { state.signupInProgress = true })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.signupInProgress = false;
                if (action.payload.message === "success") {
                    state.displaySignupForm = false;
                    state.displayUserDetailsForm = true;
                    state.displayOtpForm = false;
                    state.displayPasswordForm = false;
                    notifications.show({
                        title: 'Account Created Successfully',
                        message: 'Cont creat cu succes! Te poti loga în cont utilizând emailul și parola!',
                        icon: <SuccessIcon />,
                        radius: "lg",
                        autoClose: 5000,
                    });
                } else {
                    notifications.show({
                        title: action.payload.message,
                        message: 'Te rugăm să încerci din nou!!',
                        radius: "lg",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            })
            .addCase(createAccount.rejected, (state) => {
                state.signupInProgress = false;
                notifications.show({
                    title: 'Request Failed',
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            })
            .addCase(loginAccount.pending, (state) => { state.signinInProgress = true })
            .addCase(loginAccount.fulfilled, (state, action) => {
                state.signinInProgress = false;
                if (action.payload.message === "success") {
                    state.token = action.payload.data.token;
                    state.displaySigninForm = false;
                } else {
                    notifications.show({
                        title: action.payload.message,
                        message: 'Te rugăm să încerci din nou!!',
                        radius: "lg",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            })
            .addCase(loginAccount.rejected, (state) => {
                state.signinInProgress = false;
                notifications.show({
                    title: "Something went wrong ",
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            })
            .addCase(validateToken.fulfilled, (state, action) => {
                if (action.payload.message === "success") {
                    const userData = action.payload.data.user;
                    state.currentUser = {
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        userId: userData.userId,
                        profileImage: userData.profileImage,
                    };
                } else {
                    state.token = null;
                    notifications.show({
                        title: action.payload.message,
                        message: 'Te rog, loghează-te din nou!!',
                        radius: "lg",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            })
            .addCase(validateToken.rejected, (state) => {
                state.token = null;
                notifications.show({
                    title: 'Session expired',
                    message: 'Te rog, loghează-te din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            })
            .addCase(sendVerificationCode.fulfilled, (state, action) => {
                state.signupInProgress = false;
                if (action.payload?.status === 200) {
                    state.displayUserDetailsForm = false;
                    state.displayOtpForm = true;
                    notifications.show({
                        title: 'Verification Code Sent',
                        message: 'Codul de verificare a fost trimis pe email!',
                        icon: <SuccessIcon />,
                        radius: "lg",
                        autoClose: 5000,
                    });
                } else {
                    notifications.show({
                        title: action.payload?.data?.message,
                        message: 'Te rugăm să încerci din nou!!',
                        radius: "lg",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            })
            .addCase(sendVerificationCode.rejected, (state) => {
                state.signupInProgress = false;
                notifications.show({
                    title: 'Request Failed',
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            })
            .addCase(verifyCode.fulfilled, (state, action) => {
                state.signupInProgress = false;
                state.forgotPasswordInProgress = false;
                if (action.payload.status === 200) {
                    state.displayOtpForm = false;
                    state.displayPasswordForm = true;
                    notifications.show({
                        title: 'Verified Successfully',
                        message: 'Email verificat cu succes!',
                        icon: <SuccessIcon />,
                        radius: "lg",
                        autoClose: 5000,
                    });
                } else {
                    notifications.show({
                        title: action.payload.message,
                        message: 'Te rugăm să încerci din nou!!',
                        radius: "lg",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            })
            .addCase(verifyCode.rejected, (state) => {
                state.signupInProgress = false;
                state.forgotPasswordInProgress = false;
                notifications.show({
                    title: 'Request Failed',
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            })
            .addCase(newPassword.fulfilled, (state, action) => {
                state.forgotPasswordInProgress = false;
                if (action.payload.status === 200) {
                    state.displayForgotPasswordForm = false;
                    state.displayOtpForm = false;
                    state.displayPasswordForm = false;
                    state.displayMailForm = true;
                    notifications.show({
                        title: 'Password Reset Successfully',
                        message: 'Acum vă puteți loga cu noua parolă!',
                        icon: <SuccessIcon />,
                        radius: "lg",
                        autoClose: 5000,
                    });
                } else {
                    notifications.show({
                        title: action.payload.message,
                        message: 'Te rugăm să încerci din nou!!',
                        radius: "lg",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            })
            .addCase(newPassword.rejected, (state) => {
                state.forgotPasswordInProgress = false;
                notifications.show({
                    title: 'Request Failed',
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            })
            .addCase(sendVerificationCodeForFP.fulfilled, (state, action) => {
                state.forgotPasswordInProgress = false;
                if (action.payload?.status === 200) {
                    state.displayMailForm = false;
                    state.displayOtpForm = true;
                    notifications.show({
                        title: 'Verification Code Sent',
                        message: 'Codul de verificare a fost trimis pe email!',
                        icon: <SuccessIcon />,
                        radius: "lg",
                        autoClose: 5000,
                    });
                } else {
                    notifications.show({
                        title: action.payload?.data?.message,
                        message: 'Te rugăm să încerci din nou!!',
                        radius: "lg",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            })
            .addCase(sendVerificationCodeForFP.rejected, (state) => {
                state.forgotPasswordInProgress = false;
                notifications.show({
                    title: 'Request Failed',
                    message: 'Te rugăm să încerci din nou!!',
                    radius: "lg",
                    color: "red",
                    autoClose: 5000,
                });
            });
    }
});

// Export actions
export const {
    logoutAccount,
    openSignupForm,
    openSigninForm,
    closeSignupForm,
    closeSigninForm,
    openForgotPasswordForm,
    closeForgotPasswordForm,
} = userSlice.actions;

export default userSlice.reducer;
