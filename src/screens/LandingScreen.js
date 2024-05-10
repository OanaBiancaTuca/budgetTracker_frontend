import {Title, Grid, Container, Text, Button, List, Paper, Card, Center} from '@mantine/core';
import HeaderBar from '../components/HeaderBar';
import {ReactComponent as LeaderSVG} from "../assets/Finance leaders.svg";
import {ReactComponent as ArrowRightIcon} from "../assets/Arrow_right.svg";
import {ReactComponent as ManageMoneySVG} from "../assets/Manage money.svg";
import {ReactComponent as CheckIcon} from '../assets/Check_round_fill.svg';
import {ReactComponent as ExpensesSVG} from "../assets/Receipt.svg";
import {ReactComponent as BudgetingSVG} from "../assets/Budgeting.svg";
import {ReactComponent as SavingSVG} from "../assets/Piggy bank.svg";
import {ReactComponent as DebtManageSVG} from "../assets/Debt Manage.svg";
import {ReactComponent as AppLogo} from "../assets/App logo.svg";
import {useDispatch} from "react-redux";
import {openSignupForm} from "../features/userSlice";

export default function LandingScreen() {
    const dispatch = useDispatch();
    return (
        <div>
            <HeaderBar isLandingPage={true} />
            <Container size="xl">
                <Container size={"lg"}>
                    <Grid style={{marginTop:40}} justify="center" align="center">
                        <Grid.Col md={6} lg={6}>
                            <Title style={{textAlign:"left"}} size="48">O viață mai bună prin gestionare inteligentă.</Title>
                            <Text c="dimmed" style={{marginTop:10,textAlign:"left"}}>MoneyTracker: Simplifică plățile, urmărește cheltuielile, atinge obiectivele financiare</Text>
                            <Button
    onClick={() => dispatch(openSignupForm())}
    size="md"
    radius="xl"
    style={{ marginTop: 20, background: "#004d00", color: "white" }}
    rightIcon={<ArrowRightIcon />}
>
    Începeți
</Button>
                        </Grid.Col>
                        <Grid.Col md={6} lg={6}>
                            <Center>
                                <LeaderSVG/>
                            </Center>
                        </Grid.Col>
                    </Grid>
                </Container>
                <Container size={"lg"} style={{marginTop:150}}>
                    <Paper shadow="sm" radius="lg" p="md">
                        <Grid>
                            <Grid.Col justify="center" align="center" md={6} lg={6}>
                                <ManageMoneySVG style={{width:350,height:350}}/>
                            </Grid.Col>
                            <Grid.Col justify="center" md={6} lg={3}>
                                <Title style={{textAlign:"left"}} size="32">Gestionarea eficientă a banilor</Title>
                                <Text c="dimmed" style={{fontSize:18,marginTop:10,textAlign:"left"}}>Gestionarea eficientă a banilor este cheia pentru a obține stabilitate financiară și succes. Prin preluarea controlului asupra finanțelor tale și luarea deciziilor informate, poți deschide calea către un viitor sigur și prosper.</Text>
                                <List style={{marginTop:20}}
                                    spacing="xs"
                                    size="sm"
                                    center
                                    icon={
                                        <CheckIcon/>
                                    }
                                >
                                    <List.Item>Elaborarea unui buget</List.Item>
                                    <List.Item>Urmărirea economiilor și investițiilor</List.Item>
                                    <List.Item>Gestionarea datoriilor</List.Item>
                                    <List.Item>Urmărirea și controlul cheltuielilor</List.Item>
                                </List>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                </Container>
                <Container  size={"lg"} style={{marginTop:100,marginBottom:100}}>
                    <Title order={1}>Funcționalități</Title>
                    <Grid style={{marginTop:50}}>
                        <Grid.Col md={6} lg={3}>
                            <Card
                                shadow="sm"
                                padding="sm"
                                component="a"
                                withBorder
                                radius="lg"
                            >
                                <Card.Section>
                                    <ExpensesSVG style={{width:250,height:200}}/>
                                </Card.Section>

                                <Text weight={500} size="lg" mt="md">
                                    Urmărirea și controlul cheltuielilor
                                </Text>

                                <Text mt="xs" color="dimmed" size="sm">
                                    Menținerea unei înțelegeri clare a cheltuielilor tale este crucială pentru o gestionare eficientă a banilor. 
                                </Text>
                            </Card>
                        </Grid.Col>
                        <Grid.Col md={6} lg={3}>
                            <Card
                                shadow="sm"
                                padding="sm"
                                component="a"
                                withBorder
                                radius="lg"
                            >
                                <Card.Section>
                                    <BudgetingSVG style={{width:250,height:200}}/>
                                </Card.Section>

                                <Text weight={500} size="lg" mt="md">
                                    Elaborarea unui buget
                                </Text>

                                <Text mt="xs" color="dimmed" size="sm">
                                    Crearea și respectarea unui buget este fundamentală pentru gestionarea banilor. Începe prin a-ți urmări veniturile și cheltuielile și să le categorizezi în mod corespunzător.
                                </Text>
                            </Card>
                        </Grid.Col>
                        <Grid.Col md={6} lg={3}>
                            <Card
                                shadow="sm"
                                padding="sm"
                                component="a"
                                withBorder
                                radius="lg"
                            >
                                <Card.Section>
                                    <SavingSVG style={{width:250,height:200}}/>
                                </Card.Section>

                                <Text weight={500} size="lg" mt="md">
                                    Urmărirea economiilor și investițiilor
                                </Text>

                                <Text mt="xs" color="dimmed" size="sm">
                                    Construirea unui obicei de economisire este crucială pentru securitatea financiară. Aloca o parte din venitul tău pentru economii în fiecare lună.
                                </Text>
                            </Card>
                        </Grid.Col>
                        <Grid.Col md={6} lg={3}>
                            <Card
                                shadow="sm"
                                padding="sm"
                                component="a"
                                withBorder
                                radius="lg"
                            >
                                <Card.Section>
                                    <DebtManageSVG style={{width:250,height:200}}/>
                                </Card.Section>

                                <Text weight={500} size="lg" mt="md">
                                    Gestionarea datoriilor
                                </Text>

                                <Text mt="xs" color="dimmed" size="sm">
                                    Gestionarea datoriilor este esențială. Prioritizează plata datoriilor cu dobânzi mari înaintea altora, plătind în același timp sumele minime pentru celelalte.
                                </Text>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Container>

            <div style={{background:"#d6efd6", height:300}}>
                <Container size={"lg"}>
                    <Grid style={{marginTop:50}}>
                        <Grid.Col span={4}>
                            <AppLogo style={{width:200}}></AppLogo>
                            <Text color={"black"} style={{marginLeft:10}}>Simplifică plățile, urmărește cheltuielile, atinge obiectivele financiare</Text>
                        </Grid.Col>
                        <Grid.Col justify="center" align="center" span={8}>
                            <Button size={"md"} style={{marginTop:50, background:"#004d00"}}>GitHub</Button>
                        </Grid.Col>
                    </Grid>
                </Container>
            </div>
        </div>
    )
}
