import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import {useAuth} from  '../contexts/AuthContext'


function Privatechat({component:  Component, ...rest}) {
    const {currentUser} = useAuth();

    return (
      <Route
       {...rest}
       render = {props =>{
             return currentUser && currentUser.emailVerified ?<Component {...props}/>:<Redirect to = "/Login"/>
             
       }}
            
      ></Route>
    )
}

export default Privatechat