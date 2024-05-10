import React from 'react';
import { Button, Group, Text, TextInput } from '@mantine/core';

export default function DeleteAccount() {
  return (
    <>
    <Text fz="lg">Sigur doriți să vă ștergeți contul?</Text>
    <Group position="right" mt="md">
        <Button type="submit" color='red'>Șterge</Button>
      </Group>
    </>
  )
}
