import { Routes, Route } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

import { SignIn } from "./SignIn";
import { Home } from "./Home";
import { Signup } from "./Signup";

export function App() {
  const [value, setValue, remove] = useLocalStorage("user", false);
  const navigate = useNavigate();
  let location = useLocation();

  return (
    <Routes>
      {["/home", "/"].map(
        (path, id) =>
          value && (
            <Route
              key={id}
              element={<Home userToken={value.token} userId={value.id} />}
              path={path}
            />
          )
      )}

      {!value && <Route path="/" element={<SignIn setValue={setValue} />} />}
      {!value && <Route path="/signup" element={<Signup />} />}

      <Route path="/*" element={<div>Not Found</div>} />
    </Routes>
  );
}
