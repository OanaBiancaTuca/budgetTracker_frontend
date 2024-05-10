import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {editName, validateToken} from "../../features/userSlice";

function EditNameForm({close}) {
  const currentUser = useSelector(state => state.user.currentUser)
  const form = useForm({
    initialValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
    },

    validate: {
      firstName: (value) => (value !== "" ? null : "Prenumele este obligatoriu"),
      lastName: (value) => (value !== "" ? null : "Numele este obligatoriu"),
    },
  });

  const token = useSelector(state => state.user.token)
  
  const dispatch = useDispatch()
  //Edit name
  async function handleEditName(values){
    console.log(values)
    await dispatch(editName({ ...form.values, token: token }));
    await dispatch(validateToken(token));
    close();
  }
  

  return (
    <form onSubmit={form.onSubmit((values) => handleEditName(values))}>
      <TextInput
        radius="md"
        style={{ marginTop: 16 }}
        withAsterisk
        label="Prenume"
        {...form.getInputProps("firstName")}
      />
      <TextInput
        radius="md"
        style={{ marginTop: 16 }}
        withAsterisk
        label="Nume"
        {...form.getInputProps("lastName")}
      />
      <Group style={{ marginTop: 36, marginBottom: 36 }}>
        <Button radius="md" fullWidth type="submit"
                style={{background:"#004d00"}}>
          Update
        </Button>
      </Group>
    </form>
  );
}
export default EditNameForm;
