
import { Grid, Text, Paper } from '@mantine/core';
import {useSelector} from "react-redux";

export default function AccountFeature() {
    const accountList = useSelector(state => state.account.accountList)
    function handleTotalAccount(){
        return accountList.length
    }

    function handleTotalIncome(){
        return accountList.reduce(
            (accumulator, currentValue) => accumulator + currentValue.totalIncome,
            0
        );
    }

    function handleTotalExpense(){
        return accountList.reduce(
            (accumulator, currentValue) => accumulator + currentValue.totalExpenses,
            0
        );
    }

    function handleTotalBalanace(){
        return accountList.reduce(
            (accumulator, currentValue) => accumulator + currentValue.currentBalance,
            0
        );
    }

    return (
        <div style={{marginBottom:10}}>
            <Grid >
                <Grid.Col span={"content"}>
                    <Paper  radius="md" miw={"200px"} p="md" withBorder>
                        <Text size={"lg"} fw={700}>{handleTotalAccount().toLocaleString("ro-RO")}</Text>
                        <Text size={"sm"} fw={700} c="dimmed">
                            TOATE CONTURILE
                        </Text>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={"content"}>
                    <Paper  radius="md" miw={"200px"} p="md" withBorder>
                        <Text size={"lg"} fw={700}>{`Ron. ${handleTotalIncome().toLocaleString("ro-RO")}`}</Text>
                        <Text size={"sm"} fw={700} c="dimmed">
                            TOTAL VENITURI
                        </Text>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={"content"}>
                    <Paper radius="md" miw={"200px"} p="md" withBorder>
                        <Text size={"lg"} fw={700}>{`Ron. ${handleTotalExpense().toLocaleString("ro-RO")}`}</Text>
                        <Text size={"sm"} fw={700} c="dimmed">
                            TOTAL CHELTUIELI
                        </Text>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={"content"}>
                    <Paper  radius="md" miw={"200px"} p="md" withBorder>
                        <Text size={"lg"} fw={700} style={{color: "#26AB35"}}>{`Ron. ${handleTotalBalanace().toLocaleString("ro-RO")}`}</Text>
                        <Text size={"sm"} fw={700} c="dimmed">
                            SOLD TOTAL
                        </Text>
                    </Paper>
                </Grid.Col>
            </Grid>

        </div>
    )
}