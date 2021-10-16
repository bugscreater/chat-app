// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');








const config = {
    apiKey: "",
    authDomain: "",
    database: "",
    projectId:  "",
    storageBucket: "",
    messagingSenderId:"",
    appId: ""
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
