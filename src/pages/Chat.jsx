import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/chat.css";

function Chat() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState("dark");

  // YOUR PROFILE (editable)
  const [currentUser, setCurrentUser] = useState({
    name: "Tharun",
    username: "tharunhs",
    bio: "Available",
    profilePic: ""
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [tempBio, setTempBio] = useState(currentUser.bio);
  const [tempImage, setTempImage] = useState(null);

  // 👇 NEW: OTHER USER PROFILE
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);

  const [users] = useState([
    { id: "1", name: "Alex", last: "Hey 👋", bio: "Hey there" },
    { id: "2", name: "John", last: "See you", bio: "Busy" },
    { id: "3", name: "Sara", last: "Ok 👍", bio: "Available" }
  ]);

  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const openChat = (user) => {
    setActiveUser(user);
    setMessages([
      { from: "them", text: "Hello 👋" },
      { from: "me", text: "Hi!" }
    ]);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    setMessages([...messages, { from: "me", text }]);
    setText("");
  };

  const logout = () => {
    navigate("/");
  };

  const saveProfile = () => {
    setCurrentUser({
      ...currentUser,
      bio: tempBio,
      profilePic: tempImage
        ? URL.createObjectURL(tempImage)
        : currentUser.profilePic
    });

    setProfileOpen(false);
  };

  // ⭐ OPEN OTHER USER PROFILE
  const openUserProfile = (user) => {
    setSelectedProfileUser(user);
  };

  return (
    <div className={`wa ${theme}`}>

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="sidebar-top">
          <h3>WhatsApp</h3>

          {/* YOUR PROFILE */}
          <div
            className="profile-small"
            onClick={() => {
              setTempBio(currentUser.bio);
              setProfileOpen(true);
            }}
          >
            👤
          </div>
        </div>

        <div className="chat-list">
          {users.map((u) => (
            <div
              key={u.id}
              className={`chat-item ${activeUser?.id === u.id ? "active" : ""}`}
            >
              
              {/* CLICK PROFILE ICON → OPEN USER PROFILE */}
              <div className="avatar">
                <div
                  className="avatar-circle"
                  onClick={() => openUserProfile(u)}
                />
              </div>

              {/* CLICK ROW → OPEN CHAT */}
              <div onClick={() => openChat(u)}>
                <b>{u.name}</b>
                <p>{u.last}</p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="chat">

        {activeUser ? (
          <>
            <div className="chat-header">
              <div className="avatar"></div>
              <div>
                <b>{activeUser.name}</b>
                <small>online</small>
              </div>
            </div>

            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`bubble ${m.from}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <div className="input-bar">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Message"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>➤</button>
            </div>
          </>
        ) : (
          <div className="empty">Select a chat</div>
        )}
      </div>

      {/* YOUR PROFILE MODAL */}
      {profileOpen && (
        <div className="overlay" onClick={() => setProfileOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>

            <img
              className="big-avatar"
              src={
                tempImage
                  ? URL.createObjectURL(tempImage)
                  : currentUser.profilePic || "https://i.imgur.com/6VBx3io.png"
              }
            />

            <h3>{currentUser.name}</h3>
            <p>@{currentUser.username}</p>

            <textarea
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
            />

            <input type="file" onChange={(e) => setTempImage(e.target.files[0])} />

            <button onClick={saveProfile}>Save Profile</button>

            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              Toggle Theme
            </button>

            <button onClick={logout} className="logout">
              Logout
            </button>

          </div>
        </div>
      )}

      {/* ⭐ OTHER USER PROFILE MODAL */}
      {/* ⭐ OTHER USER PROFILE MODAL */}
{selectedProfileUser && (
  <div className="overlay" onClick={() => setSelectedProfileUser(null)}>
    <div className="drawer modern-profile" onClick={(e) => e.stopPropagation()}>

      {/* PROFILE IMAGE */}
      <img
        className="big-avatar"
        src={
          selectedProfileUser.profilePic ||
          "https://i.imgur.com/6VBx3io.png"
        }
        alt="profile"
      />

      {/* NAME */}
      <h2>{selectedProfileUser.name}</h2>

      {/* USERNAME */}
      <p className="username">@{selectedProfileUser.id}</p>

      {/* BIO */}
      <div className="bio-box">
        <h4>About</h4>
        <p>{selectedProfileUser.bio || "Hey there! I am using ChatApp"}</p>
      </div>

      {/* STATUS INFO (optional WhatsApp style) */}
      <div className="info-box">
        <div>
          <span>Status:</span>
          <b>Available</b>
        </div>

        <div>
          <span>Last Seen:</span>
          <b>today</b>
        </div>
      </div>

      {/* CLOSE */}
      <button
        className="close-btn"
        onClick={() => setSelectedProfileUser(null)}
      >
        Close
      </button>

    </div>
  </div>
)}

    </div>
  );
}

export default Chat;