import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
const Session = ({ children, setSession }) => {
  const navigate = useNavigate();
  let location = useLocation();
  const [value, setValue, remove] = useLocalStorage("user", false);

  return <>{children}</>;
};

export default Session;
