import React from 'react';
import { Text, Paper } from '@mantine/core';
import { BsFillCreditCardFill } from 'react-icons/bs';
import { GiEmptyHourglass } from 'react-icons/gi';

const NoDebt = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        margin: "20px 10px"
      }}>
      <Paper
        style={{
          width: "100%",
          borderRadius: "5px",
          borderTop: "1px solid #DEE2E6"
        }}
      >
        <div
          style={{
            fontSize: '40px',
            margin: '20px 10px',
            textAlign: 'center'
          }}
        >
          <BsFillCreditCardFill color='#228BE6' />
        </div>
        <Text
          size="lg"
          style={{
            margin: '20px 0px',
            textAlign: 'center'
          }}>
          <b>Nu aveți nicio datorie încă.</b>
          <p>Apăsați pe Datorie nouă pentru a adăuga și gestiona datoriile...</p>
        </Text>
        <div
          style={{
            fontSize: '50px',
            textAlign: 'center',
            margin: '20px 10px '
          }}>
          <GiEmptyHourglass color='#228BE6' />
        </div>
      </Paper>
    </div>
  );
};

export default NoDebt;
