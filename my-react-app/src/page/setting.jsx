import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import "../styles/homepage.css"
import Dashboardcard from "../components/dashboardcard"

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <DashboardHeader />

    </div>
  )
}

export default App
