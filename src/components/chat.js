import { firestore } from "../firebase";
import { firebasedb } from "../firebase";
window.Addfriend = Addfriend;
window.startchat = startchat;
window.mobilechat = mobilechat;
window.getEmoji = getEmoji;

var chatkey = "";
var currentUserKey = "";
var currentUser = "";

export function toggle() {
  var blur = document.getElementById("blur");
  blur.classList.toggle("active");
}



export async function loadchathistory(userid) {
  currentUserKey = userid;

  document.getElementById("loaduserfriends").innerHTML = "";

  firebasedb.ref("friend-list").on("value", function (lists) {
    lists.forEach(function (data) {
      var lst = data.val();
      var lastmsgkey;

      var friendkey = "";
      if (lst.currentuser === userid) {
        friendkey = lst.friendId;
        lastmsgkey = data.key;
      } else if (lst.friendId === userid) {
        friendkey = lst.currentuser;
        lastmsgkey = data.key;
      }

      if (friendkey !== "") {
        document.getElementById(
          "loaduserfriends"
        ).innerHTML = `  <li class="list-group-item color-grey" >
                     <input type="text" placeholder="Search or new chat" class="form-control rounded4" />
                 </li>`;
      }

      //  console.log(lst.currentuser,userid,lst.friendId);

      if (friendkey !== "") {
       
        var lastmessage = "";

        firestore
          .collection("users")
          .doc(friendkey)
          .get()
          .then((snapshot) => {
            var userdata = snapshot.data();

           

            var db = firebasedb.ref("chatMessage").child(lastmsgkey);

            db.on("value", function (chats) {
              chats.forEach(function (data) {
                var chat = data.val();

                if (chat.msg.indexOf("base64") !== -1) {
                  lastmessage = "Open to see the image";
                } else {
                  lastmessage = chat.msg;
                }
              });

              
              
             
              

             

              document.getElementById(
                "loaduserfriends"
              ).innerHTML += `<li class="list-group-item list-group-item-action bg-color-1 padding-2rem" onclick="startchat('${userdata.username}', '${userdata.profilepicture}', '${userid}','${friendkey}')">
                                                       <div id="friendchat" onclick="mobilechat('${userdata.username}', '${userdata.profilepicture}', '${userid}','${friendkey}')">
                                                           <div class="row">
                                                               <div class ="col-2 col-md-2 col-sm-2 p-0">
                                                                 
                                                                     
                                                                   <img src=${userdata.profilepicture} alt="" class="friends-pic" />
                                                                      
                                           
                                                                      
                                                                  
                                           
                                           
                                                               </div>
                                           
                                                               <div class ="col-10 col-md-10 col-sm-10 cursor-pointer p-0 special-class">
                                                                   <div class ="name">
                                                                       ${userdata.username}
                                                                   </div>
                                           
                                                                   <div class ="under-name">
                                                                       ${lastmessage.slice(0,10)}
                                                                       
                                                                   </div>
                                           
                                                               </div>
                                           
                                           
                                                           </div>
                                                       </div>
                                           
                                                   </li>`;
            });
          });
      }
    });
  });
}

function LoadChatMessages(chatkey) {
  var db = firebasedb.ref("chatMessage").child(chatkey);

  db.on("value", function (chats) {
    var message = "";

    chats.forEach(function (data) {
      var chat = data.val();

      var dateTime = chat.dateTime.split(",");
      var msg = "";

      if (chat.msg.indexOf("base64") !== -1) {
        msg = `<img src = '${chat.msg}' class = "img-fluid"/>`;
        
      } else {
        msg = chat.msg;
      
      }

      if (chat.currentuser === currentUserKey) {
        message += `<div class="row justify-content-end">
                     <div class="col-6 col-sm-7 col-md-7">
                       <p class = "sentmsg">${msg}
                       <span class = "msgtime" title = "${dateTime[0]}">${dateTime[1]}</span>
                       </p>
                     </div>
    
                </div>`;
      } else {
        message += `<div class="row">
                            <div class="col-6 col-sm-7 col-md-7">
                              <p class = "receivemsg">${msg}
                              <span class = "msgtime" title = "${dateTime[0]}">${dateTime[1]}</span>
                              </p>
                            </div>
           
                       </div>`;
      }
    });

    document.getElementById("messages").innerHTML = message;
    const messagediv = document.getElementById("messages");

    if (messagediv) {
      messagediv.scrollTop = messagediv.scrollHeight;
    }
    
  });
}

