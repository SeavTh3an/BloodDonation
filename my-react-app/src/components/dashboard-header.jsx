import "../styles/dashboard-header.css"

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="header-container">
        {/* Left side - Logo and Dashboard */}
        <div className="logo-section">
          <div className="logo-icon">
            <div className="logo-circle"></div>
          </div>
          <span className="dashboard-text">Dashboard</span>
        </div>

        {/* Center - Overview title */}
        <div className="title-section">
          <h1 className="overview-title">Overview</h1>
        </div>

        {/* Right side - Search and icons */}
        <div className="actions-section">
          {/* Search bar */}
          <div className="search-container">
            <div className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <input type="text" placeholder="Search for something" className="search-input" />
          </div>

          {/* Settings icon */}
          <button className="icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          {/* Notification icon with indicator */}
          <button className="icon-button notification-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke="currentColor" strokeWidth="2" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="notification-indicator"></div>
          </button>

          {/* Profile avatar */}
          <div className="profile-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Mobile search bar */}
      <div className="mobile-search-container">
        <div className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <input type="text" placeholder="Search for something" className="search-input" />
      </div>
    </header>
  )
}

export default DashboardHeader
