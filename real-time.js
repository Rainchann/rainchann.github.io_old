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
const chatContainer = document.querySelector(".chatContainer")

//username storage
var username = localStorage.getItem("rains_uname");
var recname, recmsg, recid, name_color;

var uniqueId = generateUniqueId();



//insert data function
function InsertData(e) {
  e.preventDefault();

  set(ref(db, "Chat"), {
    name: username,
    msg: ipt1.value,
    id: uniqueId
  })
  .then(() => {
  })
  .catch((err) => {
    alert("Error occured: " + err)
  });

}

//listen for incoming message
const dbref = ref(db, 'Chat')

onValue(dbref, (snapshot) => {
  if(snapshot.exists()) {
    recname = snapshot.val().name;
    recmsg = snapshot.val().msg;
    recid = snapshot.val().id;
    outputMsg();
  }})

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function formatMsg(uniqueId, username, msg) {
  //custom
  if (username == 'Shirley') {
    name_color = '#C5FFDC';
  } else {
    name_color = 'pink';
  }
  return (
    `
        <div class="chat">
          <div class="${username} name" style="color: ${name_color}">${username}
            </div>
            <div class="message" id=${uniqueId}>${msg}</div>
        </div>
    `
   )
   
}

const outputMsg = async() => {

  uniqueId = generateUniqueId()

  chatContainer.scrollTop = chatContainer.scrollHeight;
  chatContainer.innerHTML += formatMsg(uniqueId, recname, recmsg)
  

  ipt1.value = '';
}

function enterUsername() {
  username = ipt1.value;
  ipt1.value = '';

  localStorage.setItem("rains_uname", username);
}

btn2.addEventListener('click', enterUsername);

btn1.addEventListener('click', InsertData);
btn1.addEventListener('keyup', (e) => {
  if(e.keycode === 13) {
    InsertData(e);
  }
})
