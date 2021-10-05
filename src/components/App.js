import React from "react";
import Signup from "../authentication/Signup";
import { AuthProvider } from "../contexts/AuthContext";
import {BrowserRouter as Router,Switch,Route,Redirect} from 'react-router-dom'
import Dashboard from "../authentication/Dashboard";
import Login from "../authentication/Login";
import PrivateRoute from "../authentication/PrivateRoute";
import Forgetpassword from "../authentication/Forgetpassword";
import Privatechat from "./Privatechat";
import Chatroom from "./Chatroom";
import UpdateProfile from "../authentication/UpdateProfile";






function App() {
 

  return (
    <AuthProvider>
     
           <Router>
            <Switch>
                        
                {/* <PrivateRoute exact path = "/" component = {Dashboard}/> */}
                <Privatechat exact path = "/" component = {Chatroom}></Privatechat>
                <PrivateRoute path = "/profile" component = {Dashboard}/>
                

                <PrivateRoute path = "/update-profile" component = {UpdateProfile}/>
                {/* <Privatechat path = "/chat-room" component = {Chatroom}></Privatechat> */}

                <Route path = "/signup" component = {Signup}/>
                <Route path = "/Login" component = {Login}/>
                <Route path = "/forget-password" component = {Forgetpassword}/>

                

            </Switch>
              
           </Router>




        
        


        
    </AuthProvider>

  );
}

export default App;
