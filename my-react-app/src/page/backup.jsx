import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import "../styles/homepage.css"
import Backup from "../components/backup"

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <DashboardHeader />
      <Backup />
    </div>
  )
}

export default App
