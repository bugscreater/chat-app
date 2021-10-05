import React, {useContext,useState,useEffect} from 'react'
import {auth} from '../firebase'



const AuthContext = React.createContext()


export  function useAuth(){
    return useContext(AuthContext)
}

export  function AuthProvider({children}) {

    const [currentUser,setCurrentUser] = useState()
    const [loading,setLoading] = useState(true);

    
    function signup(email,password){
        return auth.createUserWithEmailAndPassword(email,password);
    }


    function Login(email,password){

        return auth.signInWithEmailAndPassword(email,password);
    }
    
    function Logout(){
        localStorage.setItem("userid",null);
        localStorage.setItem("username",null);
        

        return auth.signOut();
    }


    function forgetpassword(email){
        return auth.sendPasswordResetEmail(email);
    }

    function updatePassword(password){
        return currentUser.updatePassword(password);
    }
   


    useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged(user=>{
           setCurrentUser(user);

           setLoading(false);
       })

       return unsubscribe
    }, [])

    const value = {
          currentUser,
          signup,
          Login,
          Logout,
          forgetpassword,
          updatePassword
         
    }
    return (
       <AuthContext.Provider value = {value}>
           {!loading && children}
       </AuthContext.Provider>
    )
}


