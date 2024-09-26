import "./UserDashboard.css";
import Navbar from "../../components/common/navbar/Navbar";
import Background from "../../components/background/Background";
import UserTable from "../../components/users/UserTable";
import User from '../../components/common/user/User';
import LanguageSelector from "../../components/language-selector";
import { useTranslation } from "react-i18next";

function UserDashboard() {
  const {t}=useTranslation();
  return (
    <div className="user-dashboard">
      <div className="user-dashboard-title">
        {/* <h1>User Dashboard</h1> */}
      </div>
      <Background />
      <User />
      <LanguageSelector />
      <div className="content">
        <div className="objectives-title-container">
          <h1 className="dashboard-title">{t('userDashboard.title')}</h1>
        </div>
        <Navbar />
        <UserTable />
      </div>
    </div>
  );
}

export default UserDashboard;
