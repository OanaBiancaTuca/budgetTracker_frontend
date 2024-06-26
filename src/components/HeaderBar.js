import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Header,
  Group,
  Button,
  Box,
  Avatar,
  Menu,
  rem,
  UnstyledButton,
  Burger,
  Title,
  Container,
  Modal,
} from "@mantine/core";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import {
  closeForgotPasswordForm,
  closeSigninForm,
  closeSignupForm,
  openForgotPasswordForm,
  openSigninForm,
  openSignupForm,
} from "../features/userSlice";
import { ReactComponent as ProfileIcon } from "../assets/User.svg";
import { ReactComponent as LogoutIcon } from "../assets/Sign_out_squre.svg";
import { ReactComponent as AppLogo } from "../assets/App logo.svg";
import { ReactComponent as ExpandIcon } from "../assets/Expand_down.svg";
import { ReactComponent as AvatarIcon } from "../assets/User_duotone.svg";
import { logout } from "../features/logoutSlice";
import { logoutAccount } from "../features/userSlice";

export default function HeaderBar(props) {
  const displaySigninForm = useSelector((state) => state.user.displaySigninForm);
  const displaySignupForm = useSelector((state) => state.user.displaySignupForm);
  const displayForgotPasswordForm = useSelector((state) => state.user.displayForgotPasswordForm);
  const [displayConfirmLogout, setDisplayConfirmLogout] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleOpenSigninForm() {
    dispatch(openSigninForm());
  }

  function handleOpenForgotPasswordForm() {
    dispatch(openForgotPasswordForm());
  }

  function handleOpenSignupForm() {
    dispatch(openSignupForm());
  }

  function handleCloseForgotPasswordForm() {
    dispatch(closeForgotPasswordForm());
  }

  function handleCloseSigninForm() {
    dispatch(closeSigninForm());
  }

  function handleCloseSignupForm() {
    dispatch(closeSignupForm());
  }

  function handleLogout() {
    console.log("logout");
    dispatch(logout());
    dispatch(logoutAccount());
    navigate("/"); // Ensure this is the correct path to your login page
  }

  function handleSetting() {
    navigate("/profile");
  }

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <Group>
            {props.isMobile && (
              <Burger opened={props.navOpened} onClick={() => props.setNavOpened(!props.navOpened)} />
            )}
            <AppLogo style={{ width: 100, height: 60 }} />
          </Group>
          {props.isLandingPage ? (
            <Group>
              <Button
                radius="xl"
                variant="subtle"
                onClick={handleOpenSigninForm}
                style={{ background: "#004d00", color: "white" }}
              >
                Conectează-te
              </Button>
              <Button
                radius="xl"
                onClick={handleOpenSignupForm}
                style={{ background: "#004d00", color: "white" }}
              >
                Creează un cont
              </Button>
            </Group>
          ) : (
            <Group>
              <Menu radius={"md"} openDelay={100} shadow="md" width={220}>
                <Menu.Target>
                  <UnstyledButton style={{ height: rem(42) }} radius={"md"} variant={"default"}>
                    <Group>
                      <Button radius={"xl"} variant={"default"} size={rem(42)}>
                        <Avatar src={`data:image/jpeg;base64,${currentUser.profileImage}`} radius="xl">
                          <AvatarIcon />
                        </Avatar>
                      </Button>
                      {!props.isMobile && (
                        <div style={{ flex: 1 }}>
                          <Text size="sm" fw={700}>
                            {currentUser.firstName}
                          </Text>
                          <Text c={"dimmed"} size="xs">
                            {currentUser.email.length > 16
                              ? `${currentUser.email.slice(0, 16)}...`
                              : currentUser.email}
                          </Text>
                        </div>
                      )}
                      <ExpandIcon style={{ height: 16, width: 16 }}></ExpandIcon>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    transitionProps={{ transition: "slide-down", duration: 150 }}
                    onClick={handleSetting}
                    icon={<ProfileIcon style={{ height: 16, width: 16 }} />}
                  >
                    <Text size={"sm"}>Profilul meu</Text>
                  </Menu.Item>
                  <Menu.Item
                    transitionProps={{ transition: "slide-down", duration: 150 }}
                    onClick={() => setDisplayConfirmLogout(true)}
                    color="red"
                    icon={<LogoutIcon style={{ height: 16, width: 16 }} />}
                  >
                    <Text size={"sm"}>Delogare</Text>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </Group>
        <SigninForm open={displaySigninForm} close={handleCloseSigninForm}></SigninForm>
        <SignupForm open={displaySignupForm} close={handleCloseSignupForm}></SignupForm>
        <ForgotPasswordForm open={displayForgotPasswordForm} close={handleCloseForgotPasswordForm}></ForgotPasswordForm>
        <Modal
          opened={displayConfirmLogout}
          onClose={() => setDisplayConfirmLogout(false)}
          radius="lg"
          size="sm"
          centered
          overlayProps={{
            color: "white",
            opacity: 0.55,
            blur: 3,
          }}
          title={
            <Title style={{ marginLeft: 10 }} order={3}>
              Confirm Logout
            </Title>
          }
        >
          <Container>
            <Text fz="lg">Sunteți sigur că doriți să vă delogați?</Text>
            <Group position="right" mt="md">
              <Button radius="md" onClick={() => setDisplayConfirmLogout(false)} variant={"default"}>
                Nu, înapoi
              </Button>
              <Button radius="md" onClick={handleLogout} color="red">
                Da, deloghează-mă
              </Button>
            </Group>
          </Container>
        </Modal>
      </Header>
    </Box>
  );
}
