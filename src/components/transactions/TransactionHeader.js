import { Title, Button, Grid, TextInput, Modal, NumberInput, Group, Text, FileInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { ReactComponent as FilterIcon } from '../../assets/Filter_alt.svg';
import { ReactComponent as SearchIcon } from '../../assets/Search.svg';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showTransactionForm, importTransactions } from "../../features/transactionSlice";

export default function TransactionHeader({ onSearch, onFilter, onImport }) {
    const [searchValue, setSearchValue] = useState("");
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [filterValues, setFilterValues] = useState({
        minAmount: '',
        maxAmount: '',
        startDate: null,
        endDate: null
    });
    const [pdfFile, setPdfFile] = useState(null);

    const token = useSelector(state => state.user.token);
    console.log("Token from Redux store:", token); // Log pentru a verifica token-ul

    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        onSearch(value);
    };

    const handleFilterChange = (field, value) => {
        setFilterValues({ ...filterValues, [field]: value });
    };

    const applyFilters = () => {
        onFilter(filterValues);
        setFilterModalOpen(false);
        resetFilterValues();
    };

    const resetFilterValues = () => {
        setFilterValues({
            minAmount: '',
            maxAmount: '',
            startDate: null,
            endDate: null
        });
    };

    const handleFileChange = (file) => {
        setPdfFile(file);
    };

    const handleImport = async () => {
        if (!pdfFile) return;

        try {
            console.log("Token in handleImport:", token); // Log pentru a verifica token-ul înainte de import
            const response = await dispatch(importTransactions({ file: pdfFile, token })).unwrap();

            if (response.message === "success") {
                onImport(response.transactions);
                setImportModalOpen(false);
                setPdfFile(null);
            } else {
                console.error("Import failed", response.message);
            }
        } catch (error) {
            console.error("Error importing PDF", error);
        }
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
                            <Button radius="md" style={{ margin: 8 }} leftIcon={<FilterIcon />} variant="outline" color='green' onClick={() => setFilterModalOpen(true)}>
                                Filtrare
                            </Button>
                            <Button radius="md" style={{ margin: 8 }} leftIcon={<FilterIcon />} variant="outline" color='blue' onClick={() => setImportModalOpen(true)}>
                                Import PDF
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
            </Grid>

            <Modal
                opened={filterModalOpen}
                onClose={() => {
                    setFilterModalOpen(false);
                    resetFilterValues();
                }}
                title="Filtrare Tranzacții"
                overlayProps={{
                    color: "green",
                    opacity: 0.55,
                    blur: 3,
                }}
                size="lg"
                centered
                radius="md"
                withCloseButton={false}
            >
                <div style={{ padding: 20 }}>
                    <Text size="sm" style={{ marginBottom: 10 }} color="dimmed">
                        Selectați criteriile de filtrare pentru a restrânge lista de tranzacții.
                    </Text>
                    <NumberInput
                        label="Sumă minimă"
                        value={filterValues.minAmount}
                        onChange={(value) => handleFilterChange('minAmount', value)}
                        min={0}
                        step={100}
                        placeholder="Introdu suma minimă"
                        style={{ marginBottom: 16 }}
                    />
                    <NumberInput
                        label="Sumă maximă"
                        value={filterValues.maxAmount}
                        onChange={(value) => handleFilterChange('maxAmount', value)}
                        min={0}
                        step={100}
                        placeholder="Introdu suma maximă"
                        style={{ marginBottom: 16 }}
                    />
                    <DatePicker
                        label="Data început"
                        value={filterValues.startDate}
                        onChange={(date) => handleFilterChange('startDate', date)}
                        placeholder="Alege data de început"
                        style={{ marginBottom: 16 }}
                    />
                    <DatePicker
                        label="Data sfârșit"
                        value={filterValues.endDate}
                        onChange={(date) => handleFilterChange('endDate', date)}
                        placeholder="Alege data de sfârșit"
                        style={{ marginBottom: 16 }}
                    />
                    <Group position="apart" mt="md">
                        <Button variant="outline" color="red" onClick={() => {
                            setFilterModalOpen(false);
                            resetFilterValues();
                        }}>Anulează</Button>
                        <Button style={{ backgroundColor: "#004d00" }} onClick={applyFilters}>Aplică filtre</Button>
                    </Group>
                </div>
            </Modal>

            <Modal
                opened={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                title="Importă Tranzacții din PDF"
                overlayProps={{
                    color: "blue",
                    opacity: 0.55,
                    blur: 3,
                }}
                size="md"
                centered
                radius="md"
                withCloseButton={false}
            >
                <div style={{ padding: 20 }}>
                    <FileInput
                        label="Alege PDF"
                        placeholder="Alege fișierul PDF"
                        onChange={handleFileChange}
                        accept="application/pdf"
                    />
                    <Group position="apart" mt="md">
                        <Button variant="outline" color="red" onClick={() => setImportModalOpen(false)}>Anulează</Button>
                        <Button style={{ backgroundColor: "#004d00" }} onClick={handleImport}>Importă</Button>
                    </Group>
                </div>
            </Modal>
        </div>
    );
}
