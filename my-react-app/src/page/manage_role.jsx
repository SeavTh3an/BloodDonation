import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import "../styles/homepage.css"
import Table from "../components/membertable"

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <DashboardHeader />
      <Table />
    </div>
  )
}

export default App
