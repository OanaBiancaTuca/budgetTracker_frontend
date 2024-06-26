import Layout from "../components/Layout";
import {validateToken} from "../features/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import BarChart from "../components/dashboard/BarChart";
import {Divider, Grid, Paper, Text, Title,Skeleton } from "@mantine/core";
import IncomePieChart from "../components/dashboard/IncomePieChart";
import ExpensesPieChart from "../components/dashboard/ExpensesPieChart";
import axios from "axios";
import {baseUrl} from "../api/config";
import DashboardFeture from "../components/dashboard/DashboardFeature";
import {fetchBudget} from "../features/budgetSlice";
import {useStoreActions} from "easy-peasy";
import {fetchAccount} from "../features/accountSlice";
import {fetchGoal} from "../features/goalSlice";


export default function  DashboardScreen(){
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)
    const [result,setResult] = useState({
        total_expenses:0,
        total_income:0
    });
    const getData=useStoreActions((action)=>action.getData);
    useEffect(()=>{
        dispatch(validateToken(token))
        dispatch(fetchBudget({token:token}))
        dispatch(fetchAccount({token:token}))
        dispatch(fetchGoal({token:token}))
        getData({token:token,value:0});
        axios.get(`${baseUrl}/dashboard/this-month/total/income-and-expenses`,{
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) =>{
            setResult(res.data.data)
        }).catch((err) =>{
        })
    },[])
    return(
        <Layout title={"Dashboard"} load={true}>
            <div >
                <Title style={{ margin: 5,marginBottom:10 }} order={2}>Dashboard</Title>
                <DashboardFeture/>
                <Grid style={{height:300}}>
                    <Grid.Col span={12} md={6}>
                        <Paper  radius="md" p="md" withBorder>
                            <Grid >
                                <Grid.Col span={12} md={6}>
                                    <Title order={4}>{result?.total_expenses>0 ? `Ron. ${result?.total_expenses.toLocaleString("ro-RO")}` : `-`}</Title>
                                    <Text c={"dimmed"}>Cheltuielile din această lună</Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Title style={{color: "#26AB35"}} order={4}>{result?.total_income>0 ? `Ron. ${result?.total_income.toLocaleString("ro-RO")}` : `-`}</Title>
                                    <Text c={"dimmed"}>Veniturile din această lună</Text>
                                </Grid.Col>
                            </Grid>
                            <Divider my="sm" style={{marginBottom:20}} />
                            <Grid>
                                <Grid.Col span={6}>
                                    <ExpensesPieChart/>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <IncomePieChart/>
                                </Grid.Col>
                            </Grid>

                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={12} md={6}>
                        <Paper radius="md" p="md" withBorder>
                            <Title order={4}>Ultimele 6 luni</Title>
                            <Text c={"dimmed"}>Venituri și Cheltuieli</Text>
                            <Divider my="sm" />
                            <BarChart />
                        </Paper>
                        </Grid.Col>
                </Grid>

            </div>
        </Layout>
    )
}