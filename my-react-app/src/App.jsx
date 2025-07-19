import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/sidebar"
import HomePage from "./page/home"
import UserPage from "./page/user"
import AssignRole from "./page/assign_role"
import ManageRole from "./page/manage_role"
import BackupPage from "./page/backup"
import RecoveryPage from "./page/recovery"
import AddUserPage from "./page/adduser"
// ... and other pages

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/assign_role" element={<AssignRole />} />
        <Route path="/manage_role" element={<ManageRole />} />
        <Route path="/backup" element={<BackupPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/adduser" element={<AddUserPage />} />
      </Routes>
    </Router>
  )
}

export default App
