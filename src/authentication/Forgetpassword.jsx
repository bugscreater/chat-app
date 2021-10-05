import React, { useRef, useState } from 'react'
import "./style.css"
import { Form, Button, Card, FormGroup, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext"
import CenteredContainer from './CenteredContainer'

function Forgetpassword() {
    
    const [error, setError] = useState("");
    const emailRef = useRef();
    const {forgetpassword} = useAuth();
    const [isreset,setReset] = useState(false);
    const [loading,setLoading]  = useState(false);

    async function resetPassword(e){
          e.preventDefault();


          try {
              setError(""); 
              setLoading(true);
              await forgetpassword(emailRef.current.value);
              setReset(true);


  
             
          } catch (error) {

              setReset(false);
              setError(error.message);
          }

          setLoading(false);

    }

    return (
        <CenteredContainer>
            <Card className = "card-container">
                <Card.Body>
                    <h2 className="text-center mb-4">Reset Password</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {isreset && <Alert variant="success">Check your mail and follow the link to reset your Password.</Alert>}
                    <Form onSubmit = {resetPassword}>
                        <FormGroup id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required></Form.Control>

                        </FormGroup>
                        <Button className="w-100 mt-3 btn btn-success" type="Submit" disabled = {loading}>Reset Password</Button>
                        <div className="w-100 text-center mt-2">
                           <Link to = "/Login" className = "link">Log in</Link>

                        </div>

                    </Form>








                </Card.Body>



            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup"> SignUp</Link>

            </div>
        </CenteredContainer>
    )
}

export default Forgetpassword
