import { Box, Text, Navbar, Menu, NavLink, Button } from "@mantine/core";
import { ReactComponent as DashboardIcon } from "../assets/Widget.svg";
import { ReactComponent as DashboardIconBlue } from "../assets/Widget_Blue.svg";
import { ReactComponent as TransactionsIcon } from "../assets/Collapse.svg";
import { ReactComponent as TransactionsIconBlue } from "../assets/Collapse_Blue.svg";
import { ReactComponent as AccountsIcon } from "../assets/Database.svg";
import { ReactComponent as AccountsIconBlue } from "../assets/Database_fill_Blue.svg";
import { ReactComponent as BudgetIcon } from "../assets/Date_range.svg";
import { ReactComponent as BudgetIconBlue } from "../assets/Date_range_Blue.svg";
import { ReactComponent as GoalsIcon } from "../assets/Road_finish.svg";
import { ReactComponent as GoalsIconBlue } from "../assets/Road_finish_Blue.svg";
import { ReactComponent as DebtsIcon } from "../assets/Calendar.svg";
import { ReactComponent as DebtsIconBlue } from "../assets/Calendar_fill_Blue.svg";
import { ReactComponent as ReportsIcon } from "../assets/Desk_alt.svg";
import { ReactComponent as ReportsIconBlue } from "../assets/Desk_alt_Blue.svg";
import { ReactComponent as AddIcon } from "../assets/Add_round.svg";
import { ReactComponent as AddCategoryIcon } from "../assets/Folder_add_duotone_line.svg";
import { ReactComponent as AddDebtIcon } from "../assets/Calendar_add_duotone.svg";
import { ReactComponent as AddBudgetIcon } from "../assets/Date_range_duotone.svg";
import { ReactComponent as AddTransactionIcon } from "../assets/Collapse_light_duotone.svg";
import { ReactComponent as AddAccountIcon } from "../assets/Database_duotone.svg";
import { ReactComponent as AddGoalIcon } from "../assets/Road_finish_duotone_line.svg";
import { ReactComponent as ChatbotIcon } from "../assets/ChatbotIcon.svg"; // Add this import
import { ReactComponent as ChatbotIconBlue } from "../assets/ChatbotIconBlue.svg"; // Add this import

import { useNavigate } from "react-router-dom";
import CategoryForm from "./category/CategoryForm";
import {useDispatch, useSelector} from "react-redux";
import {closeCategoryForm, fetchCategory, showCategoryForm} from "../features/categorySlice";
import {closeTransactionForm, showTransactionForm} from "../features/transactionSlice";
import {closeAccountForm, showAccountForm} from "../features/accountSlice";
import AccountForm from "./accounts/AccountForm";
import TransactionForm from "./transactions/TransactionFrom";
import BudgetForm from "./budget/BudgetForm";
import {closeBudgetForm, showBudgetForm} from "../features/budgetSlice";
import GoalForm from "./goals/GoalForm";
import {closeGoalForm, showGoalForm} from "../features/goalSlice";

import { useState } from "react";
import DebtForm from "./debt/DebtForm";

