import {
    Grid,
    TextInput,
    Title,
    Text,
    Modal,
    Group,
    Button,
    Container,
    LoadingOverlay
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useDispatch, useSelector} from "react-redux";
import {createAccount, sendVerificationCode, verifyCode} from "../features/userSlice";
import {useState} from "react";

export default function SignupForm(props) {
    const signupInProgress = useSelector(state => state.user.signupInProgress)
    const displayUserDetailsForm = useSelector(state => state.user.displayUserDetailsForm)
    const displayOtpForm = useSelector(state => state.user.displayOtpForm)
    const displayPasswordForm = useSelector(state => state.user.displayPasswordForm)
    const [formValues,setFormValues] = useState({});
    const dispatch = useDispatch()
    const userDetailsForm = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },

        validate: {
            firstName: (value) => (
                value !== '' ? null : 'Acest câmp este obligatoriu'
            ),
            lastName: (value) => (
                value !== '' ? null : 'Acest câmp este obligatoriu'
            ),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalid')
        },
    });

    const otpForm = useForm({
        initialValues: {
            otp: ''
        },

        validate: {
            otp: (value) => (value.length===6 ? null : 'Introdu OTP-ul valid'
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

    function handleCreateAccount(){
        dispatch(createAccount({...formValues,...passwordForm.values}))
        userDetailsForm.reset()
        otpForm.reset()
        passwordForm.reset()
    }

    function handleVerifyCode(){
        dispatch(verifyCode({otp:otpForm.values.otp,email:formValues.email}))
    }

    function handleSendVerificationCode(){
        setFormValues({...formValues,email:userDetailsForm.values.email,firstName:userDetailsForm.values.firstName,lastName:userDetailsForm.values.lastName})
        dispatch(sendVerificationCode({email:userDetailsForm.values.email}))
    }
    return (
        <Modal withCloseButton={false} radius="lg" size="sm" opened={props.open} onClose={() => {
            props.close()
        }} centered>
            <LoadingOverlay visible={signupInProgress} overlayBlur={2} />
            <Title size="32" align="center">Înregistrare</Title>
            <Container size="md">
                <Text style={{marginTop: 10}} size="md" c="dimmed">Completează câmpurile pentru a crea cont 
                    în aplicație </Text>
                {displayUserDetailsForm &&
                    <form onSubmit={userDetailsForm.onSubmit((values) => handleSendVerificationCode())}>
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput radius="md" style={{marginTop: 16}}
                                           withAsterisk
                                           label="Prenume"
                                           placeholder="Ex: Oana"
                                           type='firstName'
                                           {...userDetailsForm.getInputProps('firstName')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput radius="md" style={{marginTop: 16}}
                                           withAsterisk
                                           label="Nume"
                                           placeholder="Ex: Țucă"
                                           type='lastName'
                                           {...userDetailsForm.getInputProps('lastName')}
                                />
                            </Grid.Col>
                        </Grid>
                        <TextInput radius="md" style={{marginTop: 16}}
                                   withAsterisk
                                   label="Email"
                                   placeholder="tucaoana19@stud.ase.ro"
                                   type='email'
                                   {...userDetailsForm.getInputProps('email')}
                        />
                        <Group style={{marginTop: 36, marginBottom: 10}}>
                            <Button radius="md" fullWidth type="submit"  style={{marginTop:5, background:"#004d00"}}
                           >Continuă</Button>
                        </Group>
                    </form>
                }
                {displayOtpForm &&
                    <form onSubmit={otpForm.onSubmit((values) => handleVerifyCode())}>
                        <TextInput radius="md" style={{marginTop: 16}}
                                   withAsterisk
                                   label="Introdu codul de securitate"
                                   placeholder="Ex: 001666"
                                   type='otp'
                                   {...otpForm.getInputProps('otp')}
                        />
                        <Group style={{marginTop: 36, marginBottom: 10}}>
                            <Button radius="md" fullWidth type="submit" style={{marginTop:5, background:"#004d00"}}>Verifică Cod</Button>
                        </Group>
                    </form>
                }
                {displayPasswordForm &&
                    <form onSubmit={passwordForm.onSubmit((values) => handleCreateAccount())}>
                        <TextInput radius="md" style={{marginTop: 16}}
                                   withAsterisk
                                   label="Parolă"
                                   placeholder="parola"
                                   type='password'
                                   {...passwordForm.getInputProps('password')}
                        />
                        <TextInput radius="md" style={{marginTop: 16}}
                                   withAsterisk
                                   label="Confirmă Parola"
                                   placeholder="parola"
                                   type='password'
                                   {...passwordForm.getInputProps('confirmPassword')}
                        />
                        <Group style={{marginTop: 36, marginBottom: 10}}>
                            <Button radius="md" fullWidth type="submit" style={{marginTop:5, background:"#004d00"}}>Crează cont</Button>
                        </Group>
                    </form>
                }
            </Container>
        </Modal>
    )
}