// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmfrwHCdfGb9CHRCJ47noGKGo3ip0Cs4s",
  authDomain: "rainsweb.firebaseapp.com",
  databaseURL: "https://rainsweb-default-rtdb.firebaseio.com",
  projectId: "rainsweb",
  storageBucket: "rainsweb.appspot.com",
  messagingSenderId: "685695095263",
  appId: "1:685695095263:web:fea78231f06a2260b9f46a",
  measurementId: "G-9PDTF44GQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


import {getDatabase, ref, set, child, update, remove, get, onChildAdded, onValue}
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const db = getDatabase(app);
//references
var ipt1 = document.getElementById("ipt1")
var btn1 = document.getElementById("btn1")
var btn2 = document.getElementById("btn2")
var notificationBtn = document.getElementById("notiBtn")
const chatContainer = document.querySelector(".chatContainer")
const datetime = new Date()

//username storage
var username = localStorage.getItem("rains_uname");
var recname, recmsg, recid, name_color, currentTime;
var main = false; //bool, to determine if the message send by the own user

var uniqueId = generateUniqueId();



//insert data function
function InsertData() {

  set(ref(db, "Chat"), {
    name: username,
    msg: ipt1.value,
    id: uniqueId,
    time: getDate()
  })
  .then(() => {
  })
  .catch((err) => {
    alert("Error occured: " + err)
  });

  main = true;

}

//listen for incoming message
const dbref = ref(db, 'Chat')

onValue(dbref, (snapshot) => {
  if(snapshot.exists()) {
    recname = snapshot.val().name;
    recmsg = snapshot.val().msg;
    recid = snapshot.val().id;
    currentTime = snapshot.val().time;
    outputMsg();
  }})

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function formatMsg(uniqueId, username, msg, time) {
  //custom
  if (username == 'Shirley') {
    name_color = '#C5FFDC';
  } else {
    name_color = 'pink';
  }
  return (
    `
        <div class="chat">
          <div class="time" style="color:#DDE2D8">${time}</div>
          <div class="${username} name" style="color: ${name_color}">${username}:
            </div>
            <div class="message" id=${uniqueId}>${msg}</div>
        </div>
    `
   )
   
}

const outputMsg = async() => {

  uniqueId = generateUniqueId()

  chatContainer.scrollTop = chatContainer.scrollHeight;
  chatContainer.innerHTML += formatMsg(uniqueId, recname, recmsg, currentTime)
  
  ipt1.value = '';
  main ? '' : sendNoti(); 
}

function getDate() {
  let month = datetime.getMonth()+1;
  let day = datetime.getDate();
  let hour = String(datetime.getHours()).padStart(2, '0');
  let min = String(datetime.getMinutes()).padStart(2, '0');
  return day + "/" + month + "\t\t\t\t" + hour+":"+min;
}

function enterUsername() {
  username = ipt1.value;
  ipt1.value = '';

  localStorage.setItem("rains_uname", username);
}

//notification
function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
}

function askNotificationPermission() {
  // // function to actually ask the permissions
  // function handlePermission(permission) {
  //   // set the button to shown or hidden, depending on what the user answers
  //   notificationBtn.style.display =
  //     Notification.permission === 'granted' ? 'none' : 'block';
  // }

  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    console.log("This browser does not support notifications.");
  } else if (checkNotificationPromise()) {
    Notification.requestPermission().then((permission) => {
      console.log("success")
      // handlePermission(permission);
    });
  } else {
    Notification.requestPermission((permission) => {
      // handlePermission(permission);
      console.log("success")
    });
  }
}


function sendNoti() {
  const img = '/img/xuan1.jpg';
  const text = `${recname}: ${recmsg}`;

  navigator.serviceWorker.register('sw.js');

  if (Notification?.permission === "granted") {
      // If the user agreed to get notified
      // Let's try to send ten notifications
      // const notification = new Notification('', {body: text, icon: img });
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('', {body: text, icon: img });
      });
    } else if (Notification && Notification.permission !== "denied") {
      // If the user hasn't told if they want to be notified or not
      // Note: because of Chrome, we are not sure the permission property
      // is set, therefore it's unsafe to check for the "default" value.
      Notification.requestPermission((status) => {
        // If the user said okay
        if (status === "granted") {
          // const notification = new Notification('', { body: text, icon: img });
          navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification('', {body: text, icon: img });
          });
        }})
      }

    }

askNotificationPermission();

btn2.addEventListener('click', enterUsername);

btn1.addEventListener('click', InsertData);
ipt1.addEventListener('keyup', function(e) {
  if(e.keyCode === 13) {
    e.preventDefault();
    btn1.click();

  }
})