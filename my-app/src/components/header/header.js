import { React, useState, useEffect } from "react";
import axios from "axios";
import logo from "../../images/header-logo.png";
import { NavLink } from "react-router-dom";
import {
  FaSearchengin,
  FaCartPlus,
  FaShoppingCart,
  FaAlignJustify,
  FaAlignCenter,
} from "react-icons/fa";
import "./header.css";
import Cookies from "js-cookie";
import AccountRoundedIcon from "@mui/icons-material/AccountCircle";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import DashboardPopUp from "../DashboardPopUp/DashboardPopUp";
import TextField from "../text-field/text-field";
import MainButton from "../button/button";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const HeaderPage = (props) => {
  const isUserAuthenticated = Cookies.get("user-token");
  const isAdminAuthenticated = Cookies.get("admin-token");

  const [open, setOpen] = useState(false);
  const [findProducts, setFindProducts] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [dataAllProducts, setDataAllProducts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [userProfile, setUserProfile] = useState(false);
  const [userProfileData, setUserProfileData] = useState([]);
  const [userEditProfileData, setUserEditProfileData] = useState(false);
  const [editUserData, setEditUserData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [displayError, setDisplayError] = useState(false);
  // const [userProfileId, setUserProfileId] = useState("");

  let activeStyle = {
    borderBottom: "3px solid var(--accent-color)",
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleButtonClick = () => {
    for (let i = 0; i < dataAllProducts.length; i++) {
      if (inputValue.toLowerCase() === dataAllProducts[i].name.toLowerCase()) {
        localStorage.setItem("idProduct", dataAllProducts[i].id);
      }
    }
  };

  useEffect(() => {
    if (localStorage.products !== "") {
      setFindProducts(true);
    }
  });
  const handelMenuShow = () => {
    setOpen(true);
  };

  const handelMenuHidden = () => {
    setOpen(false);
  };

  // const handleOpenOrder = () => {
  //   setFindProducts(false);
  // }

  //// fetching the all products
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/product`).then((response) => {
      setAllProducts(response.data);
      setTotalPages(response.data.totalPages);
    });
  }, []);

  // console.log(allProducts);
  // console.log(totalPages);
  const HandleGetNameProducts = async () => {
    const allProducts = [];
    for (let i = 1; i <= totalPages; i++) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/product?page=${i}`
        );
        if (response.status === 200) {
          const data = response.data.items;
          if (data) {
            for (let y = 0; y < data.length; y++) {
              allProducts.push({ name: data[y].name, id: data[y]._id });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    // allProducts array now contains all items with the specific category
    setDataAllProducts(allProducts);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const UserProfileId = Cookies.get("user-id");

  const getUserProfileData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/${id}`
      );
      setUserProfileData(response.data.user);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditChange = (event) => {
    const value = event.target.value;
    setEditUserData({ ...editUserData, [event.target.name]: value });
  };

  const editUserProfileData = async (e) => {
    e.preventDefault();
    const editUserProfileDataForm = {
      fullName: editUserData.fullName,
      address: editUserData.address,
      phoneNumber: editUserData.phoneNumber,
      email: editUserData.email,
      password: editUserData.password,
    };
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/user/${UserProfileId}`,
        editUserProfileDataForm
      );
      console.log(response);
      setUserEditProfileData(false);
      getUserProfileData(UserProfileId);
    } catch (e) {
      console.log(e);
      if (e.response.status == 409) {
        setDisplayError(true);
        setErrorMessage(e.response.data);
      } else {
      }
    }
  };

  return (
    <div className={`holl-header ${isScrolled ? "shadow" : ""}`}>
      <div className="wrapp">
        {/* <div className="left-space"></div> */}
        <div className="logo-search">
          <img className="header-logo" src={logo} width="2rem" height="2rem" />
          <div className="search-icon_search">
            <input
              className="search-bare"
              placeholder="search..."
              onFocus={HandleGetNameProducts}
              value={inputValue}
              onChange={handleInputChange}
            ></input>
            <NavLink to="/products">
              <FaSearchengin
                className="icon-search"
                onClick={handleButtonClick}
              />
            </NavLink>
          </div>
        </div>

        <ul className="list">
          <li>
            <NavLink
              className="link"
              to="/"
              href="#hero"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              className="link"
              to="/products"
              href="#hero"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              className="link"
              to="/training"
              href="#hero"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Training
            </NavLink>
          </li>
          <li>
            <NavLink
              className="link"
              to="/contact"
              href="#hero"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <div className="link header-login">
              Login
              <div className="header-login-dropdown">
                {!isUserAuthenticated ? (
                  <NavLink
                    className="link"
                    to="/user-login"
                    href="#hero"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    User
                  </NavLink>
                ) : (
                  <NavLink
                    // to="user-profile"
                    onClick={() => {
                      setUserProfile(true);
                      getUserProfileData(UserProfileId);
                    }}
                    className="link"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <AccountRoundedIcon />
                      Profile
                    </div>
                  </NavLink>
                )}
                <hr />
                {!isAdminAuthenticated ? (
                  <NavLink
                    className="link"
                    to="/admin-login"
                    href="#hero"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    Admin
                  </NavLink>
                ) : (
                  <NavLink
                    to="/dashboard"
                    className="link"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <LeaderboardRoundedIcon />
                      Dashboard
                    </div>
                  </NavLink>
                )}
              </div>
            </div>
          </li>
        </ul>
        <div className="center-space"></div>
        {/* <div className="main-cart">
          <NavLink to="/order">
            <FaShoppingCart className="cart" />
          </NavLink>
          {findProducts ? <div className="notification"></div> : null}
        </div> */}
        {!open ? (
          <div className="toggle_btn">
            <FaAlignJustify onClick={handelMenuShow} />
          </div>
        ) : (
          <div className="toggle_btn">
            <FaAlignCenter onClick={handelMenuHidden} />
          </div>
        )}
        {open ? (
          <div className="dropdown_menu">
            <li>
              <NavLink
                className="link"
                to="/"
                href="#hero"
                onClick={handelMenuHidden}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                className="link"
                to="/products"
                href="#hero"
                onClick={handelMenuHidden}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="link"
                to="/training"
                href="#hero"
                onClick={handelMenuHidden}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Training
              </NavLink>
            </li>
            <li>
              <NavLink
                className="link"
                to="/contact"
                href="#hero"
                onClick={handelMenuHidden}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Contact
              </NavLink>
            </li>
            <li style={{ padding: 0 }}>
              {!isUserAuthenticated ? (
                <NavLink
                  className="link"
                  to="/user-login"
                  href="#hero"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  User
                </NavLink>
              ) : (
                <NavLink
                  onClick={() => {
                    setUserProfile(true);
                    getUserProfileData(UserProfileId);
                  }}
                  className="link"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <AccountRoundedIcon />
                    Profile
                  </div>
                </NavLink>
              )}
            </li>
            <li style={{ padding: 0 }}>
              {!isAdminAuthenticated ? (
                <NavLink
                  className="link"
                  to="/admin-login"
                  href="#hero"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  Login as admin
                </NavLink>
              ) : (
                <NavLink
                  to="/dashboard"
                  className="link"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <LeaderboardRoundedIcon />
                    Dashboard
                  </div>
                </NavLink>
              )}
            </li>
          </div>
        ) : null}
        {/* <div className="right-space"></div> */}
      </div>
      {userProfile && (
        <DashboardPopUp
          onClick={() => {
            setUserProfile(false);
            setUserEditProfileData(false);
          }}
          title="User Profile"
          onSubmit={editUserProfileData}
        >
          {displayError && (
            <div
              onClick={() => setDisplayError(false)}
              style={{ color: "var(--accent-color)" }}
            >
              {errorMessage}
            </div>
          )}
          <TextField
            label="Full Name"
            type="text"
            name="fullName"
            style={{
              width: "100%",
              fontSize: "16px",
              border: "none",
              boxShadow: "0 1px 2px #999",
            }}
            placeholder={userProfileData.fullName}
            disabled={userEditProfileData ? false : true}
            onChange={handleEditChange}
            defaultValue={userProfileData.fullName}
          />
          <TextField
            label="Address"
            type="text"
            name="address"
            style={{
              width: "100%",
              fontSize: "16px",
              border: "none",
              boxShadow: "0 1px 2px #999",
            }}
            placeholder={userProfileData.address}
            disabled={userEditProfileData ? false : true}
            onChange={handleEditChange}
            defaultValue={userProfileData.address}
          />
          <TextField
            label="Phone"
            type="text"
            name="phoneNumber"
            style={{
              width: "100%",
              fontSize: "16px",
              border: "none",
              boxShadow: "0 1px 2px #999",
            }}
            placeholder={userProfileData.phoneNumber}
            disabled={userEditProfileData ? false : true}
            onChange={handleEditChange}
            defaultValue={userProfileData.phoneNumber}
          />

          <TextField
            label="Email"
            type="email"
            name="email"
            style={{
              width: "100%",
              fontSize: "16px",
              border: "none",
              boxShadow: "0 1px 2px #999",
            }}
            placeholder={userProfileData.email}
            disabled={userEditProfileData ? false : true}
            onChange={handleEditChange}
            defaultValue={userProfileData.email}
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            style={{
              width: "100%",
              fontSize: "16px",
              border: "none",
              boxShadow: "0 1px 2px #999",
            }}
            placeholder="**********"
            disabled={userEditProfileData ? false : true}
            onChange={handleEditChange}
            defaultValue={userProfileData.password}
          />
          {userEditProfileData ? (
            <div className="user-profile-popup-buttons">
              <div>
                <MainButton
                  name="Cancel"
                  style={{
                    backgroundColor: "#fff",
                    color: "#222",
                    border: "1px solid #222",
                  }}
                  onClick={(e) => {
                    setUserEditProfileData(false);
                  }}
                />
                <MainButton type="submit" name="Apply Changes" />
              </div>
            </div>
          ) : (
            <div className="user-profile-popup-buttons">
              <div
                onClick={() => {
                  Cookies.remove("user-token");
                  Cookies.remove("user-id");
                  setUserProfile(false);
                }}
              >
                <LogoutRoundedIcon />
              </div>
              <button
                onClick={() => setUserEditProfileData(true)}
                className="main-button"
              >
                Edit Profile
              </button>
            </div>
          )}
        </DashboardPopUp>
      )}
    </div>
  );
};
export default HeaderPage;
