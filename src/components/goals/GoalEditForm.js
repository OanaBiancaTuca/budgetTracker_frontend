import {
    TextInput,
    Title,
    Modal,
    Button,
    Container,
    Grid, Text, LoadingOverlay, Loader, Select
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {addGoal, editGoal, fetchGoal, removeGoal} from "../../features/goalSlice";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {DatePickerInput} from "@mantine/dates";

export default function GoalEditForm(props){
    const dispatch = useDispatch()
    const token  = useSelector(state => state.user.token)
    const addGoalInProcess = useSelector(state => state.goal.addGoalInProcess)
    const [showDelete,setShowDelete] = useState(false);
    const form = useForm({
        initialValues: {
            name: '',
            description: '',
            targetAmount: '',
            status: '',
            targetDate: new Date()
        },
        validate: {
            name: (value) => (
                value !== '' ? null : 'Numele este obligatoriu'
            ),
            targetAmount: (value) => (
                value !== '' ? null : 'Suma este obligatorie'
            )
        }
    });
    useEffect(()=>{
        form.setFieldValue('name',props?.element?.name)
        form.setFieldValue('description',props?.element?.description)
        form.setFieldValue('targetAmount',props?.element?.targetAmount)
        const date = new Date(props?.element?.targetDate)
        form.setFieldValue('targetDate',date)
        form.setFieldValue('status',props?.element?.status)
    },[])
    async function handleSubmit(){
        await dispatch(editGoal({...form.values,goalId:props.element.id,token:token,targetDate:form.values.targetDate.getTime()}))
        await dispatch(fetchGoal({token:token}))
        form.reset()
        props.close()
    }

    async function handleDelete(){
        await dispatch(removeGoal({goalId:props.element.id,token:token}))
        await dispatch(fetchGoal({token:token}))
        form.reset()
        setShowDelete(false)
        props.close()
    }

    return(
        <Modal overlayProps={{
            color: "white",
            opacity: 0.55,
            blur: 3,
        }} radius="lg" withCloseButton={false} closeOnClickOutside={false} size="sm" opened={props.open} onClose={() => { props.close() }} centered>
            <LoadingOverlay visible={addGoalInProcess} overlayBlur={2}/>
            <Title style={{ marginLeft: 10 }} order={3}>Editare Obiectiv</Title>
            <Container size="md">
                <form onSubmit={form.onSubmit((values) => handleSubmit())}>
                    <TextInput radius="md" style={{ marginTop: 16 }}
                               withAsterisk
                               label="Nume"
                               placeholder="Ex: O masina noua"
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
                        style={{marginTop: 16}}
                        label="Target Date"
                        {...form.getInputProps('targetDate')}
                    />
                    <Select radius="md" style={{ marginTop: 16 }}
                            label="Status"
                            withAsterisk
                            placeholder="Selectează statusul"
                            data={[{value:"Pending",label:"În așteptare"},{value:"Completed",label:"Complet"}]}
                            {...form.getInputProps('status')}
                    />
                    <Grid style={{marginTop:16,marginBottom:8}} gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
                        <Grid.Col span={"auto"}>
                            <Button radius="md" color="red" fullWidth onClick={() => setShowDelete(true)} >Șterge</Button>
                        </Grid.Col>
                        <Grid.Col span={"auto"}>
                            <Button radius="md" variant={"default"} fullWidth onClick={() => props.close()}>Anulează</Button>
                        </Grid.Col>
                        <Grid.Col span={"auto"}>
                            <Button radius="md" fullWidth type="submit" style={{background:"#004d00"}}>Salvează</Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Container>
            <Modal
                overlayProps={{
                    color: "red",
                    blur: 3,
                }}
                size="auto" withinPortal={true} closeOnClickOutside={false} trapFocus={false} withOverlay={false} opened={showDelete} onClose={() => setShowDelete(false)} radius="lg" centered  withCloseButton={false} title="Confirm Delete">
                <Text size={"sm"} c={"dimmed"} style={{marginBottom:10}}>Vei șterge acest obiectiv!</Text>
                <Grid
                >
                    <Grid.Col span={"auto"}>
                        <Button radius="md" variant={"default"} fullWidth  onClick={() => setShowDelete(false)}>
                            Nu, Anulează
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={"auto"}>
                        <Button color={"red"} onClick={()=> handleDelete()} radius="md" fullWidth type="submit">
                            Da, Șterge
                        </Button>
                    </Grid.Col>
                </Grid>
            </Modal>
        </Modal>
    )
}