export function startchat(username, profilepicture, currentuserid, userid) {
  if (window.innerWidth > 1000) {
    var friendlist = { friendId: userid, currentuser: currentuserid };

    //  Check if both the Users are already present in friend-list or not...

    var db = firebasedb.ref("friend-list");

    var flag = false;

    db.on("value", function (friends) {
      friends.forEach(function (data) {
        var user = data.val();
        if (
          (user.friendId === friendlist.friendId &&
            user.currentuser === friendlist.currentuser) ||
          (user.friendId === friendlist.currentuser &&
            user.currentuser === friendlist.friendId)
        ) {
          flag = true;
          chatkey = data.key;
        }
      });
    });

    // Create friend list of User...
    if (flag === false) {
      chatkey = firebasedb
        .ref("friend-list")
        .push(friendlist, function (error) {
          if (error) alert(error);
          else {
            firestore
              .collection("Connection-list")
              .doc(currentuserid)
              .set(friendlist);
            currentUser = currentuserid;

            document.getElementById("userfriend-pic").src = "";
            document.getElementById("userfriend-pic").src = profilepicture;
            document.getElementById("userfriend-name").textContent = username;
            document.getElementById("messages").innerHTML = "";
            document
              .getElementById("chatpanel")
              .classList.remove("display-none");
            document
              .getElementById("divstart")
              .setAttribute("style", "display:none !important");
          }
        })
        .getKey();
    } else {
      firestore
        .collection("Connection-list")
        .doc(currentuserid)
        .set(friendlist);
      currentUser = currentuserid;

      document.getElementById("userfriend-pic").src = "";
      document.getElementById("userfriend-pic").src = profilepicture;
      document.getElementById("userfriend-name").textContent = username;
      document.getElementById("messages").innerHTML = "";
      document.getElementById("chatpanel").classList.remove("display-none");
      document
        .getElementById("divstart")
        .setAttribute("style", "display:none !important");
    }

    // Display the chat messages....

    LoadChatMessages(chatkey);
  }
}

export function mobilechat(username, profilepicture, currentuserid, userid) {
  if (window.innerWidth <= 1000) {
    var friendlist = { friendId: userid, currentuser: currentuserid };

    //  Create friend-list of users for mobile-width...

    var db = firebasedb.ref("friend-list");

    var flag = false;

    db.on("value", function (friends) {
      friends.forEach(function (data) {
        var user = data.val();
        if (
          (user.friendId === friendlist.friendId &&
            user.currentuser === friendlist.currentuser) ||
          (user.friendId === friendlist.currentuser &&
            user.currentuser === friendlist.friendId)
        ) {
          flag = true;
          chatkey = data.key;
        }
      });
    });

    if (flag === false) {
      chatkey = firebasedb
        .ref("friend-list")
        .push(friendlist, function (error) {
          if (error) alert(error);
          else {
            firestore
              .collection("Connection-list")
              .doc(currentuserid)
              .set(friendlist);
            currentUser = currentuserid;

            document.getElementById("userfriend-pic").src = "";
            document.getElementById("userfriend-pic").src = profilepicture;
            document.getElementById("userfriend-name").textContent = username;
            document.getElementById("messages").innerHTML = "";
            document
              .getElementById("chatpanel")
              .classList.remove("display-none");
            document
              .querySelector(".mobile-chatlist")
              .setAttribute("style", "display: none");
            document
              .querySelector(".mobile-chatbox")
              .setAttribute("style", "display:block");
          }
        })
        .getKey();
    } else {
      firestore
        .collection("Connection-list")
        .doc(currentuserid)
        .set(friendlist);
      currentUser = currentuserid;

      document.getElementById("userfriend-pic").src = "";
      document.getElementById("userfriend-pic").src = profilepicture;
      document.getElementById("userfriend-name").textContent = username;
      document.getElementById("messages").innerHTML = "";
      document.getElementById("chatpanel").classList.remove("display-none");
      document
        .querySelector(".mobile-chatlist")
        .setAttribute("style", "display: none");
      document
        .querySelector(".mobile-chatbox")
        .setAttribute("style", "display:block");
    }

    // Display the chat messages....

    LoadChatMessages(chatkey);
  }
}

export function showchatlist() {
  if (window.innerWidth <= 1000) {
    document
      .querySelector(".mobile-chatbox")
      .setAttribute("style", "display: none");
    document
      .querySelector(".mobile-chatlist")
      .setAttribute("style", "display:block");
  }
}

export function focusinput() {
  document.getElementById("microphone").setAttribute("style", "display:none");
  document.getElementById("sendmessage").setAttribute("style", "display:block");
  document
    .getElementById("msgtextarea")
    .setAttribute("style", "flex:20 !important");
}

export function showrmicrophone() {
  document
    .getElementById("msgtextarea")
    .setAttribute("style", "flex:15 !important");
  document.getElementById("sendmessage").setAttribute("style", "display:none");
  document.getElementById("microphone").setAttribute("style", "display:block");

  // document
  //   .getElementById("Attachment")
  //   .setAttribute("style", "display: none !important");
  // document
  //   .getElementById("attachment-paperclip")
  //   .setAttribute("style", "display: block !important");
}

