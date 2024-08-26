import "./UserDashboard.css";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import UserTable from "../../components/users/UserTable";

function UserDashboard() {
  return (
    <div className="user-dashboard">
      <Background />
      <div className="content">
        <Navbar />
        <UserTable />
      </div>
    </div>
  );
}

export default UserDashboard;