export default function SideBar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const displayCategoryForm = useSelector(state => state.category.displayCategoryForm)
  const displayTransactionForm = useSelector(state => state.transaction.displayTransactionForm)
  const displayAccountForm = useSelector(state => state.account.displayAccountForm)
  const displayBudgetForm = useSelector(state => state.budget.displayBudgetForm)
  const displayGoalForm = useSelector(state => state.goal.displayGoalForm)
  const token = useSelector(state => state.user.token)
  //dispatch(fetchTransaction({token:token}))
  //dispatch(fetchCategory({token:token}))
  //dispatch(fetchAccount({token:token}))
  function handleCategoryFormClose() {
    dispatch(closeCategoryForm());
  }
  function handleTransactionFormClose() {
    dispatch(closeTransactionForm());
  }
  function handleAccountFormClose() {
    dispatch(closeAccountForm());
  }

  function handleBudgetFormClose() {
    dispatch(closeBudgetForm());
  }

  function handleGoalFormClose() {
    dispatch(closeGoalForm());
  }

  // Debt From Likning  
  const [debtFormOpen, setDebtFormOpen] = useState(false);

  const openDebtForm = () => {
    setDebtFormOpen((prev) => !prev);
  };
  
  function navStyle(){
    if(props.isMobile){
      return {
        display: props.navOpened ? 'block' : 'none'
      }
    }else{
      return {}
    }
  }

  return (
    <div>
      <Navbar style={navStyle()}
        width={{
          // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
          sm: 300,

          // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
          lg: 250,

          // When other breakpoints do not match base width is used, defaults to 100%
          base: 0,
        }}
      >
        <Navbar.Section grow mt="md">
          <div style={{ padding: 10 }}>
            <Box>
              <NavLink
                  style={{ borderRadius: 8,marginBottom:10}}
                  label={props.currentPage === "Dashboard" ?<Text fw={600}>Dashboard</Text>:<Text>Dashboard</Text>}
                  icon={props.currentPage === "Dashboard" ?<DashboardIconBlue style={{width:16,height:16}}/> : <DashboardIcon style={{width:16,height:16}}/>}
                  rightSection={<></>}
                  onClick={() => navigate("/dashboard")}
                  active={props.currentPage === "Dashboard"}
              />
              <NavLink
                  style={{ borderRadius: 8,marginBottom:10 }}
                  label={props.currentPage === "Transactions" ?<Text fw={600}>Tranzacții</Text>:<Text>Tranzacții</Text>}
                  icon={props.currentPage === "Transactions" ?<TransactionsIconBlue style={{width:16,height:16}}/> : <TransactionsIcon style={{width:16,height:16}}/>}
                  rightSection={<></>}
                  onClick={() => navigate("/transaction")}
                  active={props.currentPage === "Transactions"}
              />
              <NavLink
                  style={{ borderRadius: 8,marginBottom:10}}
                  label={props.currentPage === "Accounts" ?<Text fw={600}>Conturi</Text>:<Text>Conturi</Text>}
                  icon={props.currentPage === "Accounts" ?<AccountsIconBlue style={{width:16,height:16}}/> : <AccountsIcon style={{width:16,height:16}}/>}
                  rightSection={<></>}
                  onClick={() => navigate("/account")}
                  active={props.currentPage === "Accounts"}
              />
              <NavLink
                  style={{ borderRadius: 8,marginBottom:10 }}
                  label={props.currentPage === "Budgets" ?<Text fw={600}>Bugete</Text>:<Text>Bugete</Text>}
                  icon={props.currentPage === "Budgets" ?<BudgetIconBlue style={{width:16,height:16}}/> : <BudgetIcon style={{width:16,height:16}}/>}
                  rightSection={<></>}
                  onClick={() => navigate("/budget")}
                  active={props.currentPage === "Budgets"}
              />
              <NavLink
                  style={{ borderRadius: 8,marginBottom:10 }}
                  label={props.currentPage === "Goals" ?<Text fw={600}>Obiective</Text>:<Text>Obiective</Text>}
                  icon={props.currentPage === "Goals" ?<GoalsIconBlue style={{width:16,height:16}}/> : <GoalsIcon style={{width:16,height:16}}/>}
                  rightSection={<></>}
                  onClick={() => navigate("/goal")}
                  active={props.currentPage === "Goals"}
              />
              <NavLink
                  style={{ borderRadius: 8,marginBottom:10 }}
                  label={props.currentPage === "Debts" ?<Text fw={600}>Datorii</Text>:<Text>Datorii</Text>}
                  icon={props.currentPage === "Debts" ?<DebtsIconBlue style={{width:16,height:16}}/> : <DebtsIcon style={{width:16,height:16}}/>}
                  rightSection={<></>}
                  onClick={() => navigate("/debts")}
                  active={props.currentPage === "Debts"}
              />
              <NavLink
                  style={{ borderRadius: 8,marginBottom:10 }}
                  label={props.currentPage === "Reports" ?<Text fw={600}>Rapoarte</Text>:<Text>Rapoarte</Text>}
                  icon={props.currentPage === "Reports" ?<ReportsIconBlue style={{width:16,height:16}}/> : <ReportsIcon style={{width:16,height:16}}/>}
                  onClick={() => navigate("/report")}
                  rightSection={<></>}
                  active={props.currentPage === "Reports"}
              />
              <NavLink
                  style={{ borderRadius: 8,marginBottom:10 }}
                  label={props.currentPage === "Chat" ?<Text fw={600}>Chat</Text>:<Text>Chat</Text>}
                  icon={props.currentPage === "Chat" ?<ChatbotIconBlue style={{width:16,height:16}}/> : <ChatbotIcon style={{width:16,height:16}}/>}
                  onClick={() => navigate("/chat")}
                  rightSection={<></>}
                  active={props.currentPage === "Chat"}
              />
            </Box>
          </div>
        </Navbar.Section>
        <Navbar.Section>
          <Menu position="right" radius={"md"} withArrow shadow="xl" width={200} transitionProps={{ transition: 'scale-x', duration: 150 }}>
            <Menu.Target >
              <div style={{ padding: 10 }}>
                <Button
                    leftIcon={<AddIcon style={{width:16,height:16}}/>}
                    radius={"md"}
                    fullWidth
                    style={{marginTop:10, background:"#004d00"}}
                >
                  Adaugă
                </Button>
              </div>

            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<AddCategoryIcon style={{height:20,width:20}} />}  transitionProps={{ transition: 'rotate-right', duration: 150 }} onClick={() => dispatch(showCategoryForm())}>
                <Text size={"sm"}>Adaugă Categorie</Text>
              </Menu.Item>
              <Menu.Item icon={<AddAccountIcon style={{height:20,width:20}} />}  transitionProps={{ transition: 'rotate-right', duration: 150 }} onClick={() => dispatch(showAccountForm())}>
                Adaugă Cont
              </Menu.Item>
              <Menu.Item icon={<AddTransactionIcon style={{height:20,width:20}} />}  transitionProps={{ transition: 'rotate-right', duration: 150 }} onClick={() => dispatch(showTransactionForm())}>
               Adaugă Tranzacție
              </Menu.Item>
              <Menu.Item icon={<AddBudgetIcon style={{height:20,width:20}} />}  transitionProps={{ transition: 'rotate-right', duration: 150 }} onClick={() =>dispatch(showBudgetForm())}>
              Adaugă Buget
              </Menu.Item>
              <Menu.Item icon={<AddGoalIcon style={{height:20,width:20}} />}  transitionProps={{ transition: 'rotate-right', duration: 150 }} onClick={() => dispatch(showGoalForm())}>
              Adaugă Obiectiv
              </Menu.Item>
              <Menu.Item icon={<AddDebtIcon style={{height:20,width:20}} />}  transitionProps={{ transition: 'rotate-right', duration: 150 }} onClick={openDebtForm} >
              Adaugă Datorie
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <CategoryForm
            open={displayCategoryForm}
            close={handleCategoryFormClose}
          ></CategoryForm>
          <AccountForm
              open={displayAccountForm}
              close={handleAccountFormClose}></AccountForm>
          <TransactionForm
              open={displayTransactionForm}
              close={handleTransactionFormClose}></TransactionForm>
          <BudgetForm open={displayBudgetForm} close={handleBudgetFormClose}/>
          <GoalForm open={displayGoalForm} close={handleGoalFormClose}/>
          <DebtForm isOpen={debtFormOpen} onClose={openDebtForm}/>

        </Navbar.Section>
      </Navbar>
    </div>
  );
}
