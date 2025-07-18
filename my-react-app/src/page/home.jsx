import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import "../styles/homepage.css"
import Dashboardcard from "../components/dashboardcard"
import TestConnection from "../components/test-connection"

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <DashboardHeader />
      <Dashboardcard />
    </div>
  )
}

export default App
