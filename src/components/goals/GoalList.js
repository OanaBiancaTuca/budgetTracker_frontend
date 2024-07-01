import { Table, Button, Text, Tooltip } from '@mantine/core';
import { useSelector } from "react-redux";
import { ReactComponent as EditSVG } from '../../assets/Edit.svg';
import { ReactComponent as GreenArrowSVG } from '../../assets/GreenArrow.svg'; // Adaugă fișierul SVG pentru săgeata verde
import { ReactComponent as RedXSVG } from '../../assets/RedX.svg'; // Adaugă fișierul SVG pentru X-ul roșu
import { useState } from "react";
import GoalEditForm from "./GoalEditForm";

export default function GoalList() {
    const goalList = useSelector(state => state.goal.goalList);
    const [displayGoalEditForm, setDisplayGoalEditForm] = useState(false);
    const [selectedEditElement, setSelectedEditElement] = useState(null);

    function handleGoalEditFormClose() {
        setDisplayGoalEditForm(false);
    }

    function handleEdit(element) {
        setSelectedEditElement(element);
        setDisplayGoalEditForm(true);
    }

    function handleDate(date) {
        const formatDate = new Date(date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return formatDate.toLocaleDateString('ro-RO', dateOptions);
    }

    function formatPrediction(predictionInDays) {
        const months = predictionInDays / 30;
        if (months < 12) {
            return `${months.toFixed(1)} luni`;
        } else {
            const years = Math.floor(months / 12);
            const remainingMonths = (months % 12).toFixed(1);
            return `${years} an${years > 1 ? 'i' : ''} și ${remainingMonths} luni`;
        }
    }

    function getStatusIcon(element) {
        const currentDate = new Date();
        const targetDate = new Date(element.targetDate);
        const predictionDate = new Date(currentDate);
        predictionDate.setDate(predictionDate.getDate() + element.prediction);

        if (element.status === 'Pending') {
            if (targetDate >= predictionDate) {
                return (
                    <Tooltip label="Îndeplinibil la timp">
                        <GreenArrowSVG style={{ width: 20, height: 20 }} />
                    </Tooltip>
                );
            } else if (targetDate < predictionDate) {
                return (
                    <Tooltip label="Trebuie să cheltuiți mai puțin pentru a îndeplini acest obiectiv în timpul propus">
                        <RedXSVG style={{ width: 20, height: 20 }} />
                    </Tooltip>
                );
            }
        }
        return null;
    }

    const rows = goalList.map((element) => (
        <tr key={element.name}>
            <td>
                <Text fw={700}>{element.name}</Text>
                <Text c={"dimmed"} size={"xs"}>{element.description}</Text>
            </td>
            <td><Text fw={700}>{handleDate(element.targetDate)}</Text></td>
            <td><Text fw={700}>{`Ron. ${element.targetAmount}`}</Text></td>
            <td><Text fw={700}>{element.status}</Text></td>
            <td><Text fw={700}>{element.prediction ? formatPrediction(element.prediction) : 'N/A'}</Text></td>
            <td>{getStatusIcon(element)}</td>
            <td>{<EditSVG onClick={() => handleEdit(element)} style={{ cursor: 'pointer', width: 20, height: 20 }} />}</td>
        </tr>
    ));

    return (
        <div>
            {displayGoalEditForm && <GoalEditForm element={selectedEditElement} open={displayGoalEditForm} close={handleGoalEditFormClose} />}
            <Table verticalSpacing="lg">
                <thead>
                    <tr>
                        <th><Text c="dimmed">NUME</Text></th>
                        <th><Text c="dimmed">TARGET DATE</Text></th>
                        <th><Text c="dimmed">VALOARE ȚINTĂ</Text></th>
                        <th><Text c="dimmed">STATUS</Text></th>
                        <th><Text c="dimmed">PREDICȚIE</Text></th>
                        <th><Text c="dimmed">STATUS ICON</Text></th>
                        <th><Text c="dimmed">EDIT</Text></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>
    );
}
