// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');








const config = {
    apiKey: "AIzaSyBOcPDk1k04pcFJMniL6t5F_8puAMUpKbc",
    authDomain: "react-chat-app-c16b7.firebaseapp.com",
    database: "https://react-chat-app-c16b7-default-rtdb.firebaseio.com/",
    projectId:  "react-chat-app-c16b7",
    storageBucket: "react-chat-app-c16b7.appspot.com",
    messagingSenderId:"1092490786894",
    appId: "1:1092490786894:web:cd873a93ce53adfed4eb1f"
};

firebase.initializeApp(config)




// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();



if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
}


messaging.onBackgroundMessage(function(payload) {
    // console.log('Received background message ', payload);
  
    const notificationTitle = "You have a new message";
    const notificationOptions = {
      body: payload.data.message,
      icon: payload.data.icon
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
});
