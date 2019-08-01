import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import InputGroup from "../common/InputGroup";
import { login } from "../../actions/authActions";

const Login = props => {
  console.log("Login props", props);
  const {
    auth: { loading, error, token, isAuthenticated },
    login
  } = props;
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    // eslint-disable-next-line
  }, [isAuthenticated]);

  const onSubmit = () => {
    setErrors({});
    if (account === "" || password === "") {
      setErrors({ account: "請輸入帳密後登入" });
    } else {
      login({
        account,
        password
      });

      // Clear Fields
      //setAccount("");
      //setPassword("");
    }
  };

  return (
    <div className="text-center">
      <div className="card m-3  " style={formSignInStyle}>
        <h3 className="card-header"> 登入 </h3>

        <div className="card-body">
          {" "}
          <InputGroup
            placeholder="* 帳號"
            type="text"
            name="account"
            value={account}
            onChange={e => setAccount(e.target.value)}
            error={errors.account}
            info="帳號"
            icon="fas fa-user"
          />{" "}
          <InputGroup
            placeholder="* 密碼"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            info="密碼"
            icon="fas fa-lock"
          />{" "}
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onSubmit}
          >
            確認
          </button>
        </div>
        <div className="card-footer text-muted">
          {error && (
            <Fragment>
              <i className="fas fa-exclamation-triangle text-danger" /> {error}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

const formSignInStyle = {
  width: "100%",
  maxWidth: "330px",
  margin: "auto",
  borderColor: "silver"
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { login }
)(Login);
