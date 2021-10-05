import React,{useState} from 'react'
import { mobilechat, startchat } from './chat'
import { firestore } from '../firebase'


function Users(props) {
    // const [userid, setUserid] = useState("");

    // async function getuserid() {

    //     await firestore.collection("users").where("username", "==", props.username).limit(1).onSnapshot((querysnapshot) => {
    //         querysnapshot.forEach((doc) => {

               
    //             setUserid(doc.id);
               



    //         })
    //     });


    // }
    // getuserid();

   
    // firestore.collection('users').doc(props.friendkey).get().then(snapshot=>setFriendDetails(snapshot.data()));
    // console.log(friendDetails);



    

    return (

        <li className="list-group-item list-group-item-action bg-color-1" onClick={() => startchat(props.username, props.profilepicture,props.currentuserid,props.key)}>
            <div id="friendchat" onClick={() => mobilechat(props.username, props.profilepicture,props.currentuserid,props.key)}>
                <div className="row">
                    <div className="col-2 col-md-2 col-sm-2 p-0">
                      
                          
                        <img src={props.profilepicture} alt="" className="friends-pic" />
                           

                           
                       


                    </div>

                    <div className="col-10 col-md-10 col-sm-10 cursor-pointer p-0 special-class">
                        <div className="name">
                            {props.username}
                        </div>

                        <div className="under-name">
                            hii
                        </div>

                    </div>


                </div>
            </div>

        </li>

    )
  
}

export default Users
