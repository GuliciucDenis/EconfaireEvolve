import "./UserDashboard.css";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import UserTable from "../../components/users/UserTable";
import User from '../../components/common/user/User';

function UserDashboard() {
  return (
    <div className="user-dashboard">
      <Background />
      <User />
      <div className="content">
        <div className="objectives-title-container">
          <h1 className="dashboard-title">User management</h1>
        </div>
        <Navbar />
        <UserTable />
      </div>
    </div>
  );
}

export default UserDashboard;
