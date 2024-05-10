import {Button, Grid, Title} from '@mantine/core';
import {useDispatch} from "react-redux";
import {showBudgetForm,closeBudgetForm} from "../../features/budgetSlice";


export default function BudgetHeader() {
    const dispatch = useDispatch()
    function handleBudgetFormClose() {
        dispatch(closeBudgetForm());
    }

    return (

            <div style={{marginBottom:10}}>
                <Grid>
                    <Grid.Col span={"content"}>
                        <Title style={{ margin: 5 }} order={2}>Bugete</Title>
                    </Grid.Col>
                    <Grid.Col span={"content"}>
                        <Button fullWidth radius="md" onClick={()=> dispatch(showBudgetForm())} style={{margin:8 , background:"#004d00"}}>
                            Adaugă Buget
                        </Button>
                    </Grid.Col>
                </Grid>

            </div>
    )
}