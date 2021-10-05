import React, {useRef, useState } from 'react'
import "./style.css"
import { Form, Button, Card, FormGroup, Alert } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from 'react-router-dom'
import {createUserDocument} from '../firebase'
import { firestore } from '../firebase'
import CenteredContainer from './CenteredContainer'






export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef();

    const passwordConfirmRef = useRef();
    const history = useHistory();

    const {signup} = useAuth()
   
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);




   
   

   
    async function handleSubmit(e) {


        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Password do not match !");
        }
        const username = usernameRef.current.value;

        var regex =  "^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$";
        if(!username.match(regex)){
            return  setError("Username must contain atleast 5 character and cannot contain any in-between spaces and not any special character except . _ -");

        }

        
        
        
        const isexist = await firestore.collection("users").where("username", "==", username).get();

        if(!isexist.empty){
            return setError("This username is not avialable.");
        }
        
       

        try {

            setError("");
            setLoading(true);
           
            const {user} = await signup(emailRef.current.value, passwordRef.current.value);
            await user.sendEmailVerification();
            const isemailverified = user.emailVerification;
            await createUserDocument(user,{username});
            history.push("/");
           


        } catch (error) {

           setError(error.message);
        }
        setLoading(false)
    }

    return (

        <CenteredContainer>

            <Card className = "card-container">
                <Card.Body >
                    <h2 className="text-center mb-4">Sign Up</h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                  

                    <Form onSubmit={handleSubmit}>
                        <FormGroup id="username">
                            <Form.Label className = "mt-1">Username</Form.Label>
                            <Form.Control type="text" ref={usernameRef} required></Form.Control>

                        </FormGroup>



                        <FormGroup id="email">
                            <Form.Label className = "mt-1">Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required></Form.Control>
                            <small className = "smallmsg">We'll never share your email with anyone else.</small>

                        </FormGroup>



                        <FormGroup id="password">
                            <Form.Label className = "mt-1">Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required></Form.Control>

                        </FormGroup>

                        <FormGroup id="password-confirm">
                            <Form.Label className = "mt-1">Confirm password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required></Form.Control>

                        </FormGroup>


                        <Button className="w-100 mt-4 btn btn-success" type="Submit" disabled={loading}>Sign Up</Button>
                    </Form>
                </Card.Body>

            </Card>

            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/Login">Log in</Link>
            </div>
        </CenteredContainer>


    )
}


