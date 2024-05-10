import {
    TextInput,
    Title,
    Checkbox,
    Modal,
    Group,
    Button,
    Container,
    Grid, Text, LoadingOverlay
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addAccount, closeAccountForm, fetchAccount} from "../../features/accountSlice";
import {closeCategoryForm} from "../../features/categorySlice";

export default function AccountForm(props) {
    const dispatch = useDispatch()
    const token  = useSelector(state => state.user.token)
    const addAccountInProcess = useSelector(state => state.account.addAccountInProcess)
    const [showDiscard,setShowDiscard] = useState(false);
    const form = useForm({
        initialValues: {
            name:'',
            currentBalance: '',
            paymentTypes:''
        },
        validate: {
            name: (value) => (
                value !== '' ? null : 'Numele este obligatoriu'
            ),
            currentBalance: (value) => (
                value !== '' ? null : 'Introdu soldul'
            ),
            paymentTypes: (value) => (
                value !== '' ? null : 'Selectează cel puțin un tip'
            ),
        }
    });

    async function handleSubmit(){
        await dispatch(addAccount({...form.values,token:token}))
        await dispatch(fetchAccount({token:token}))
        form.reset()
    }

    function handleDiscard(){
        form.reset()
        setShowDiscard(false)
        dispatch(closeAccountForm())
    }

    function handleDiscardCancel(){
        setShowDiscard(false)
    }

    return (
        <Modal  overlayProps={{
            color: "white",
            opacity: 0.55,
            blur: 3,
        }} withCloseButton={false} closeOnClickOutside={false} radius="lg" size="sm" opened={props.open} onClose={() => { props.close() }} centered>
            <LoadingOverlay visible={addAccountInProcess} overlayBlur={2} />
            <Title style={{ marginLeft: 10 }} order={3}>Adaugă cont</Title>
            <Container size="md">
                <form onSubmit={form.onSubmit((values) => handleSubmit())}>
                    <TextInput radius="md" style={{ marginTop: 16 }}
                        withAsterisk
                        label="Nume"
                        placeholder="Ex: ING Bank"
                        type='text'
                        {...form.getInputProps('name')}
                    />
                    <TextInput radius="md" style={{ marginTop: 16 }}
                        withAsterisk
                        label="Sold"
                        placeholder="Ex: 5.000"
                        type='number'
                        {...form.getInputProps('currentBalance')}
                    />
                    <Checkbox.Group style={{marginTop:16}}
                        {...form.getInputProps('paymentTypes')}
                        label="Payment Type"
                        withAsterisk
                    >
                        <Group style={{marginTop:10}} mt="xs">
                            <Checkbox  value="UPI" label="UPI" />
                            <Checkbox  value="Debit Card" label="Debit Card" />
                            <Checkbox  value="Credit Card" label="Credit Card" />
                            <Checkbox  value="Net Banking" label="Net Banking" />
                        </Group>
                    </Checkbox.Group>
                    <Grid style={{marginTop:16,marginBottom:8}} gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
                        <Grid.Col span={"auto"}>
                        <Button radius="md" variant={"default"} onClick={() => setShowDiscard(true)} fullWidth>Renunță</Button>
                        </Grid.Col>
                        <Grid.Col span={"auto"}>
                        <Button radius="md" fullWidth type="submit"  style={{ background:"#004d00"}}>Salvează</Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Container>
            <Modal
                overlayProps={{
                    color: "red",
                    blur: 3,
                }}
                size="auto" withinPortal={true} closeOnClickOutside={false} trapFocus={false} withOverlay={false} opened={showDiscard} onClose={handleDiscardCancel} radius="lg" centered  withCloseButton={false} title="Confirm Discard">
                <Text size={"sm"} c={"dimmed"} style={{marginBottom:10}}>Se va pierde tot conținutul completat</Text>
                <Grid
                >
                    <Grid.Col span={"auto"}>
                        <Button radius="md" color="gray" fullWidth  onClick={() => setShowDiscard(false)}>
                            Nu
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={"auto"}>
                        <Button color={"red"} onClick={()=> handleDiscard()} radius="md" fullWidth type="submit">
                            Da
                        </Button>
                    </Grid.Col>
                </Grid>
            </Modal>
        </Modal>
    )
}