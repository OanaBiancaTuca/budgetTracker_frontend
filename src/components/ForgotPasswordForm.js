import {
    TextInput,
    Title,
    Text,
    Modal,
    Group,
    Button,
    Container, LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {newPassword, sendVerificationCodeForFP, verifyCode} from "../features/userSlice";
import {useDispatch,useSelector} from "react-redux";
import {useState} from "react";


export default function ForgotPasswordForm(props) {
    const forgotPasswordInProgress = useSelector(state => state.user.forgotPasswordInProgress)
    const displayMailForm = useSelector(state => state.user.displayMailForm)
    const displayOtpForm = useSelector(state => state.user.displayOtpForm)
    const displayPasswordForm = useSelector(state => state.user.displayPasswordForm)
    const [formValues,setFormValues] = useState({});
    const dispatch = useDispatch();

    const mailForm = useForm({
        initialValues: {
            email: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalid')
        }
    });

    const otpForm = useForm({
        initialValues: {
            otp: ''
        },

        validate: {
            otp: (value) => (value.length===6 ? null : 'Introdu un OTP valid'
            )
        },
    });

    const passwordForm = useForm({
        initialValues: {
            password: '',
            confirmPassword: ''
        },

        validate: {
            password: (value) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/.test(value) ? null : 'Necesită cel puțin o literă mică, o literă mare, o cifră și un caracter special.'
            ),
            confirmPassword: (value, {password}) => (
                value === password ? null : 'Parolele nu se potrivesc'
            )
        },
    });

    function handleRestPassword(){
        console.log("formValues",formValues)
        dispatch(newPassword({...formValues,password:passwordForm.values.password}))
    }

    function handleVerifyCode(){
        dispatch(verifyCode({otp:otpForm.values.otp,email:formValues.email}))
    }

    function handleSendVerificationCode(){
        setFormValues({...formValues,email:mailForm.values.email})
        dispatch(sendVerificationCodeForFP({email:mailForm.values.email}))
    }

    return (
        <Modal withCloseButton={false} radius="lg" size="sm" opened={props.open} onClose={() => { props.close() }} centered>
            <LoadingOverlay visible={forgotPasswordInProgress} overlayBlur={2} />
            <Title size="32" align="center">Resetează parola</Title>
            <Container size="md">
                {displayMailForm &&
                    <div>
                        <Text style={{ marginTop: 10 }} size="md" c="dimmed">Enter Email to Generate OTP</Text>
                        <form onSubmit={mailForm.onSubmit((values) => handleSendVerificationCode())}>
                            <TextInput radius="md" style={{marginTop: 16}}
                                       withAsterisk
                                       label="Email"
                                       placeholder="your@email.com"
                                       type='email'
                                       {...mailForm.getInputProps('email')}
                            />
                            <Group style={{marginTop: 36, marginBottom: 10}}>
                                <Button radius="md" fullWidth type="submit"  style={{marginTop:5, background:"#004d00"}}>Continuă</Button>
                            </Group>
                        </form>
                    </div>
                }
                {displayOtpForm &&
                    <div>
                        <Text style={{ marginTop: 10 }} size="md" c="dimmed">Introdu codul de securitate</Text>
                        <form onSubmit={otpForm.onSubmit((values) => handleVerifyCode())}>
                            <TextInput radius="md" style={{marginTop: 16}}
                                       withAsterisk
                                       label="Enter Security Code"
                                       placeholder="Ex: 001666"
                                       type='otp'
                                       {...otpForm.getInputProps('otp')}
                            />
                            <Group style={{marginTop: 36, marginBottom: 10}}>
                                <Button radius="md" fullWidth type="submit"  style={{marginTop:5, background:"#004d00"}}>Verifică codul</Button>
                            </Group>
                        </form>
                    </div>
                }
                {displayPasswordForm &&
                    <div>
                        <Text style={{ marginTop: 10 }} size="md" c="dimmed">Setează noua parolă</Text>
                        <form onSubmit={passwordForm.onSubmit((values) => handleRestPassword())}>
                            <TextInput radius="md" style={{marginTop: 16}}
                                       withAsterisk
                                       label="Noua parolă"
                                       placeholder="parola"
                                       type='password'
                                       {...passwordForm.getInputProps('password')}
                            />
                            <TextInput radius="md" style={{marginTop: 16}}
                                       withAsterisk
                                       label="parola"
                                       placeholder="Confirmă paroola"
                                       type='password'
                                       {...passwordForm.getInputProps('confirmPassword')}
                            />
                            <Group style={{marginTop: 36, marginBottom: 10}}>
                                <Button radius="md" fullWidth type="submit"  style={{marginTop:5, background:"#004d00"}}>Trimite</Button>
                            </Group>
                        </form>
                    </div>
                }
            </Container>
        </Modal>
    )
}