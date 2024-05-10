import { Grid, Title, Button } from '@mantine/core';
import {showGoalForm} from "../../features/goalSlice";
import {useDispatch} from "react-redux";
export default function GoalHeader() {
    const dispatch = useDispatch()
    return (
        <div style={{marginBottom:10}}>
            <Grid>
                <Grid.Col span={"content"}>
                    <Title style={{ margin: 5 }} order={2}>Obiective</Title>
                </Grid.Col>
                <Grid.Col style={{margin:8}} span={"content"}>
                    <Button radius="md"
                     style={{background:"#004d00"}}
                    miw={"120px"} onClick={() => dispatch(showGoalForm())} fullWidth>
                        Adaugă obiectiv
                    </Button>
                </Grid.Col>
            </Grid>
        </div>
    )
}