export function auto_grow(element) {
  element.style.height = "5px";
  element.textarea.style.height = element.scrollHeight + "px";
}

export function keypressed(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
  }
}

export function sendMessage() {
 
  if (document.getElementById("inputmessage").value !== "") {
    var chatmessage = {
      currentuser: currentUserKey,
      msg: document.getElementById("inputmessage").value,
      dateTime: new Date().toLocaleString(),
    };

    if (chatkey !== "") {
      firebasedb
        .ref("chatMessage")
        .child(chatkey)
        .push(chatmessage, function (error) {
          if (error) alert(error);
          else {
            document.getElementById("inputmessage").value = "";
            document.getElementById("inputmessage").focus();
          }
        });
    }
  }
}

export function showdropdown() {
  document.getElementById("dropdown_icon").style.display = "none";
  document.querySelector(".dropdown_menu").style.display = "block";
}

export function close_dropdown() {
  document.querySelector(".dropdown_menu").style.display = "none";
  document.getElementById("dropdown_icon").style.display = "block";
}

function Addfriend(username, profilepicture, currentUserid) {
  var friendid;

  async function getfriendid() {
    await firestore
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .onSnapshot((querysnapshot) => {
        querysnapshot.forEach((doc) => {
          friendid = doc.id;
          startchat(username, profilepicture, currentUserid, friendid);
          mobilechat(username, profilepicture, currentUserid, friendid);
          toggle();
          closeUserlst();
        });
      });
  }
  getfriendid();
}

export function populateUserslist(usersDetails, currentUserid) {
  document.getElementById("Userslist").innerHTML = `<div class = "text-center">
                                                           <span class = "spinner-border text-primary mt-5" style = "width:7rem;height:7rem;"></span>
                                                          </div>`;

  {
    /* list of all users from database... */
  }
  var lst;

  if (usersDetails.length > 0) {
    lst = `
              
              <li class="list-group-item color-grey" >
                <input type="text" placeholder="Search or new chat" class="form-control rounded4" />
              </li>`;

    usersDetails.map((user) => {
      lst += ` <li class="list-group-item list-group-item-action bg-color-1 padding-2rem Add-friend" id = ${user.username} onclick = "Addfriend('${user.username}','${user.profilepicture}','${currentUserid}')">
              
                     <div class="row">
                       <div class="col-2 col-md-2 col-sm-2 p-0">
                          <img src=${user.profilepicture} alt="" class ="Users-pic" />
                             
                       </div>
  
                      <div class="col-10 col-md-10 col-sm-10 cursor-pointer p-0 special-class">
                          <div class="Username">
                              ${user.username}
                          </div>
  
                          <div class="under-name">
       
                          </div>
                       </div>
                      

                     </div>
  
              </li>`;
    });
  } else {
    lst = ` <li class="list-group-item color-grey" >
                 Empty
       </li>`;
  }

  document.getElementById("Userslist").innerHTML = lst;
}

export function openUserList(usersDetails, currentUserid) {
  document
    .querySelector(".modal")
    .setAttribute("style", "display: block !important");
  populateUserslist(usersDetails, currentUserid);
}
export function closeUserlst() {
  document
    .querySelector(".modal")
    .setAttribute("style", "display: none !important");
  close_dropdown();
}

// export function showattachment() {
//   document
//     .getElementById("Attachment")
//     .setAttribute("style", "display: block !important");
//   document
//     .getElementById("attachment-paperclip")
//     .setAttribute("style", "display: none !important");
// }

export function chooseImage() {
  document.getElementById("imageFile").click();
}

export function sendImage(event) {
  var file = event.target.files[0];

  if (!file.type.match("image.*")) {
    alert("Please select image only.");
  } else {
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        var chatmessage = {
          currentuser: currentUserKey,
          msg: reader.result,
          dateTime: new Date().toLocaleString(),
        };

        if (chatkey !== "") {
          firebasedb
            .ref("chatMessage")
            .child(chatkey)
            .push(chatmessage, function (error) {
              if (error) alert(error);
              else {
                document.getElementById("inputmessage").value = "";
                document.getElementById("inputmessage").focus();
              }
            });
        }
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}

export function  showEmojipanel(){
   document.getElementById("emojies").style.display = "block";
   loadEmoji();
   
}

export function hideEmojipanel(){
  document.getElementById("emojies").style.display = "none";

}

export function getEmoji(control){
   
  document.getElementById("inputmessage").value += control.innerHTML.trim();
  
}


function loadEmoji(){
  var Allemojies = "";

  for(var i=128512;i<=129488;i++){
    Allemojies += `<div class = "font-size-50px ArrangeEmojies" onclick = "getEmoji(this)">
    &#${i};
  </div>` 
  }
 
  document.getElementById("nav-home").innerHTML = Allemojies;
  
   
}
