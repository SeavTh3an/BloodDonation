"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../styles/sidebar.css"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: "home", label: "Home", path: "/" },
    { icon: "user", label: "User", path: "/user" },
    { icon: "user-plus", label: "Assign Role", path: "/assign_role" },
    { icon: "wrench", label: "Manage Role", path: "/manage_role" },
    { icon: "database", label: "Backup", path: "/backup" },
    { icon: "folder", label: "Recovery", path: "/recovery" },
    { icon: "settings", label: "Setting", path: "/setting" },
  ]

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const renderIcon = (iconType) => {
    switch (iconType) {
      case "home":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        )
      case "user":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )
      case "user-plus":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        )
      case "wrench":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        )
      case "database":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="m3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="m3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
          </svg>
        )
      case "folder":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <path d="M2 7h20" />
          </svg>
        )
      case "settings":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="m12 1 2.09 6.26L22 9l-6.26 2.09L14 19l-2.09-6.26L4 11l6.26-2.09L12 1z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button className="mobile-toggle" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="accent-bar"></div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
  const isActive =
    item.path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(item.path)

  return (
    <div
      key={index}
      className={`nav-item ${isActive ? "nav-item-active" : ""}`}
      onClick={() => {
        if (item.path) {
          navigate(item.path)
          setIsOpen(false)
        }
      }}
      style={{ cursor: item.path ? "pointer" : "default" }}
    >
      <span className="nav-icon">{renderIcon(item.icon)}</span>
      <span className="nav-label">{item.label}</span>
    </div>
  )
})}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
