import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Badge, Table, Text, Button, TextInput, Title, Switch, useMantineTheme, Notification } from '@mantine/core';
import { FaTrash, FaEdit, FaMoneyBill, FaUser, FaCalendarAlt, FaCheck, FaTimes, FaRedo, FaInfoCircle } from 'react-icons/fa';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { DatePickerInput } from '@mantine/dates';
import { useSelector } from 'react-redux';
import NoDebt from './NoDebt';
import { format, differenceInDays } from 'date-fns';

const DebtList = () => {
  const token = useSelector(state => state.user.token);
  const debts = useStoreState((state) => state.debts);
  const amount = useStoreState((state) => state.amount);
  const moneyFrom = useStoreState((state) => state.moneyFrom);
  const dueDate = useStoreState((state) => state.dueDate);
  const status = useStoreState((state) => state.status);

  const setAmount = useStoreActions((action) => action.setAmount);
  const setMoneyFrom = useStoreActions((action) => action.setMoneyFrom);
  const setdueDate = useStoreActions((action) => action.setdueDate);
  const setStatus = useStoreActions((action) => action.setStatus);
  const delDebt = useStoreActions((action) => action.delDebt);
  const editDebt = useStoreActions((action) => action.editDebt);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  const [debtId, setDebtId] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const [upNot, setupNot] = useState(false);
  const [delNot, setdelNot] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleOpenModal = (e, debtList) => {
    e.preventDefault();
    open();
    setAmount(`${debtList.amount}`);
    setdueDate(`${debtList.dueDate}`);
    setMoneyFrom(`${debtList.moneyFrom}`);
    setStatus(`${debtList.status}`);
    setDebtId(debtList.debtId);
  };

  const handleViewOpenModal = (e, debtList) => {
    e.preventDefault();
    setSelectedDebt(debtList);
    setViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleSaveModal = (debtId) => {
    const Udebt = {
      debtId: debtId,
      amount: amount,
      dueDate: dueDate,
      moneyFrom: moneyFrom,
      status: status,
    };
    editDebt({ ...Udebt, token: token });
    setSelectedDebt(Udebt);
    close();
    setupNot(true);
    setTimeout(() => {
      setupNot(false);
    }, 1000);
  };

  const handleDelete = (e, debtId) => {
    e.preventDefault();
    delDebt({ debtId: debtId, token: token });
    setViewModalOpen(false);
    setdelNot(true);
    setTimeout(() => {
      setdelNot(false);
    }, 1000);
  };

  const handleSwitchToggle = () => {
    const newStatus = status === 'paid' ? 'unpaid' : 'paid';
    setStatus(newStatus);
    setChecked(!checked);
  };

  const handleResetDebt = (debtId) => {
    const debtToUpdate = debts.find((debt) => debt.debtId === debtId);
    if (debtToUpdate) {
      const updatedDebt = {
        ...debtToUpdate,
        dueDate: format(new Date(debtToUpdate.dueDate).setMonth(new Date(debtToUpdate.dueDate).getMonth() + 1), 'yyyy-MM-dd'),
        status: 'unpaid'
      };
      editDebt({ ...updatedDebt, token: token });
    }
  };

  const rows = debts.map((element) => {
    const dueDateFormatted = new Date(element.dueDate);
    const daysDifference = differenceInDays(dueDateFormatted, new Date());
    const rowStyle = daysDifference <= 2 && element.status === 'unpaid' ? { backgroundColor: '#FFCCCC' } : {};

    return (
      <tr key={element.debtId} style={{ ...rowStyle, textAlign: "left" }}>
        <td><Text fw={700}>{element.moneyFrom}</Text></td>
        <td><Text fw={700}>{format(dueDateFormatted, 'dd MMM yyyy')}</Text></td>
        <td><Text fw={700}>{`Ron. ${element.amount}`}</Text></td>
        <td>
          <Badge
            color={element.status === 'paid' ? "green" : "red"}
            variant="outline">
            {element.status}
          </Badge>
        </td>
        <td>
          {daysDifference <= 2 && element.status === 'unpaid' && (
            <div style={{ display: 'flex', alignItems: 'center', color: 'red' }}>
              <FaInfoCircle style={{ marginRight: '5px' }} />
              <Text size="sm">Data scadentă se apropie! Vă rugăm achitați factura.</Text>
            </div>
          )}
          <Button
            color='gray'
            onClick={(e) => { handleViewOpenModal(e, element) }}>
            Vizualizare
          </Button>
          <Button
            color='red'
            onClick={() => handleResetDebt(element.debtId)}
            style={{ marginLeft: '10px' }}>
            <FaRedo /> Resetare scadență
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ marginTop: '20px' }}>
      {(!debts || debts.length === 0) ? (
        <NoDebt />
      ) : (
        <div>
          <Table
            horizontalSpacing="md"
            verticalSpacing="lg"
            highlightOnHover>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ color: "grey" }}>
                  <Text c="dimmed">DE LA</Text>
                </th>
                <th style={{ color: "grey" }}>
                  <Text c="dimmed">SCADENȚA</Text>
                </th>
                <th style={{ color: "grey" }}>
                  <Text c="dimmed">VALOARE</Text>
                </th>
                <th style={{ color: "grey" }}>
                  <Text c="dimmed">STATUS</Text>
                </th>
                <th style={{ color: "grey" }}>
                  <Text c="dimmed">DETALII</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
          <Modal
            opened={opened}
            onClose={close}
            centered
            position="center"
            title={
              <Title>
                <span>Edit</span>
              </Title>
            }
            size="350px"
            radius="lg"
            zIndex={1001}

            overlayProps={{
              color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
              opacity: 0.5,
              blur: 1,
            }}
          >
            <div>
              <DatePickerInput
                radius="md"
                style={{ marginTop: "2px" }}
                mx="auto"
                maw={400}
                label="Due date"
                value={new Date(dueDate)}
                onChange={(date) => {
                  const formattedDate = date.toLocaleDateString('ro-RO', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  setdueDate(formattedDate);
                }}
                icon={<FaCalendarAlt size="1.1rem" stroke={1.5} />}
              />

              <TextInput radius="md" style={{ marginTop: 6 }}
                label="From"
                value={moneyFrom}
                data-autofocus
                onChange={(event) => setMoneyFrom(event.currentTarget.value)}
                icon={<FaUser size="1.1rem" stroke={1.5} />}
              />
              <TextInput radius="md" style={{ marginTop: 6 }}
                label="Amount"
                value={amount}
                placeholder=""
                onChange={(event) => setAmount(event.currentTarget.value)}
                icon={<FaMoneyBill size="1.1rem" stroke={1.5} />}
              />

              <div radius="md"
                style={{ marginTop: "6px" }}>
                <Switch
                  style={{ width: "80px" }}
                  checked={status === 'paid'}
                  onChange={handleSwitchToggle}
                  size="md"
                  label="Paid"
                  labelPosition="left"
                  thumbIcon={
                    checked ? (
                      <FaCheck size="0.8rem" stroke={3} />
                    ) : (
                      <FaTimes size="0.8rem" stroke={3} />
                    )}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <Button
                onClick={close}
                fullWidth
                style={{ marginLeft: '10px', width: '45%' }} color='gray' >
                Anulează
              </Button>
              <Button
                onClick={() => handleSaveModal(debtId)}
                fullWidth
                style={{ marginRight: '10px', width: '45%' }}>
                Modifică
              </Button>
            </div>
          </Modal>

          <Modal
            opened={viewModalOpen}
            onClose={handleCloseViewModal}
            centered
            radius="lg"
            overlayProps={{
              color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
              opacity: 0.5,
              blur: 2,
            }}
            size="400px"
            position="center"
          >
            {selectedDebt && setViewModalOpen && (
              <div style={{ fontSize: "18px" }}>
                <div style={{ marginLeft: "100px", marginBottom: "25px" }}>
                  <span><h2>Detalii</h2></span>
                  <p><b>{`Valoare :`}</b>{selectedDebt.amount}</p>
                  <p><b>{`Scadență :`}</b>{selectedDebt.dueDate}</p>
                  <p><b>{`De la :`}</b>{selectedDebt.moneyFrom}</p>
                  <p><b>{`Status :`}</b>{selectedDebt.status}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="light"
                    color='green'
                    onClick={(e) => {
                      handleOpenModal(e, selectedDebt);
                    }}
                  >
                    <FaEdit /> &nbsp;
                    Edit
                  </Button>
                  <Button
                    color='red'
                    onClick={(e) => {
                      handleDelete(e, selectedDebt.debtId);
                    }}
                  >
                    <FaTrash /> &nbsp;
                    Șterge
                  </Button>
                </div>
              </div>
            )}
          </Modal>
          {upNot &&
            <Notification
              transition="slide-up"
              title="The Debt has been Edited Successfully !!!"
              color="blue"
              icon={<FaEdit />}
              style={{ position: 'fixed', bottom: '30px', right: '30px' }}
            />}
          {delNot &&
            <Notification
              transition="slide-up"
              title="A Debt has been deleted Successfully !!!"
              color="red"
              icon={<FaTrash />}
              style={{ position: 'fixed', bottom: '30px', right: '30px' }}
            />}
        </div>)}
    </div>
  )
}

export default DebtList;
