import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "./cookies";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  // const params = useParams();

  const [user, setUser] = useState();
  const [token, setToken] = useState({
    accessToken: "",
    refreshToken: "",
  });

  const refresh = async () => {
    console.log("refresh");
    try {
      const data = await axios
        .get("http://localhost:8080/api/user/token/refresh", {
          headers: {
            Authorization: `Bearer ${getCookie("refresh_token")}`,
          },
        })
        .then((response) => response);

      // 응답 성공, data 처리
      console.log(data);
      // window.location.reload();
      return data;
    } catch (error) {
      // 401 응답을 받은 경우
      if (error.response && error.response.status === 401) {
        console.log(error.response);

        // window.location.href = "/logout";
      } else {
        // 다른 종류의 오류 처리
        console.error("요청 실패:", error);
        throw error;
      }
    }
  };

  const getUserProfile = async () => {
    console.log("get profile");
    const data = await axios
      .get("http://localhost:8080/api/user/profile", {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      })
      .then((response) => response.data);
    setUser(data);
    setToken({
      accessToken: getCookie("access_token"),
      refreshToken: getCookie("refresh_token"),
    });
  };

  const logout = async () => {
    console.log("logout");
    const data = await axios
      .get("http://localhost:8080/api/logout", {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      })
      .then((response) => response);
    console.log(data);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "success") {
      console.log("login 파라미터의 값이 'success'입니다.");
    }

    if (!user || token.accessToken) {
      getUserProfile();
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className={"titleContainer"}>
        <div>Welcome!</div>
      </div>
      <div>This is the home page.</div>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => (user ? logout() : navigate("/login"))}
      >
        {user ? "Log out" : "Log in"}
      </button>

      <div className="buttonContainer">
        {user ? (
          <>
            <div className="h5">
              Your email address is
              <span className="mx-2 badge text-bg-warning">{user.email}</span>
            </div>
            <div className="h5">
              Your nickname is
              <span className="mx-2 badge text-bg-success">{user.nickname}</span>
            </div>

            <hr />
            <div className="h6">
              Access Token
              <span className="mx-2 badge text-bg-secondary">{token.accessToken.slice(-50)}</span>
            </div>

            <div className="h6">
              Refresh Token
              <span className="mx-2 badge text-bg-secondary">{token.refreshToken.slice(-50)}</span>
            </div>
            <button type="button" className="btn btn-danger btn-sm" onClick={refresh}>
              refresh
            </button>
          </>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Home;
