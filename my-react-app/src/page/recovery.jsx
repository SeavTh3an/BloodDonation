import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import "../styles/homepage.css"
import Recovery from "../components/recovery"

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <DashboardHeader />
      <Recovery />

    </div>
  )
}

export default App
