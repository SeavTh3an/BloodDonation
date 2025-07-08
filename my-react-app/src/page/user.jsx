import Sidebar from "../components/sidebar"
import DashboardHeader from "../components/dashboard-header"
import "../styles/homepage.css"
import Member from "../components/member_status"

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <DashboardHeader />
      <Member />
      {/* You can add more components or content here as needed */}
    </div>
  )
}

export default App
