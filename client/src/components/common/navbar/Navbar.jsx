import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import home from "../../../images/home (3).png";
import target from "../../../images/target.png";
import history from "../../../images/icons8-history-90.png";
import help from "../../../images/icons8-help-100.png";
import logout from "../../../images/logout 1.png";
import searchUser from "../../../images/userDashboard.png";
import LogoutPopup from "../logout/LogoutPopup";
import { getUserRoleFromToken } from "../../../services/authService";
import { getUserIdFromToken } from "../../../services/userService";

const Navbar = () => {
  const location = useLocation();
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkUserRole = () => {
      const role = getUserRoleFromToken();
      setUserRole(role);
      const fetchUserId = async () => {
        const userId = await getUserIdFromToken();
        console.log("User ID:", userId);
        setUserId(userId);
      };
      fetchUserId();
    };

    checkUserRole();
  }, []);

  const getIconClass = useCallback(
    (path) => {
      return location.pathname === path ? "icon-container active" : "icon-container";
    },
    [location.pathname]
  );

  const handleLogoutClick = useCallback(() => {
    setIsLogoutPopupOpen(true);
  }, []);

  const navbarContent = useMemo(() => (
    <div className="navbar-container">
      <Link to="/home" className="home-link">
        <div className={getIconClass("/home")}>
          <img src={home} className="home-icon" alt="Home" />
        </div>
      </Link>
      {userRole === "admin" && (
        <Link to="/user-dashboard" className="home-link">
          <div className={getIconClass("/user-dashboard")}>
            <img src={searchUser} className="search-icon" alt="User Dashboard" />
          </div>
        </Link>
      )}
      {userId && (
        <>
          <Link to={`/objectives/${userId}`} className="home-link">
            <div className={getIconClass(`/objectives/${userId}`)}>
              <img src={target} className="target-icon" alt="Objectives" />
            </div>
          </Link>
          <Link to={`/history/${userId}`} className="home-link">
            <div className={getIconClass(`/history/${userId}`)}>
              <img src={history} className="history-icon" alt="History" />
            </div>
          </Link>
        </>
      )}
      <Link to="/faq" className="home-link">
        <div className={getIconClass("/faq")}>
          <img src={help} className="help-icon" alt="Help" />
        </div>
      </Link>
      <Link to="#" className="home-link" onClick={handleLogoutClick}>
        <div className={getIconClass("/logout")}>
          <img src={logout} className="logout-icon" alt="Logout" />
        </div>
      </Link>
    </div>
  ), [userRole, userId, getIconClass, handleLogoutClick]);

  return (
    <>
      <nav className="navbar">
        {navbarContent}
      </nav>
      <LogoutPopup
        isOpen={isLogoutPopupOpen}
        onClose={() => setIsLogoutPopupOpen(false)}
      />
    </>
  );
};

export default React.memo(Navbar);
