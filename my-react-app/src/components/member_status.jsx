import "../styles/member_status.css"
import { useNavigate } from "react-router-dom"

const MemberManagement = () => {
  const navigate = useNavigate()

  const members = [
    {
      name: "Jane Cooper",
      hospital: "Microsoft",
      phone: "(225) 555-0118",
      email: "jane@microsoft.com",
      country: "United States",
      status: "Active",
    },
    {
      name: "Floyd Miles",
      hospital: "Yahoo",
      phone: "(205) 555-0100",
      email: "floyd@yahoo.com",
      country: "Kiribati",
      status: "Inactive",
    },
    {
      name: "Ronald Richards",
      hospital: "Adobe",
      phone: "(302) 555-0107",
      email: "ronald@adobe.com",
      country: "Israel",
      status: "Inactive",
    },
    {
      name: "Marvin McKinney",
      hospital: "Tesla",
      phone: "(252) 555-0126",
      email: "marvin@tesla.com",
      country: "Iran",
      status: "Active",
    },
    {
      name: "Jerome Bell",
      hospital: "Google",
      phone: "(629) 555-0129",
      email: "jerome@google.com",
      country: "Réunion",
      status: "Active",
    },
    {
      name: "Kathryn Murphy",
      hospital: "Microsoft",
      phone: "(406) 555-0120",
      email: "kathryn@microsoft.com",
      country: "Curaçao",
      status: "Active",
    },
    {
      name: "Jacob Jones",
      hospital: "Yahoo",
      phone: "(208) 555-0112",
      email: "jacob@yahoo.com",
      country: "Brazil",
      status: "Active",
    },
    {
      name: "Kristin Watson",
      hospital: "Facebook",
      phone: "(704) 555-0127",
      email: "kristin@facebook.com",
      country: "Åland Islands",
      status: "Inactive",
    },
  ]

  return (
    <div className="member-management">
      <div className="header1">
        <div className="header-left">
          <h1 className="title">All Member</h1>
          <p className="subtitle">Active Members</p>
        </div>
        <div className="header-right">
          <button className="add-button" onClick={() => navigate("/adduser")}>
            <span className="plus-icon">+</span>
          </button>
          <div className="sort-dropdown">
            <span className="sort-label">Sort by:</span>
            <select className="sort-select">
              <option>Newest</option>
              <option>Oldest</option>
              <option>Name A-Z</option>
              <option>Name Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Hospital</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Country</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td className="member-name">{member.name}</td>
                <td>{member.hospital}</td>
                <td>{member.phone}</td>
                <td>{member.email}</td>
                <td>{member.country}</td>
                <td>
                  <span className={`status-badge ${member.status.toLowerCase()}`}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">Showing data 1 to 8 of 256K entries</div>
        <div className="pagination-controls">
          <button className="pagination-arrow">‹</button>
          <button className="pagination-number active">1</button>
          <button className="pagination-number">2</button>
          <button className="pagination-number">3</button>
          <button className="pagination-number">4</button>
          <span className="pagination-dots">...</span>
          <button className="pagination-number">40</button>
          <button className="pagination-arrow">›</button>
        </div>
      </div>
    </div>
  )
}

export default MemberManagement
