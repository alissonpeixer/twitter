import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Session = ({ children, setSession }) => {
  const navigate = useNavigate();
  let location = useLocation();

  function userInfo() {
    const userObjectInfo = localStorage.getItem("user");
    const userInfo = JSON.parse(userObjectInfo);
    var valide = true;

    if (userObjectInfo === null) {
      return (valide = false);
    }

    setSession({
      infoUser: userInfo.userInfo,
      token: userInfo.userInfo.token,
    });
    return {
      infoUser: userInfo.userInfo,
      token: userInfo.userInfo.token,
    };
  }

  useEffect(() => {
    if (location.pathname === "/home") {
      if (!userInfo().token) {
        navigate("/");
      }
    }

    return;
  }, []);

  return <>{children}</>;
};

export default Session;
