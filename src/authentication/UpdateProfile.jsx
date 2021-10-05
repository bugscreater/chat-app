import React, {useRef, useState } from 'react'
import "./style.css"
import { Form, Button, Card, FormGroup, Alert } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from 'react-router-dom'
import {createUserDocument} from '../firebase'
import { firestore } from '../firebase'
import firebase from 'firebase'
import CenteredContainer from './CenteredContainer'





export default function UpdateProfile() {
    
    const passwordRef = useRef();
    const usernameRef = useRef();

    const passwordConfirmRef = useRef();
    const history = useHistory();

    const { currentUser,updatePassword} = useAuth()
   
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const useremail = currentUser.email;

    const[name,setName] = useState("");
    const[userid,setUserid] = useState("");

    async function getusername(){
 
        await firestore.collection("users").where("email", "==", useremail).limit(1).onSnapshot((querysnapshot)=>{
              querysnapshot.forEach((doc)=>{

                  setName(doc.data().username);
                  setUserid(doc.id);
                 
                  
                  
                  
              })
        });
         
        
    }

    getusername();

    function updateusername(username){
            firestore.collection("users").doc(userid).update({
                username:username
            })
       
    }
   
   

   
    async function handleSubmit(e) {


        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Password do not match !");
        }
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        var regex =  "^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$";
        if(!username.match(regex)){
            return  setError("Username cannot contain any in-between spaces and not any special character except . _ -");

        }
        
        const isexist = await firestore.collection("users").where("username", "==", username).get();

        if(username !== name && !isexist.empty){
            return setError("This username is not avialable.");
        }
        
        

        try {

            setError("");
            setLoading(true);
            if(username !== name){
                updateusername(username);
            } 

            if(password){
                updatePassword(password);
            }


            history.push("/");
           


        } catch (error) {

           setError(error.message);
        }
        setLoading(false)
    }

    return (

        <CenteredContainer>

            <Card className = "card-container"> 
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                  

                    <Form onSubmit={handleSubmit}>
                        <FormGroup id="username">
                            <Form.Label className = "mt-1">Username</Form.Label>
                            <Form.Control type="text" ref={usernameRef} required defaultValue = {name}></Form.Control>

                        </FormGroup>


                        <FormGroup id="password">
                            <Form.Label className = "mt-1">password</Form.Label>
                            <Form.Control type="password" ref={passwordRef}  placeholder = "Leave blank to keep the same"></Form.Control>

                        </FormGroup>

                        <FormGroup id="password-confirm">
                            <Form.Label className = "mt-1">Confirm password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef}  placeholder = "Leave blank to keep the same"></Form.Control>

                        </FormGroup>


                        <Button className="w-100 mt-3 btn btn-success" type="Submit" disabled={loading}>Update</Button>
                    </Form>
                </Card.Body>

            </Card>

            <div className="w-100 text-center mt-2">
                 <Link to="/" className = "link2">Go back 🔙</Link>
            </div>
        </CenteredContainer>


    )
}


