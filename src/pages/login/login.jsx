import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./login.css";
import { login } from "../../redux/apiCalls";
import { loginInitial } from "../../redux/userRedux";
import CircularProgress from "../../components/CircularProgress/CircularProgress";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { error, isFetching } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(loginInitial());
  }, [dispatch]);
  const handleClick = (e) => {
    e.preventDefault();

    login(dispatch, { username, password });
  };
  return (
    <div className="login">
      <div className="loginContainer">
        <h1 className="title">Login</h1>
        <form className="loginForm">
          <div className="loginInput">
            <label>User Name</label>
            <label>first Name</label>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="loginInput">
            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <label style={{ color: "red", marginBottom: "20px" }}>
              Something went wrong! Please try again.
            </label>
          )}
          <button
            disabled={isFetching}
            className={isFetching ? "isFetchingButton" : "button"}
            onClick={handleClick}
          >
            Login
          </button>
        </form>
      </div>
      {isFetching && <CircularProgress />}
    </div>
  );
};

export default Login;
