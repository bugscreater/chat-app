import React, { useRef, useState } from 'react'
import "./style.css"
import { Form, Button, Card, FormGroup, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext"
import CenteredContainer from './CenteredContainer'



function Login() {


    const emailRef = useRef();
    const passwordRef = useRef();

    

    const {Login} = useAuth()
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const history = useHistory();


   
    


    async function handleSubmit(e) {


        e.preventDefault();



        try {

            setError("");
            setLoading(true);
            await Login(emailRef.current.value, passwordRef.current.value);
           
           
            history.push("/profile");

        } catch (error) {


            setError(error.message);
        }
        setLoading(false)
    }


    return (
        <CenteredContainer>

            <Card  className = "card-container">
                <Card.Body>
                    <h2 className="text-center mb-4">Log In</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <FormGroup id="email">
                            <Form.Label className = "mt-1">Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required></Form.Control>
                            <small className = "smallmsg">We'll never share your email with anyone else.</small>


                        </FormGroup>



                        <FormGroup id="password">
                            <Form.Label className = "mt-1">password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required></Form.Control>

                        </FormGroup>




                        <Button className="w-100 mt-3 btn btn-success" type="Submit" disabled={loading}>Log in</Button>
                    </Form>
                    <div className="w-100 text-center mt-2">
                         <Link to="/forget-password" className = "link">Forget Password</Link>

                    </div>
                </Card.Body>

            </Card>

            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup"> SignUp</Link>

            </div>
        </CenteredContainer>
    )
}

export default Login
