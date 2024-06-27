import React, { useEffect, useState } from "react";
import { Button, Table, Progress, Text, Grid } from "@mantine/core";
import { ReactComponent as EditSVG } from "../../assets/Edit.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudget, resetBudget, showBudgetForm } from "../../features/budgetSlice";
import BudgetEditForm from "./BudgetEditForm";

export default function BudgetList() {
  const dispatch = useDispatch();
  const [displayBudgetEditForm, setDisplayBudgetEditForm] = useState(false);
  const [selectedEditElement, setSelectedEditElement] = useState(null);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    dispatch(fetchBudget({ token: token }));
  }, [dispatch, token]);

  const handleBudgetEditFormClose = () => {
    setDisplayBudgetEditForm(false);
  };

  const handleBudgetEditFormOpen = (element) => {
    setSelectedEditElement(element);
    setDisplayBudgetEditForm(true);
  };

  const handleResetBudget = (id) => {
    dispatch(resetBudget({ token: token, id: id }));
  };

  const budgetList = useSelector((state) => state.budget.budgetList);

  const rows = budgetList.map((element) => (
    <tr key={element.id}>
      <td>
        <Text fw={700}>{element.category.name}</Text>
      </td>
      <td>
        <Text fw={700}>{`Ron. ${element.amount.toLocaleString("ro-RO")}`}</Text>
      </td>
      <td>
        <Grid>
          <Grid.Col span={"content"}>
            <Text fw={700}>{`Ron. ${element.used.toLocaleString("ro-RO")}`}</Text>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Progress
              tooltip={(100 * element.used) / element.amount}
              style={{ height: 9, marginTop: 5 }}
              value={(100 * element.used) / element.amount}
              radius="xl"
            />
          </Grid.Col>
        </Grid>
      </td>
      <td>
        <Text fw={700} style={{ color: "#26AB35" }}>{`Ron. ${element.balance.toLocaleString("ro-RO")}`}</Text>
      </td>
      <td>
        <EditSVG onClick={() => handleBudgetEditFormOpen(element)} />
        {/* <Button color="red" variant="outline" onClick={() => handleResetBudget(element.id)}>Resetează Bugetul</Button> */}
        <Button
          onClick={() => handleResetBudget(element.id)}
          color="red"
          variant="outline"
          size="xs"
          style={{ marginLeft: 10 }}
        >
          Resetează Bugetul
        </Button>
      
      </td>
    </tr>
  ));

  return (
    <div>
      {displayBudgetEditForm && (
        <BudgetEditForm
          element={selectedEditElement}
          open={displayBudgetEditForm}
          close={handleBudgetEditFormClose}
        />
      )}
      <Table verticalSpacing="md">
        <thead>
          <tr>
            <th>
              <Text c="dimmed">NUME</Text>
            </th>
            <th>
              <Text c="dimmed">BUGET</Text>
            </th>
            <th>
              <Text c="dimmed">SUMĂ UTILIZATĂ</Text>
            </th>
            <th>
              <Text c="dimmed">SOLD RĂMAS</Text>
            </th>
            <th>
              <Text c="dimmed">EDITARE</Text>
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}
