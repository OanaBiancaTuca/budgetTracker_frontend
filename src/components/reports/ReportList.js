import { Card, Button, Text, Grid, Group } from '@mantine/core';
import { ReactComponent as DownloadSVG } from '../../assets/Import.svg';
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../api/config";
import { saveAs } from 'file-saver';
import { ReactComponent as ExcelIcon } from "../../assets/ExcelFile.svg";
import { ReactComponent as PdfIcon } from "../../assets/PdfFile.svg";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { ReactComponent as SuccessIcon } from "../../assets/success-icon.svg";

export default function ReportList() {
    const list = ["Transactions Report", "Budgets Report", "Goals Report", "Debts Report"];
    const token = useSelector(state => state.user.token);
    const [transactionReportLoading, setTransactionReportLoading] = useState(false);
    const [transactionReportPdfLoading, setTransactionReportPdfLoading] = useState(false);

    async function handleTransactionReportExcel() {
        setTransactionReportLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/report/transaction/excel`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const date = new Date();
            saveAs(response.data, `RaportTranzactii_${date.toLocaleDateString()}.xlsx`);
            setTransactionReportLoading(false);
            notifications.show({
                title: 'Descărcare completă',
                message: 'Vizualizează fișierul descărcat!',
                icon: <SuccessIcon />,
                radius: "lg",
                autoClose: 5000,
            });
        } catch (error) {
            console.error('Eroare la descărcarea fișierului: ', error);
            setTransactionReportLoading(false);
            notifications.show({
                title: error.message,
                message: 'Încearcă din nou!',
                radius: "lg",
                color: "red",
                autoClose: 5000,
            });
        }
    }

    async function handleTransactionReportPdf() {
        setTransactionReportPdfLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/report/transaction/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const date = new Date();
            saveAs(response.data, `RaportTranzactii_${date.toLocaleDateString()}.pdf`);
            setTransactionReportPdfLoading(false);
            notifications.show({
                title: 'Descărcare completă',
                message: 'Vizualizează fișierul descărcat!',
                icon: <SuccessIcon />,
                radius: "lg",
                autoClose: 5000,
            });
        } catch (error) {
            console.error('Eroare la descărcarea fișierului: ', error);
            setTransactionReportPdfLoading(false);
            notifications.show({
                title: error.message,
                message: 'Încearcă din nou!',
                radius: "lg",
                color: "red",
                autoClose: 5000,
            });
        }
    }

    return (
        <div style={{ margin: 30 }}>
            <Grid>
                <Grid.Col md={6} lg={6}>
                    <Card padding="lg" radius="md" withBorder>
                        <Group position="apart" mt="md" mb="xs">
                            <Text weight={500}>Raport Tranzacții</Text>
                        </Group>
                        <Text size="sm" color="dimmed">
                            Aceasta va genera un raport complet al tranzacțiilor.
                        </Text>
                        <Button loading={transactionReportLoading} onClick={() => handleTransactionReportExcel()} leftIcon={<ExcelIcon style={{ height: 16, width: 16 }} />} variant="light" color="green" fullWidth mt="md" radius="md">
                            Descărcați Raportul Excel
                        </Button>
                        <Button loading={transactionReportPdfLoading} onClick={() => handleTransactionReportPdf()} leftIcon={<PdfIcon style={{ height: 16, width: 16 }} />} variant="light" color="red" fullWidth mt="md" radius="md">
                            Descărcați Raportul PDF
                        </Button>
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
}
