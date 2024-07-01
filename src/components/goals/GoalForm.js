import {
    TextInput,
    Title,
    Modal,
    Button,
    Container,
    Grid,
    Text,
    LoadingOverlay,
    Box,
    Group,
    Divider
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { addGoal, closeGoalForm, fetchGoal } from "../../features/goalSlice";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { DatePickerInput } from "@mantine/dates";

export default function GoalForm(props) {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    const addGoalInProcess = useSelector(state => state.goal.addGoalInProcess);
    const financialDetails = useSelector(state => state.goal.financialDetails);
    const [showDiscard, setShowDiscard] = useState(false);
    const [showPrediction, setShowPrediction] = useState(false);

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
                value !== '' ? null : 'Numele este obligatoriu'
            ),
            targetAmount: (value) => (
                value !== '' ? null : 'Valoarea țintă este obligatorie'
            )
        }
    });

    async function handleSubmit() {
        const result = await dispatch(addGoal({ ...form.values, token: token, targetDate: form.values.targetDate.getTime() }));
        if (result.payload?.message === "success") {
            await dispatch(fetchGoal({ token: token }));
            form.reset();
            setShowPrediction(true);
        }
    }

    function handleDiscard() {
        form.reset();
        setShowDiscard(false);
        dispatch(closeGoalForm());
    }

    function handleDiscardCancel() {
        setShowDiscard(false);
    }

    function handleClosePrediction() {
        setShowPrediction(false);
    }

    function formatPrediction(predictionInDays) {
        const months = predictionInDays / 30;
        if (months < 12) {
            return `${months.toFixed(1)} luni`;
        } else {
            const years = Math.floor(months / 12);
            const remainingMonths = (months % 12).toFixed(1);
            return `${years} an${years > 1 ? 'i' : ''} și ${remainingMonths} luni`;
        }
    }
    function formatNumber(value) {
        return new Intl.NumberFormat('ro-RO').format(value);
    }


    return (
        <>
            <Modal overlayProps={{
                color: "white",
                opacity: 0.55,
                blur: 3,
            }} radius="lg" size="sm" opened={props.open} onClose={() => { props.close(); setShowPrediction(false); }} centered>
                <LoadingOverlay visible={addGoalInProcess} overlayBlur={2} />
                <Title style={{ marginLeft: 10 }} order={3}>Adaugă obiectiv</Title>
                <Container size="md">
                    <form onSubmit={form.onSubmit((values) => handleSubmit())}>
                        <TextInput radius="md" style={{ marginTop: 16 }}
                            withAsterisk
                            label="Nume"
                            placeholder="Ex: Mașină nouă"
                            {...form.getInputProps('name')}
                        />
                        <TextInput radius="md" style={{ marginTop: 16 }}
                            label="Descriere"
                            placeholder="Ex: Îmi doresc o mașină nouă"
                            {...form.getInputProps('description')}
                        />
                        <TextInput radius="md" style={{ marginTop: 16 }}
                            withAsterisk
                            label="Valoare țintă"
                            placeholder="Ex: 50.000"
                            {...form.getInputProps('targetAmount')}
                        />
                        <DatePickerInput
                            radius="md"
                            style={{ marginTop: 16 }}
                            label="Data țintă"
                            {...form.getInputProps('targetDate')}
                        />
                        <Grid style={{ marginTop: 16, marginBottom: 8 }} gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
                            <Grid.Col span={"auto"}>
                                <Button radius="md" variant={"default"} fullWidth onClick={() => setShowDiscard(true)}>Anulează</Button>
                            </Grid.Col>
                            <Grid.Col span={"auto"}>
                                <Button radius="md" fullWidth type="submit" style={{ background: "#004d00", color: 'white' }}>Salvează</Button>
                            </Grid.Col>
                        </Grid>
                    </form>
                </Container>
                <Modal
                    overlayProps={{
                        color: "red",
                        blur: 3,
                    }}
                    size="auto" withinPortal={true} closeOnClickOutside={false} trapFocus={false} withOverlay={false} opened={showDiscard} onClose={handleDiscardCancel} radius="lg" centered withCloseButton={false} title="Confirmare anulare">
                    <Text size={"sm"} color={"dimmed"} style={{ marginBottom: 10 }}>Vei pierde toate datele introduse.</Text>
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
                size="lg" withinPortal={true} closeOnClickOutside={false} trapFocus={false} withOverlay={false} opened={showPrediction} onClose={handleClosePrediction} radius="lg" centered withCloseButton={false} title="Detalii Financiare">
                <Box p="md">
                    <Text size="md" color="dimmed" style={{ marginBottom: 10, textAlign: "center" }}>
                        După calculele aplicației, poți îndeplini obiectivul în: {financialDetails ? formatPrediction(financialDetails.prediction) : ''}
                    </Text>
                    <Divider my="sm" />
                    <Group position="center" spacing="md" mt="md">
                        <Box>
                            <Text align="center" size="lg" weight={700}>Venituri lunare medii</Text>
                            <Text align="center" size="xl" weight={500} mt="sm">{formatNumber(Math.round(financialDetails?.averageMonthlyIncome))} lei</Text>
                        </Box>
                        <Box>
                            <Text align="center" size="lg" weight={700}>Cheltuieli lunare medii</Text>
                            <Text align="center" size="xl" weight={500} mt="sm">{formatNumber(Math.round(financialDetails?.averageMonthlyExpenses))} lei</Text>
                        </Box>
                        <Box>
                            <Text align="center" size="lg" weight={700}>Economii lunare</Text>
                            <Text align="center" size="xl" weight={500} mt="sm">{formatNumber(Math.round(financialDetails?.monthlySavings))} lei</Text>
                        </Box>
                    </Group>
                    <Group position="center" mt="md">
                        <Button radius="md" onClick={handleClosePrediction}>
                            Confirmă
                        </Button>
                    </Group>
                </Box>
            </Modal>
        </>
    );
}
