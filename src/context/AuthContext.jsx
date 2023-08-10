import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
// import { data } from "autoprefixer";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  let loginUser = async (user) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      });

      if (response.ok) {
        let data = await response.json();

        if (data) {
          if (data.access) {
            localStorage.setItem("authTokens", JSON.stringify(data));
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            return { success: true };
          } else {
            const error = "Access Denied";
            return { success: false, error: error };
          }
        } else {
          const error = "Something went wrong while logging in.";
          return { success: false, error: error };
        }
      } else {
        const data = await response.json();
        console.log(data);
        const err = data.detail;
        return { success: false, error: err };
      }
    } catch (error) {
      const err = "Network error.";
      return { success: false, error: err };
    }
  };

  let logoutUser = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/auth/sign-in");
  };

  // const checkTokenStatus = async (refreshToken) => {
  //   try {
  //     const response = await fetch(
  //       "http://127.0.0.1:8000/api/token/check-refresh-token/",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           refresh: refreshToken,
  //         }),
  //       }
  //     );
  //     return response.data.blacklisted;
  //   } catch (error) {
  //     console.error("Error checking token status:", error);
  //   }
  // };
  const updateToken = async () => {
    let res;
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    const data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      res = true;
    } else {
      logoutUser();
      res = false;
    }

    if (loading) {
      setLoading(false);
    }
    return res;
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    updateToken: updateToken
  };

  // useEffect(() => {
  //   // Check if the flag for the current session exists
  //   const hasEffectRunInSession = sessionStorage.getItem(
  //     "hasEffectRunInSession"
  //   );
  //   const tokens = localStorage.getItem("authTokens");
  //   const currentTime = Date.now() / 1000;
  //   if (!sessionStorage.getItem("hasEffectRunInSession")) {
  //     sessionStorage.setItem("hasEffectRunInSession", false);
  //   }
  //   if (!hasEffectRunInSession) {
  //     if (tokens) {
  //       const t = JSON.parse(tokens);
  //       const u = jwtDecode(t.refresh);
  //       if ((u.exp < currentTime)) {
  //         alert("Your session has expired, please log in again");
  //         navigate("/auth/sign-in");
  //         setAuthTokens(null);
  //         setUser(null);
  //         localStorage.removeItem("authTokens");
  //       }else {
  //         updateToken();
  //       }
  //     } else {
  //       setAuthTokens(null);
  //       setUser(null);
  //     }

  //     // Set the flag to indicate the effect has run in the current session
  //     sessionStorage.setItem("hasEffectRunInSession", true);
  //   }
  // }, []);

  // useEffect(() => {
  //   const tokens = localStorage.getItem("authTokens")
  //   const currentTime = Date.now() / 1000;
  //   if (tokens) {
  //     const u = jwtDecode(tokens);
  //     if (u.exp < currentTime) {
  //       alert("Your session has expired, please loggin again");
  //       navigate("/auth/sign-in");
  //       setAuthTokens(null);
  //       setUser(null);
  //       localStorage.removeItem("authTokens");
  //     } else {
  //       updateToken();
  //     }
  //   } else {
  //     setAuthTokens(null);
  //     setUser(null);
  //   }
  // }, []);

  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 58; // 60 minutes
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
