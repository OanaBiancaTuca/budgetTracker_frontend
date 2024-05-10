import { Title, Button, Grid, TextInput } from '@mantine/core';
import { ReactComponent as FilterIcon } from '../../assets/Filter_alt.svg';
import { ReactComponent as SearchIcon } from '../../assets/Search.svg';
import { useState, useEffect } from "react"; // Added useEffect
import { useDispatch, useSelector } from "react-redux";
import { closeTransactionForm, showTransactionForm } from "../../features/transactionSlice";

export default function TransactionHeader() {
    const [searchValue, setSearchValue] = useState("");
    const transactions = useSelector(state => state.transactions?.list || []);

    useEffect(() => { // Added useEffect for logging transactions
        transactions.forEach((transaction, index) => {
            console.log(`Tranzactia ${index + 1}:`, transaction.name);
        });
    }, [transactions]);

    const dispatch = useDispatch();

    // Updated filter logic to search by category
    const filteredTransactions = transactions.filter(transaction =>
        transaction.category.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <div style={{ marginBottom: 10 }}>
            <Grid justify="space-around">
                <Grid.Col md={6} lg={6}>
                    <Grid>
                        <Grid.Col span={"content"}>
                            <Title style={{ margin: 5 }} order={2}>Tranzacții</Title>
                        </Grid.Col>
                        <Grid.Col span={"content"}>
                            <Button radius="md" fullWidth style={{ margin: 8, background: "#004d00" }} onClick={() => dispatch(showTransactionForm())}>
                                Adaugă Tranzacție
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col md={6} lg={6}>
                    <Grid>
                        <Grid.Col md={12} lg={8}>
                            <TextInput
                                style={{ margin: 8 }}
                                icon={<SearchIcon />}
                                radius="md"
                                placeholder="Caută după categorie..."
                                value={searchValue}
                                onChange={handleInputChange}
                            />
                        </Grid.Col>
                        <Grid.Col md={12} lg={4}>
                            <Button radius="md" style={{ margin: 8 }} leftIcon={<FilterIcon />} variant="outline" color='gray'>
                                Filtrare
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
            </Grid>
            {/* Rendering filtered transactions */}
            <div>
                {filteredTransactions.map(transaction => (
                    <div key={transaction.id}>
                        {transaction.category.name} - {transaction.name} {/* Displaying category with name for clarity */}
                    </div>
                ))}
            </div>
        </div>
    );
}
