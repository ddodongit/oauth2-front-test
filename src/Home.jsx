import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "./cookies";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [token, setToken] = useState({
    accessToken: "",
    refreshToken: "",
  });

  async function fetchUserProfile() {
    return axios.get("http://localhost:8080/api/user/profile", {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
  }

  async function reissueToken() {
    return axios.get("http://localhost:8080/api/user/token/refresh", {
      headers: {
        Authorization: `Bearer ${getCookie("refresh_token")}`,
      },
    });
  }

  const getUserProfile = async () => {
    console.log("get profile");

    try {
      const userInfoResponse = await fetchUserProfile();
      setUser(userInfoResponse.data);
      setToken({
        accessToken: getCookie("access_token"),
        refreshToken: getCookie("refresh_token"),
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // access token 만료
        console.log(error.response);
        try {
          const refreshTokenResponse = await reissueToken();
          if (refreshTokenResponse.status === 200) {
            // 새로운 accessToken으로 프로필 정보 재요청
            // http이면 cookie 못 받아옴
            const userInfoResponse = await fetchUserProfile(getCookie("access_token"));
            setUser(userInfoResponse.data);
            setToken({
              accessToken: getCookie("access_token"),
              refreshToken: getCookie("refresh_token"),
            });
          }
        } catch (refreshError) {
          console.log("refersh error");
          // else {
          // refresh token도 만료 또는 유효하지 않음
          throw new Error("Refresh Token expired");
          // }
          // window.location.href = "/login";
        }
      } else {
        // 다른 종류의 오류 처리
        console.error("요청 실패:", error);
        throw error;
      }
    }
  };

  const logout = async () => {
    console.log("logout");
    const data = await axios
      .post(
        "http://localhost:8080/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      )
      .then((response) => response);
    console.log(data);
    setToken({
      accessToken: "",
      refreshToken: "",
    });
    setUser(null);
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
          </>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default Home;
