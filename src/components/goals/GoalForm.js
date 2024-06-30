import {
    TextInput,
    Title,
    Modal,
    Button,
    Container,
    Grid, Text, LoadingOverlay
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { addGoal, closeGoalForm, fetchGoal } from "../../features/goalSlice";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { DatePickerInput } from "@mantine/dates";

export default function GoalForm(props) {
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    const addGoalInProcess = useSelector(state => state.goal.addGoalInProcess)
    const [showDiscard, setShowDiscard] = useState(false);
    const [showPrediction, setShowPrediction] = useState(false);
    const [predictionMonths, setPredictionMonths] = useState(0);

    const form = useForm({
        initialValues: {
            name: '',
            description: '',
            targetAmount: '',
            status: 'Pending',
            targetDate: new Date()
        },
        validate: {
            name: (value) => (
                value !== '' ? null : 'Name is required'
            ),
            targetAmount: (value) => (
                value !== '' ? null : 'Target Amount is required'
            )
        }
    });

    async function handleSubmit() {
        const result = await dispatch(addGoal({ ...form.values, token: token, targetDate: form.values.targetDate.getTime() }))
        if (result.payload?.prediction) {
            setPredictionMonths((result.payload.prediction / 30).toFixed(1));
            setShowPrediction(true);
        }
        await dispatch(fetchGoal({ token: token }))
        form.reset()
    }

    function handleDiscard() {
        form.reset()
        setShowDiscard(false)
        dispatch(closeGoalForm())
    }

    function handleDiscardCancel() {
        setShowDiscard(false)
    }

    return (
        <>
            <Modal overlayProps={{
                color: "white",
                opacity: 0.55,
                blur: 3,
            }} radius="lg" size="sm" opened={props.open} onClose={() => { props.close() }} centered>
                <LoadingOverlay visible={addGoalInProcess} overlayBlur={2} />
                <Title style={{ marginLeft: 10 }} order={3}>Adaugă obiectiv</Title>
                <Container size="md">
                    <form onSubmit={form.onSubmit((values) => handleSubmit())}>
                        <TextInput radius="md" style={{ marginTop: 16 }}
                            withAsterisk
                            label="Nume"
                            placeholder="Ex: Masina noua"
                            type='Goal Name'
                            {...form.getInputProps('name')}
                        />
                        <TextInput radius="md" style={{ marginTop: 16 }}
                            label="Descriere"
                            placeholder="Ex: Imi doresc o masina noua"
                            type='description'
                            {...form.getInputProps('description')}
                        />
                        <TextInput radius="md" style={{ marginTop: 16 }}
                            withAsterisk
                            label="Valoare țintă"
                            placeholder="Ex: 50.000"
                            type='amount'
                            {...form.getInputProps('targetAmount')}
                        />
                        <DatePickerInput
                            radius="md"
                            style={{ marginTop: 16 }}
                            label="Target Date"
                            {...form.getInputProps('targetDate')}
                        />
                        <Grid style={{ marginTop: 16, marginBottom: 8 }} gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
                            <Grid.Col span={"auto"}>
                                <Button radius="md" variant={"default"} fullWidth onClick={() => setShowDiscard(true)}>Anulează</Button>
                            </Grid.Col>
                            <Grid.Col span={"auto"}>
                                <Button radius="md" fullWidth type="submit" style={{ background: "#004d00" }} >Salvează</Button>
                            </Grid.Col>
                        </Grid>
                    </form>
                </Container>
                <Modal
                    overlayProps={{
                        color: "red",
                        blur: 3,
                    }}
                    size="auto" withinPortal={true} closeOnClickOutside={false} trapFocus={false} withOverlay={false} opened={showDiscard} onClose={handleDiscardCancel} radius="lg" centered withCloseButton={false} title="Confirm Discard">
                    <Text size={"sm"} c={"dimmed"} style={{ marginBottom: 10 }}>Vei pierde toate datele introduse</Text>
                    <Grid>
                        <Grid.Col span={"auto"}>
                            <Button radius="md" variant={"default"} fullWidth onClick={() => setShowDiscard(false)}>
                                Nu
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={"auto"}>
                            <Button color={"red"} onClick={() => handleDiscard()} radius="md" fullWidth type="submit">
                                Da
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Modal>
            </Modal>
            <Modal
                overlayProps={{
                    color: "white",
                    blur: 3,
                }}
                size="auto" withinPortal={true} closeOnClickOutside={false} trapFocus={false} withOverlay={false} opened={showPrediction} onClose={() => setShowPrediction(false)} radius="lg" centered withCloseButton={false} title="Predicție Economisire">
                <Text size={"sm"} c={"dimmed"} style={{ marginBottom: 10 }}>Dupa calculele aplicatiei este posibil sa economisesti in {predictionMonths} luni.</Text>
                <Grid>
                    <Grid.Col span={"auto"}>
                        <Button radius="md" variant={"default"} fullWidth onClick={() => setShowPrediction(false)}>
                            Confirm
                        </Button>
                    </Grid.Col>
                </Grid>
            </Modal>
        </>
    )
}
