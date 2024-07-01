import { Badge, Table, Text, Button, Select, Group, Pagination } from '@mantine/core';
import ArrowRIcon from '../../assets/Arrow_alt_ltop.svg';
import ArrowGIcon from '../../assets/Arrow_alt_ldown.svg';
import Edit from '../../assets/Edit.svg';
import TransactionEditForm from "./TransactionEditForm";
import { useState } from "react";
import { useSelector } from 'react-redux';

export default function TransactionList({ filteredTransactions }) {
    const [displayTransactionEditForm, setDisplayTransactionEditForm] = useState(false);
    const [selectedEditElement, setSelectedEditElement] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const loading = useSelector(state => state.transaction.fetchTransactionInProcess);

    function handleTransactionEditFormClose() {
        setDisplayTransactionEditForm(false);
    }

    function handleTransactionEditFormOpen(element) {
        setSelectedEditElement(element);
        setDisplayTransactionEditForm(true);
    }

    const endIndex = currentPage * itemsPerPage;
    const startIndex = endIndex - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const paginationControl = (
        <Group position="center" mt="md">
            <Select
                label="Items per page"
                value={itemsPerPage.toString()}
                onChange={(value) => setItemsPerPage(Number(value))}
                data={[
                    { value: '5', label: '5' },
                    { value: '10', label: '10' },
                    { value: '15', label: '15' },
                    { value: '20', label: '20' }
                ]}
                style={{ width: 100 }}
            />
            <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                color="blue"
            />
        </Group>
    );

    const dateCol = (date) => {
        const dateTime = new Date(date);
        const dateoptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return (
            <div>
                <Text fw={700} fz="md" style={{ marginBottom: 5 }}>{dateTime.toLocaleDateString('ro-RO', dateoptions)}</Text>
                <Text fw={500} c="dimmed" fz="sm">{dateTime.toLocaleTimeString('en-US')}</Text>
            </div>
        );
    };

    const categoryCol = (category, description, id) => {
        return (
            <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", marginBottom: 5, marginTop: 8 }}>
                    {category.type === "income" ? (
                        <img src={ArrowGIcon} alt="Income Icon" />
                    ) : (
                        <img src={ArrowRIcon} alt="Expense Icon" />
                    )}
                    {category.type === "income" ? (
                        <Text fw={700} fz="md">primit de la: <Badge color="green">{category.name}</Badge></Text>
                    ) : (
                        <Text fw={700} fz="md">cheltuit pe: <Badge color="red">{category.name}</Badge></Text>
                    )}
                </div>
                <div style={{ marginLeft: "24px" }}>
                    <Text fw={500} size="xs" lineClamp={1} style={{ marginBottom: 3 }} c="dimmed">{description}</Text>
                    <Text fw={500} c="dimmed" fz="sm">{`Transaction ID : #${id}`}</Text>
                </div>
            </div>
        );
    };

    const accountDetails = (account, paymentType) => {
        if (!account) {
            return (
                <div style={{ marginBottom: 12 }}>
                    <Text fw={700} fz="md" style={{ marginBottom: 5 }}>Account not available</Text>
                    <Text fw={500} c="dimmed" fz="sm">{paymentType}</Text>
                </div>
            );
        }
        return (
            <div style={{ marginBottom: 12 }}>
                <Text fw={700} fz="md" style={{ marginBottom: 5 }}>{account.name}</Text>
                <Text fw={500} c="dimmed" fz="sm">{paymentType}</Text>
            </div>
        );
    };

    const paytype = (element) => {
        return (
            <div style={{ marginBottom: 12 }}>
                <img src={Edit} alt="Edit Icon" onClick={() => handleTransactionEditFormOpen(element)} />
            </div>
        );
    };

    const amountCol = (amount, type) => {
        return (
            <div style={{ marginBottom: 12 }}>
                {type === "income" ? (
                    <Text fw={700} fz="md" style={{ marginBottom: 12, color: '#26AB35' }}>{"+ Ron. " + amount.toLocaleString("ro-RO")}</Text>
                ) : (
                    <Text fw={700} fz="md" style={{ marginBottom: 12 }}>{"- Ron. " + amount.toLocaleString("ro-RO")}</Text>
                )}
            </div>
        );
    };

    const rows = currentTransactions.map((element) => (
        <tr key={element.id}>
            <td>{dateCol(element.dateTime)}</td>
            <td>{categoryCol(element.category, element.description, element.id)}</td>
            <td>{accountDetails(element.account, element.paymentType)}</td>
            <td>{amountCol(element.amount, element.category.type)}</td>
            <td>{paytype(element)}</td>
        </tr>
    ));

    return (
        <div>
            {displayTransactionEditForm && (
                <TransactionEditForm element={selectedEditElement} open={displayTransactionEditForm} close={handleTransactionEditFormClose} />
            )}
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th><Text fw={700} c="dimmed">DATA</Text></th>
                                <th><Text fw={700} c="dimmed">DETALII TRANZACȚIE</Text></th>
                                <th><Text fw={700} c="dimmed">DETALII CONT</Text></th>
                                <th><Text fw={700} c="dimmed">SUMA</Text></th>
                                <th><Text c="dimmed">EDITARE</Text></th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                    {paginationControl}
                </div>
            )}
        </div>
    );
}
