import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import "../styles/homepage.css"
import Role from "../components/role_creation"
const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <DashboardHeader />
      <Role />
    </div>
  )
}

export default App
