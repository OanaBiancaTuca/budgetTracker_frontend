import { Grid, Paper, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { useStoreState } from "easy-peasy";

export default function DashboardFeture() {
    const accountList = useSelector(state => state.account.accountList) || [];
    const budgetList = useSelector(state => state.budget.budgetList) || [];
    const debtPending = useStoreState((state) => state.debtPending);
    const goalList = useSelector(state => state.goal.goalList) || [];

    function handleTotalBalance() {
        if (!accountList || accountList.length === 0) return 0;
        return accountList.reduce(
            (accumulator, currentValue) => accumulator + currentValue.currentBalance,
            0
        );
    }

    function pendingGoals() {
        if (!goalList || goalList.length === 0) return 0;
        return goalList.filter(goal => goal.status === 'Pending').length;
    }

    function handleTotalBudget() {
        if (!budgetList || budgetList.length === 0) return 0;
        return budgetList.reduce(
            (accumulator, currentValue) => accumulator + currentValue.amount,
            0
        );
    }

    function handleTotalUsed() {
        if (!budgetList || budgetList.length === 0) return 0;
        return budgetList.reduce(
            (accumulator, currentValue) => accumulator + currentValue.used,
            0
        );
    }

    return (
        <div>
            <Paper style={{ marginBottom: 16 }} radius="md" p="md" withBorder>
                <Grid>
                    <Grid.Col span={12} sm={6} md={3}>
                        <Text size={"xl"} fw={700}>{handleTotalBalance() > 0 ? `Ron. ${handleTotalBalance().toLocaleString("ro-RO")}` : `-`}</Text>
                        <Text size={"sm"} fw={700} c="dimmed">
                            SOLD TOTAL
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}>
                        <Text size={"xl"} fw={700}>{handleTotalBudget() > 0 ? `${Math.floor((100 * handleTotalUsed()) / handleTotalBudget())}%` : `-`}</Text>
                        <Text size={"sm"} fw={700} c="dimmed">
                            BUGET UTILIZAT
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}>
                        <Text size={"xl"} fw={700}>{`${debtPending} `}</Text>
                        <Text size={"sm"} fw={700} c="dimmed">
                            DATORII ÎN AȘTEPTARE
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={12} sm={6} md={3}>
                        <Text size={"xl"} fw={700}>{`${pendingGoals()} / ${goalList.length}`}</Text>
                        <Text size={"sm"} fw={700} c="dimmed">
                            OBIECTIVE ÎN AȘTEPTARE
                        </Text>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    );
}
