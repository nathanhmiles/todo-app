import React, { useState, useEffect, useContext } from "react";
import $ from "jquery";
import Axios from "axios";
import UserContext from "../context/UserContext";

function Register(props) {
  const { userData, setUserData } = useContext(UserContext);
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    passwordCheck: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setRegisterForm((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  async function submitRegister(e) {
    e.preventDefault();
    try {
      await Axios.post("api/user/register", registerForm);
      const loginRes = await Axios.post("api/user/login", {
        username: registerForm.username,
        password: registerForm.password,
      });
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
        isLoggedIn: true,
      });
      localStorage.setItem("auth-token", loginRes.data.token);
    } catch (err) {
      console.log(err);
    }
  }

  // Allow user to press Enter instead of clicking submit button
  function pressEnterSubmit(e) {
    const key = e.charCode || e.keyCode || 0;
    if (key === 13) {
      e.preventDefault();
      document.querySelector("#submit-register-form").click();
    }
  }

  return (
    <div className="modal fade" id="registerModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Register</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* Body & Form */}
          <form
            onSubmit={submitRegister}
            onKeyPress={pressEnterSubmit}
            className="register-form"
          >
            <div className="modal-body">
              <p>
                You can use Taski without registering, however your notes will
                be deleted when you close or refresh the page.
              </p>
              <p>
                If you want your notes to be saved for later use, please
                register below.
              </p>
              {/* Username */}
              <div className="form-group">
                <input
                  className="form-control task-field"
                  type="text"
                  name="username"
                  placeholder="Username"
                  id="register-username"
                  maxLength="15"
                  value={registerForm.username}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <input
                  className="form-control task-field"
                  type="password"
                  name="password"
                  placeholder="Password"
                  id="register-password"
                  minLength="8"
                  value={registerForm.password}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Password Check */}
              <div className="form-group">
                <input
                  className="form-control task-field"
                  type="password"
                  name="passwordCheck"
                  placeholder="Please re-enter password"
                  id="password-check"
                  minLength="8"
                  value={registerForm.passwordCheck}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Footer & buttons */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => {
                  setRegisterForm({
                    username: "",
                    email: "",
                    password: "",
                  });
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success commit-task-btn"
                id="submit-register-form"
                data-toggle="modal"
                data-target="#registerModal"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
