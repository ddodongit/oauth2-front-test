import { useNavigate } from "react-router-dom";

const host_server_base_url = "http://localhost:8080";

const Login = (props) => {
  const navigate = useNavigate();

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div>Login</div>
      </div>
      <br />

      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          id="kakao"
          type="button"
          onClick={() =>
            (window.location.href = `${host_server_base_url}/api/oauth2/authorization/kakao?redirect_uri=/&mode=login`)
          }
          value={"Kakao Log in"}
        />
        <input
          className={"inputButton"}
          id="naver"
          type="button"
          onClick={() =>
            (window.location.href = `${host_server_base_url}/api/oauth2/authorization/naver?redirect_uri=/&mode=login`)
          }
          value={"Naver Log in"}
        />
        <input
          className={"inputButton"}
          id="google"
          type="button"
          onClick={() => navigate("/google")}
          value={"Google Log in"}
        />
      </div>
    </div>
  );
};

export default Login;
