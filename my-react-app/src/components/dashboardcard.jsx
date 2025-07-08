import "../styles/dashboardcard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="metrics-grid">
        {/* User Card */}
        <div className="metric-card">
          <div className="icon-container user-bg">
            <svg className="icon user-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
            </svg>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">User</h3>
            <p className="metric-value">1000</p>
          </div>
        </div>

        {/* Backup Card */}
        <div className="metric-card">
          <div className="icon-container backup-bg">
            <svg className="icon backup-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13C19.7 13 20.37 13.13 21 13.35V9L15 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.9 21 5 21H13.35C13.13 20.37 13 19.7 13 19C13 15.69 15.69 13 19 13ZM14 4.5L19.5 10H14V4.5ZM23 18V20H20V23H18V20H15V18H18V15H20V18H23Z" />
            </svg>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Backup</h3>
            <p className="metric-value">0</p>
          </div>
        </div>

        {/* Role Card */}
        <div className="metric-card">
          <div className="icon-container role-bg">
            <svg className="icon role-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5.5C13.93 5.5 15.5 7.07 15.5 9C15.5 10.93 13.93 12.5 12 12.5C10.07 12.5 8.5 10.93 8.5 9C8.5 7.07 10.07 5.5 12 5.5ZM12 2C8.13 2 5 5.13 5 9C5 12.87 8.13 16 12 16C15.87 16 19 12.87 19 9C19 5.13 15.87 2 12 2ZM12 20.5C7.31 20.5 3.5 18.69 3.5 16.5V18C3.5 20.21 7.31 22 12 22C16.69 22 20.5 20.21 20.5 18V16.5C20.5 18.69 16.69 20.5 12 20.5Z" />
            </svg>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Role</h3>
            <p className="metric-value">9</p>
          </div>
        </div>

        {/* Recovery Card */}
        <div className="metric-card">
          <div className="icon-container recovery-bg">
            <svg className="icon recovery-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C7.03 3 3 7.03 3 12H0L4 16L8 12H5C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19C10.07 19 8.32 18.21 7.06 16.94L5.64 18.36C7.27 19.99 9.51 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3Z" />
            </svg>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Recovery</h3>
            <p className="metric-value">0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
