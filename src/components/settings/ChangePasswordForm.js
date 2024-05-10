import React from "react";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { editPassword } from "../../features/userSlice";

export default function ChangePasswordForm({ close }) {
  const form = useForm({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      oldPassword: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/.test(
          value
        )
          ? null
          : "Necesită cel puțin o literă mică, o literă mare, o cifră și un caracter special.",
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/.test(
          value
        )
          ? null
          : "Necesită cel puțin o literă mică, o literă mare, o cifră și un caracter special..",
      confirmPassword: (value, { password }) =>
        value === password ? null : "Parolele nu se potrivesc",
    },
  });

  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  async function handleEditPassword(values) {
    console.log(values);
    dispatch(editPassword({ ...form.values, token: token }));
    close();
  }

  return (
    <form onSubmit={form.onSubmit((values) => handleEditPassword(values))}>
      <TextInput
        radius="md"
        style={{ marginTop: 16 }}
        withAsterisk
        label="Parola veche"
        type="parola"
        {...form.getInputProps("oldPassword")}
      />
      <TextInput
        radius="md"
        style={{ marginTop: 16 }}
        withAsterisk
        label="Noua parola"
        type="parola"
        {...form.getInputProps("password")}
      />
      <TextInput
        radius="md"
        style={{ marginTop: 16 }}
        withAsterisk
        label="Confirm parola"
        type="parrola"
        {...form.getInputProps("confirmPassword")}
      />
      <Group style={{ marginTop: 36, marginBottom: 36 }}>
        <Button radius="md" fullWidth type="submit"  style={{marginTop:5, background:"#004d00"}}>
          Update
        </Button>
      </Group>
    </form>
  );
}
