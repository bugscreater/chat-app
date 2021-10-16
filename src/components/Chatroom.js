import React, { useState, useEffect } from "react";
import { firestore, firebasedb } from "../firebase";
import firebase from "firebase";
import { useAuth } from "../contexts/AuthContext";
import "./chatroom.css";
import {
  showchatlist,
  focusinput,
  showrmicrophone,
  sendMessage,
  showdropdown,
  close_dropdown,
  openUserList,
  closeUserlst,
  toggle,
  loadchathistory,
  showattachment,
  chooseImage,
  sendImage,
  keypressed,
  showEmojipanel,
  hideEmojipanel,
  getEmoji,
  pause,
  record,
} from "./chat";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

function Chatroom() {
  const { currentUser, Logout } = useAuth();

  const useremail = currentUser.email;

  const [name, setName] = useState("");
  const [dp, setDp] = useState("./images/Avatar.jpg");
  const [userid, setUserid] = useState("");
  const [email, setEmail] = useState("");

  // function for fetching username.
  async function getusername() {
    await firestore
      .collection("users")
      .where("email", "==", useremail)
      .limit(1)
      .onSnapshot((querysnapshot) => {
        querysnapshot.forEach((doc) => {
          setName(doc.data().username);
          setDp(doc.data().profilepicture);
          setUserid(doc.id);
          setEmail(doc.data().email);
        });
      });

    const messaging = firebase.messaging();

    messaging
      .requestPermission()
      .then(function () {
        return messaging.getToken();
      })
      .then(function (token) {
       

        if (userid !== "") {
          firebase
            .database()
            .ref("fcmTokens")
            .child(userid)
            .set({ token_id: token });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getusername();

  //  function for making auto-adjustable textarea..

  const textarea = document.querySelector("textarea");
  if (textarea !== null) {
    document.querySelector("textarea").addEventListener("keyup", (e) => {
      textarea.style.height = "10px";
      let scHeight = e.target.scrollHeight;
      textarea.style.height = `${scHeight}px`;
    });
  }

  if (userid !== "") {
    localStorage.setItem("userid", userid);
  }

  if (userid === "") {
    setUserid(localStorage.getItem("userid"));
  }

  useEffect(() => {
    //load users into UsersList...

    loadchathistory(userid);

    const users = [];

    firestore
      .collection("users")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((user) => {
          if (user.data().emailverified) {
            users.push(user.data());
          }
        });
        setUsersDetails(users);
      });
  }, []);

  //  splice the currentuser from friendsDetails...
  const [usersDetails, setUsersDetails] = useState([]);

  usersDetails.forEach((user) => {
    if (user.username === name) {
      const index = usersDetails.indexOf(user);
      usersDetails.splice(index, 1);
    }
  });

  //  function for Log Out user...
  const [error, setError] = useState("");

  async function handleLogout(e) {
    e.preventDefault();

    try {
      setError("");
      await Logout();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <div className="chat-room" id="blur">
        <span className="top"></span>
        {error && <Alert variant="danger"></Alert>}

        <div className="container-fluid bg-white shadow-lg rounded">
          <div className="row h-100">
            <div className="col-md-4  pr-0 mobile-chatlist">
              <div className="card">
                <div className="card-header card-header-modified">
                  <div className="row top-navbar">
                    <div className="col-md-10 col-sm-10 col-10 p-0">
                      <div className="d-flex flex-row">
                        <div className="mydp">
                          <img src={dp} alt="" className="profile-pic" />
                        </div>
                        <div className="name bg-color p-2">{name}</div>
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-2 col-2">
                      <div className="dropleft">
                        <span>
                          <i
                            className="fas fa-ellipsis-v dropdown-icon cursor-pointer"
                            id="dropdown_icon"
                            onClick={showdropdown}
                          ></i>
                        </span>
                        <div className="dropdown_menu">
                          <i
                            className="far fa-times-circle"
                            id="close-dropdown"
                            onClick={close_dropdown}
                          ></i>
                          <ul>
                            <li
                              className="dropdown_item"
                              data-toggle="modal"
                              data-target="#modalUsersList"
                              onClick={() => {
                                toggle();
                                openUserList(usersDetails, userid);
                              }}
                            >
                              New Chat
                            </li>
                            <li className="dropdown_item">
                              <Link to="/profile" className="Profile-link">
                                Profile
                              </Link>
                            </li>
                            <li
                              className="dropdown_item"
                              onClick={handleLogout}
                            >
                              Log out
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body card-body-modified chat-list-style">
                  <ul
                    className="list-group list-group-flush"
                    id="loaduserfriends"
                  >
                    {/* <li className="list-group-item color-grey" >
                                        <input type="text" placeholder="Search or new chat" className="form-control rounded4" />
                                    </li> */}

                    {/* list of all users from database... */}

                    {/* Data populate from datbase... */}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-8 pl-0 mobile-chatbox width-70">
              <div className="card card-height display-none" id="chatpanel">
                <div className="card-header card-header-modified">
                  <div className="row">
                    <div className="chat-header">
                      <i
                        className="fas fa-arrow-left backarrow"
                        onClick={showchatlist}
                      ></i>
                      <div className="person-img col-2 col-sm-2 col-lg-1">
                        <img
                          src="./images/Avatar.jpg"
                          alt=""
                          className="friends-pic"
                          id="userfriend-pic"
                        />
                      </div>

                      <div className="last-seen">
                        <div
                          className="name bg-color"
                          id="userfriend-name"
                        ></div>

                        <div className="under-name">Online</div>
                      </div>

                      <div className="chat-header-icon icon">
                        <i
                          className="fas fa-image"
                          // onClick={showattachment}
                          id="attachment-paperclip"
                          onClick={chooseImage}
                        >
                          {" "}
                          <input
                            type="file"
                            id="imageFile"
                            onChange={sendImage}
                            accept="image/*"
                          />
                        </i>
                        {/* <span className="dropdown-paperclip" id="Attachment">
                          <div className="dropdown_attachment">
                            <ul>
                              <li
                                className="dropdown_item"
                                onClick={chooseImage}
                              >
                                Image{" "}
                                <input
                                  type="file"
                                  id="imageFile"
                                  onChange={sendImage}
                                  accept="image/*"
                                />
                              </li>
                              <li className="dropdown_item">Document</li>
                              <li className="dropdown_item">Camera</li>
                              <li className="dropdown_item">Video</li>
                            </ul>
                          </div>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="card-body card-body-modified"
                  onClick={showrmicrophone}
                  id="messages"
                >
                  <div className="row"></div>
                </div>

                <div className="card-footer card-footer-modified">
                  <div className="row postion-relative">
                    <div className="col-md-12" id="emojies">
                      <nav>
                        <div
                          className="nav nav-tabs"
                          id="nav-tab"
                          role="tablist"
                        >
                          <div
                            className="nav-item nav-link active"
                            id="nav-home-tab"
                            data-toggle="tab"
                            href=""
                            role="tab"
                            aria-controls="nav-home"
                            aria-selected="true"
                          >
                            Smiley
                          </div>
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="nav-home"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex flex-row">
                    <div className="msg-bottom col-sm-1 col-md-1 col-1">
                      <div className="bottom-icons">
                        <i
                          className="far fa-smile fa-2x"
                          onClick={showEmojipanel}
                          id="emoji"
                        ></i>
                      </div>
                    </div>

                    <div
                      className="input-group col-sm-11 col-md-11 col-11"
                      id="msgtextarea"
                    >
                      <textarea
                        className="form-control"
                        placeholder="Type here..."
                        id="exampleFormControlTextarea1"
                        id="inputmessage"
                        rows="2"
                        cols="10"
                        onClick={focusinput}
                        onKeyPress={(e) => keypressed(e)}
                        spellCheck="false"
                        onFocus={hideEmojipanel}
                      ></textarea>
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i
                            className="fa fa-paper-plane"
                            id="sendmessage"
                            onClick={sendMessage}
                          ></i>
                          <i
                            className="fas fa-microphone fa-2x"
                            id="microphone"
                            onClick={record}
                          ></i>

                          <i
                            className="fas fa-stop"
                            id="pause-btn"
                            onClick={pause}
                          ></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="divstart"
                className="text-center d-none d-md-block  chatdivstart"
              >
                <img
                  src="./images/chat-icon2.png"
                  alt=""
                  className="divstart-icon"
                />
                <h3 className="mt-3 divstart-msg">
                  Select your friend from the list and start chatting.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Adding a popup modal for users list */}

      <div className="modal face" id="modalUsersList">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="card">
              <div className="card-header">
                Users List
                <span
                  className="float-right"
                  onClick={() => {
                    toggle();
                    closeUserlst();
                  }}
                >
                  {" "}
                  <i className="far fa-times-circle"></i>
                </span>
              </div>

              <ul
                className="list-group list-group-flush cursor-pointer"
                id="Userslist"
              ></ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatroom;
