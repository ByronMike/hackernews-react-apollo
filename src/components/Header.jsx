import React from "react";
// 0) Import useNavigate
import { Link, useNavigate } from "react-router-dom";
// 0bis) Import AUTH_TOKEN
import { AUTH_TOKEN } from "../constants";

const Header = () => {
  // 1) Inititalisation des variables nagivate (hook UseNavigate) & authToken (localStorage)
  const navigate = useNavigate();
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <Link to="/" className="no-underline black">
          <div className="fw7 mr1">Hacker News</div>
        </Link>
        <Link to="/" className="ml1 no-underline black">
          new
        </Link>
        {/* 4) add a new navigation item to the Header component that brings the user to the /top route */}
        <div className="ml1">|</div>
        <Link to="/top" className="ml1 no-underline black">
          top
        </Link>
        <div className="ml1">|</div>
        <Link to="/search" className="ml1 no-underline black">
          search
        </Link>
        {/* 2) We first retrieve the authToken from local storage. If the authToken is not available, the submit button won’t be rendered. This way, we can make sure only authenticated users can create new links.*/}
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link to="/create" className="ml1 no-underline black">
              submit
            </Link>
          </div>
        )}
      </div>
      {/* 3) Logout / Login button logical */}
      <div className="flex flex-fixed">
        {/* 3.1) Logout (local storage)*/}
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              navigate(`/`);
            }}
          >
            logout
          </div>
        ) : (
          <Link to="/login" className="ml1 no-underline black">
            {/* 3.2) Login (local*/}
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
