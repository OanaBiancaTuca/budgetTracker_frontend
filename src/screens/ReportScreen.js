import Layout from "../components/Layout";
import ReportHeader from "../components/reports/ReportHeader";
import ReportList from "../components/reports/ReportList";
export default function  ReportScreen(){
    return(
        <Layout title={"Rapoarte"} load={true}>
            <div>
                <ReportHeader/>
                <ReportList/>
            </div>
        </Layout>
    )
}