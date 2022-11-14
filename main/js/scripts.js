      //get SDKs
      import { initializeApp } from 'firebase/app';
      import { 
          getAuth,
          onAuthStateChanged,
          createUserWithEmailAndPassword,
          signInWithEmailAndPassword,
          signOut
      } from 'firebase/auth';           
      import { 
        getFirestore,
        collection,
        doc,
        addDoc,
        query,
        orderBy,
        limit,
        onSnapshot,
        setDoc,
        updateDoc,
        serverTimestamp
       } from 'firebase/firestore';
       import {
        getStorage,
        ref,
        uploadBytesResumable,
        getDowloadURL
       } from 'firebase/storage';     
      import { getAnalytics } from 'firebase/analytics';
    //import { getDatabase } from 'firebase/database';

    //Firebase configuration
      const firebaseConfig = {      
          apiKey: "AIzaSyCeggyHjxE11j_JdOWPokNzeyZu9KRdJII",      
          authDomain: "digital-dungeon-7ed2d.firebaseapp.com",        
          databaseURL: "https://digital-dungeon-7ed2d-default-rtdb.firebaseio.com",        
          projectId: "digital-dungeon-7ed2d",        
          storageBucket: "digital-dungeon-7ed2d.appspot.com",        
          messagingSenderId: "131380478178",        
          appId: "1:131380478178:web:e0d9605980bb71c5dfdebb",
          measurementId: "G-0HRMKNQZDD"      
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      
      //initialize modules/functions
      const auth = getAuth(app);
      //const db = getDatabase(app);      
      const fs = getFirestore(app);      
      const analytics = getAnalytics(app);

      //Vars for Register
      const registerEmail = document.getElementById("registerEmailID");
      const registerUsername = document.getElementById("registerUsernameID")
      const registerPassword = document.getElementById("registerPasswordID");
      const registerPasswordRepeat = document.getElementById("registerPasswordRepeatID");
      //const teacherButton = document.getElementById("teacherButton");
      const studentButton = document.getElementById("studentButton");

      //Vars for Login
      const loginEmail = document.getElementById("loginEmailID");
      const loginPassword = document.getElementById("loginPasswordID");
      const loginSubmitButton = document.getElementById("loginSubmitID");
    
      //vars for functions
      var regEmail, logEmail, regPassword, logPassword, regPasswordRepeat, regUsername;

      //Register Teacher
      document.getElementById("teacherButton").addEventListener("click", function(){
        var isVerified = true;
        regEmail = registerEmail.value;
        regPassword = registerPassword.value;
        regPasswordRepeat = registerPasswordRepeat.value;
        regUsername = registerUsername.value;

        if(regEmail == ""){
            window.alert("Email Required");
            isVerified = false;
        }
        if(regUsername == ""){
            window.alert("Username Required");
            isVerified = false;
        }
        if(regPassword == "" || regPasswordRepeat == ""){
            window.alert("Password Required");
            isVerified = false;
        }
        if(regPassword != regPasswordRepeat){
            window.alert("Passwords do not match");
            isVerified = false;
        }

        if(isVerified){
            createUserWithEmailAndPassword(auth, regEmail, regPassword).then((userCredential) => {
                //signed in
                const user = userCredential.user;
                createTeacherInFirestore();
                window.alert("Success! Account created.");
                window.location.replace("profile_teacher.html");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        }
      });

      //Register Student
      studentButton.addEventListener("click", function(){
        var isVerified = true;
        regEmail = registerEmail.value;
        regPassword = registerPassword.value;
        regPasswordRepeat = registerPassword.value;

        if(regEmail == ""){
            window.alert("Email Required");
            isVerified = false;
        }
        if(regPassword == "" || regPasswordRepeat == ""){
            window.alert("Password Required");
            isVerified = false;
        }
        if(regPassword != regPasswordRepeat){
            window.alert("Passwords do not match");
            isVerified = false;
        }

        if(isVerified){
            createUserWithEmailAndPassword(auth, regEmail, regPassword).then((userCredential) => {
                //signed in
                const user = userCredential.user;
                //auth.setCustomUserClaims(uid, claims).then(()=>claims);
                window.alert("Success! Account created.");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        }
      });

      //Login User
      loginSubmitButton.addEventListener("click", function(){
        var isVerified = true;
        logEmail = loginEmail.value;
        logPassword = loginPassword.value;

        if(logEmail == ""){
            window.alert("Email Required");
            isVerified = false;
        }
        if(logPassword == ""){
            window.alert("Password Required");
            isVerified = false;
        }
        if(isVerified){
            signInWithEmailAndPassword(auth, email, password).then((userCredential) =>{
                //signed in
                const user = userCredential.user;
                window.alert("Login Sucessful!")
            })
            .catch((error) =>{
                const errorCode = error.code;
                const errorMessage = error.message;
                window.alert("Error occurred. Please try again.")
            });
        }
      });

      //Logout User
      logoutButton.addEventListener("click", signoutUser());
      

      //Functions
      function createTeacherInFirestore(){
        regEmail = registerEmail.value;
        regUsername = registerUsername.value;
        setDoc(doc(fs, "users", userCredential.user.uid), {
            AccountType: "Teacher",
            Email: regEmail,
            Username: regUsername,
            HighScore: 0
        });
      }

      function signoutUser(){
        signOut(getAuth());
      }

      function initFirebaseAuth() {
        onAuthStateChanged(getAuth(), authStateObserver);
      }
      
      function authStateObserver(user) {
        if(user){//User is signed in
            alert("User is signed in");
        }
        else{
            alert("User is not signed in");
        }
      }
    //WIP Functions 
     // function getUserName(){
       // return getAuth().currentUser.displayName;
      //}



