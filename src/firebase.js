import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore'
import Firebase from "firebase";





const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    database: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

var app;

if (!firebase.apps.length) {
    app = firebase.initializeApp(config);
} else {
    app = firebase.app();
}


export const auth = app.auth();

export const firestore = firebase.firestore();
export const firebasedb = Firebase.database();



export const createUserDocument = async (user, additionalData) => {
    if (!user) return;

    const userRef = firestore.doc(`users/${user.uid}`);

    const snapshot = userRef.get();


    if (!snapshot.exists) {

        const { email } = user;
        const { username } = additionalData;

        try {

            userRef.set({
                username,
                email,
                emailverified: user.emailVerified,
                profilepicture:"./images/Avatar.jpg",
                createdAt: new Date()
            })

        } 
        catch (error) {
            alert(error.message);
        }
    }
}

export function uploadimage(file,userid){
      
    const fileRef  = firebase.storage().ref().child(`/users/${userid}/profile.jpg`); 
     
    fileRef.put(file).then(function(){

         alert("successfully uploaded.");

    }).catch(error =>{
        alert(error.message);
    }).catch(error =>{
        alert(error.message);
    });


  

   


}






export default app






