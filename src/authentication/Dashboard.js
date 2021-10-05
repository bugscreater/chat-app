import React, { useState, useEffect } from 'react'
import "./style.css"
import { Button, Card, Alert} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { firestore } from '../firebase'
import { uploadimage } from '../firebase'
import firebase from 'firebase'
import CenteredContainer from './CenteredContainer'




function Dashboard() {
    const [error, setError] = useState("");
    const { currentUser, Logout } = useAuth();

    const history = useHistory();

    const useremail = currentUser.email;

    const [name, setName] = useState("");
    const [userid, setUserid] = useState("");
    const [file, setFile] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [dp,setDp] = useState();


    function chooseFile(e) {
        if (e.target.files[0]) {

            setFile(e.target.files[0]);
            document.getElementById("file-name").textContent = e.target.files[0].name



        }

    }


    function UploadPhoto() {
        if (file) {
            uploadimage(file, userid);
            setDisabled(true);
        }
        else {
            return alert("Please choose  a file");
        }
        setDisabled(false);


       

    }


    async function getusername() {

        await firestore.collection("users").where("email", "==", useremail).limit(1).onSnapshot((querysnapshot) => {
            querysnapshot.forEach((doc) => {

                setName(doc.data().username);
                setUserid(doc.id);
                setDp(doc.data().profilepicture);
               

                if (currentUser.emailVerified) {
                    doc.ref.update({
                        emailverified: true
                    })
                }


            })
        });


    }

    getusername();


    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            firebase.storage().ref(`users/${userid}/profile.jpg`).getDownloadURL().then(imgUrl => {
                
                


                if(document.querySelector(".profile-image")!==null){
                    document.querySelector(".profile-image").src = imgUrl;
                    
                   
                    firestore.collection("users").doc(userid).update({
                        profilepicture:imgUrl
                    })
                
                };
            
            
            
            
            
            });
        }
    })
    

    //  Add username and user-profile-pic to localstorage...


    useEffect(() => {
        
        localStorage.setItem("username",JSON.stringify(name));
        localStorage.setItem("userid",userid);
        
    }, [name,dp])


    //  Set username to the saved localstorage data...

    if(name===""){
        setName(JSON.parse(localStorage.getItem("username")));
    }
  

   
  

    async function handleLogout(e) {
        e.preventDefault();

        try {
            setError("");
            await Logout();
            history.push("/Login")

        } catch (error) {
            setError(error.message);
        }

    }

  
    return (
        <CenteredContainer>
            <Card className="card-container">
                <Card.Body>


                    <h2 className="text-center mb-4 m-auto px-2 mt-1">Profile</h2>
                    {error && <Alert variant="danger"></Alert>}



                    <div className="profile-pic-div">
                        <img src="./images/Avatar.jpg" className="profile-image" id="Photo" />

                    </div>

                    <div className="Upload-Photo">
                        <input type="file" id="file" onChange={chooseFile} className="mt-1 mb-1" id="inp"></input>
                        <label htmlFor="inp" className  = "choose-label"> <i className="fas fa-file-download"></i>Choose Photo</label>
                        <br/>

                          <span>
                                 <strong>Chosen file: </strong>
                                 <span id = "file-name">None</span>

                            

                          </span>

                        
                       
                    

                        <br/>



                        <Button className="w-50 mb-4 mt-2 btn btn-info" onClick={UploadPhoto} disabled={disabled}>Upload</Button>

                    </div>
                    <br />


                    <strong >Welcome, </strong>{currentUser ? name : null}

                    <br/>


                    {
                        !currentUser.emailVerified ?
                            <small>Please complete email verification-step through the link which is sent to your registerd email-id.</small> : <Link to="/" className="link">Click here for chat-room ↪ </Link>


                    }
                    <Link to="/update-profile" className="btn btn-success w-100 mt-5">Update Profile</Link>
                    <Button onClick={handleLogout} className="btn btn-danger w-100 logout mt-2">Log Out</Button>




                </Card.Body>





            </Card>




        </CenteredContainer>
    )
}

export default Dashboard
