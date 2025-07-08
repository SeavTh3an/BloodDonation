import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import "../styles/homepage.css"
import Addmember from "../components/create_account"
const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <DashboardHeader />
      <Addmember />
    </div>
  )
}

export default App
