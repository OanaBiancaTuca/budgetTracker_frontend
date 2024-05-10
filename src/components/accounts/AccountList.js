
import { Text,Table } from '@mantine/core';
import { ReactComponent as EditSVG } from '../../assets/Edit.svg';
import {useSelector} from "react-redux";
import {useState} from "react";
import AccountEditForm from "./AccountEditForm";
export default function AccountList() {
    const accountList = useSelector(state => state.account.accountList)
    const [displayAccountEditForm,setDisplayAccountEditForm] = useState(false);
    const [selectedEditElement,setSelectedEditElement] = useState(null);
    function handleEdit(element){
        setSelectedEditElement(element)
        setDisplayAccountEditForm(true)
    }

    function handleAccountEditFormClose(){
        setDisplayAccountEditForm(false)
    }
    const rows = accountList.map((element) => (
        <tr key={element.accountId}>
          <td><Text fw={700}>{element.name}</Text></td>
          <td><Text fw={700}>{`Ron. ${element.totalIncome.toLocaleString("ro-RO")}`}</Text></td>
          <td><Text fw={700}>{`Ron. ${element.totalExpenses.toLocaleString("ro-RO")}`}</Text></td>
          <td><Text fw={700} style={{color: "#26AB35"}}>{`Ron. ${element.currentBalance.toLocaleString("ro-RO")}`}</Text></td>
          <td>{<EditSVG onClick={() => handleEdit(element) }/>}</td>
        </tr>
      ));

    return (
        <div >
            {displayAccountEditForm && <AccountEditForm element={selectedEditElement} open={displayAccountEditForm}  close={handleAccountEditFormClose} />}
            <Table verticalSpacing="lg">
                <thead>
                    <tr>
                        <th><Text c="dimmed">DETALII CONT</Text></th>
                        <th><Text c="dimmed">TOTAL VENITURI</Text></th>
                        <th><Text c="dimmed">TOTAL CHELTUIELI</Text></th>
                        <th><Text c="dimmed">SOLD TOTAL</Text></th>
                        <th><Text c="dimmed">EDITARE</Text></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>
    )
}