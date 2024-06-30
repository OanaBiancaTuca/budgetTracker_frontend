import Layout from "../components/Layout";
import TransactionHeader from "../components/transactions/TransactionHeader";
import TransactionList from "../components/transactions/TransactionList";
import TransactionForm from "../components/transactions/TransactionFrom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransaction } from "../features/transactionSlice";
import { useEffect, useState } from "react";
import { Container, Divider, Grid, Skeleton } from '@mantine/core';
import { validateToken } from "../features/userSlice";

export default function TransactionScreen() {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    const fetchTransactionInProcess = useSelector(state => state.transaction.fetchTransactionInProcess);
    const transactionList = useSelector(state => state.transaction.transactionList) || [];
    const error = useSelector(state => state.transaction.error);
    const [filteredTransactions, setFilteredTransactions] = useState(transactionList);

    useEffect(() => {
        async function fetchData() {
            await dispatch(validateToken(token));
            await dispatch(fetchTransaction({ token }));
        }
        fetchData();
    }, [dispatch, token]);

    useEffect(() => {
        setFilteredTransactions(transactionList);
    }, [transactionList]);

    const handleSearch = (searchValue) => {
        const filtered = transactionList.filter(transaction =>
            transaction.category.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredTransactions(filtered);
    };

    const handleFilter = (filterValues) => {
        const { minAmount, maxAmount, startDate, endDate } = filterValues;
        const filtered = transactionList.filter(transaction => {
            const matchesAmount = (!minAmount || transaction.amount >= minAmount) &&
                                  (!maxAmount || transaction.amount <= maxAmount);
            const matchesDate = (!startDate || new Date(transaction.dateTime) >= new Date(startDate)) &&
                                (!endDate || new Date(transaction.dateTime) <= new Date(endDate));
            return matchesAmount && matchesDate;
        });
        setFilteredTransactions(filtered);
    };

    function GridSkeleton() {
        return (
            <Grid style={{ height: 90 }}>
                <Grid.Col span={3}>
                    <Skeleton height={12} mt={6} width="50%" radius="xl" />
                    <Skeleton height={10} mt={10} width="20%" radius="xl" />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Skeleton height={12} mt={6} width="50%" radius="xl" />
                    <Skeleton height={8} mt={10} width="60%" radius="xl" />
                    <Skeleton height={8} mt={10} width="30%" radius="xl" />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Skeleton height={12} mt={6} width="30%" radius="xl" />
                    <Skeleton height={10} mt={10} width="50%" radius="xl" />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Skeleton height={12} mt={10} width="30%" radius="xl" />
                </Grid.Col>
            </Grid>
        );
    }

    function SmallGridSkeleton() {
        return (
            <Grid style={{ height: 60 }}>
                <Grid.Col span={3}>
                    <Skeleton height={12} mt={6} width="50%" radius="xl" />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Skeleton height={12} mt={6} width="50%" radius="xl" />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Skeleton height={12} mt={6} width="30%" radius="xl" />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Skeleton height={12} mt={10} width="30%" radius="xl" />
                </Grid.Col>
            </Grid>
        );
    }

    return (
        <Layout title={"Tranzacții"} load={transactionList.length > 0}>
            {fetchTransactionInProcess ? (
                <div>
                    <Container size={"xxl"}>
                        <Grid style={{ marginBottom: 20 }}>
                            <Grid.Col span={2}>
                                <Skeleton height={16} mt={10} width="80%" radius="xl" />
                            </Grid.Col>
                            <Grid.Col span={2}>
                                <Skeleton style={{ marginBottom: 10 }} height={36} radius="md" />
                            </Grid.Col>
                        </Grid>
                        <SmallGridSkeleton />
                        <Divider style={{ marginBottom: 20 }} />
                        <GridSkeleton />
                        <Divider style={{ marginBottom: 10 }} />
                        <GridSkeleton />
                        <Divider style={{ marginBottom: 10 }} />
                        <GridSkeleton />
                        <Divider style={{ marginBottom: 10 }} />
                        <GridSkeleton />
                    </Container>
                </div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div>
                    <TransactionHeader onSearch={handleSearch} onFilter={handleFilter} />
                    <TransactionList filteredTransactions={filteredTransactions} />
                    <TransactionForm />
                </div>
            )}
        </Layout>
    );
}
