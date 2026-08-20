// 1. WEKA CONFIG YAKO YA FIREBASE HAPA
const firebaseConfig = {
  apiKey: "AIzaSyDbYznd_wEyJPr_r1mnvUEy651QPhhk4TI",
  authDomain: "teknova-3688d.firebaseapp.com",
  databaseURL: "https://teknova-3688d-default-rtdb.firebaseio.com",
  projectId: "teknova-3688d",
  storageBucket: "teknova-3688d.firebasestorage.app",
  messagingSenderId: "1030215294939",
  appId: "1:1030215294939:web:4d82493402600f4285d1fe"
};

// 2. ANZISHA FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const nambaYaDuka = "255724331379";

let bidhaaZote = [];
let bidhaaYaKuchagua = null; // Hifadhi bidhaa aliyobonyeza

// 3. FUNCTION ZA POPUP
function openPopup(bidhaa){
  bidhaaYaKuchagua = bidhaa; // Hifadhi bidhaa
  document.getElementById('loginPopup').style.display = 'flex';
}
function closePopup(){
  document.getElementById('loginPopup').style.display = 'none';
  bidhaaYaKuchagua = null;
}

// 4. FUNCTION ZA LOGIN
function loginWithGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(() => {
    closePopup();
    if(bidhaaYaKuchagua) sendToWhatsApp(bidhaaYaKuchagua); // Tuma WhatsApp baada ya login
  }).catch(error => alert("Kosa: " + error.message));
}

function loginWithEmail(){
  const email = prompt("Weka Email yako:");
  const password = prompt("Weka Password yako:");
  if(email && password){
    auth.signInWithEmailAndPassword(email, password).then(() => {
      closePopup();
      if(bidhaaYaKuchagua) sendToWhatsApp(bidhaaYaKuchagua);
    }).catch(error => {
      if(confirm("Huna account. Unataka kujisajili?")){
        auth.createUserWithEmailAndPassword(email, password).then(() => {
          closePopup();
          if(bidhaaYaKuchagua) sendToWhatsApp(bidhaaYaKuchagua);
        }).catch(err => alert("Kosa: " + err.message));
      }
    });
  }
}

// 5. FUNCTION YA KUTUMA WHATSAPP
function sendToWhatsApp(b){
  let url = `https://wa.me/${nambaYaDuka}?text=Habari%20LULU%20BEAUTY,%20Nataka%20kuoda:%0A%0A*${b.jina}*%0ABei:%20Tsh%20${Number(b.bei).toLocaleString()}%0A%0ANitumie%20details%20za%20malipo%20tafadhali.`;
  window.open(url, '_blank');
}

// 6. FUNCTION YA KUONYESHA BIDHAA
function displayBidhaa(data){
  const grid = document.getElementById('bidhaaGrid');
  grid.innerHTML = "";
  if(data && Object.keys(data).length > 0){
    Object.keys(data).reverse().forEach(key => {
      let b = data[key];
      // TUMEBADILI: Badala ya link, sasa ni button inayoangalia login
      grid.innerHTML += `
      <div class="card">
        <img src="${b.picha}" onerror="this.src='https://via.placeholder.com/320x350/ff69b4/ffffff?text=LULU+BEAUTY'">
        <div class="card-body">
          <h3>${b.jina}</h3>
          <p class="bei">Tsh ${Number(b.bei).toLocaleString()}</p>
          <button onclick='checkLogin(${JSON.stringify(b)})' class="btn-whatsapp">Oda WhatsApp</button>
        </div>
      </div>`;
    })
  } else {
    grid.innerHTML = "<p style='text-align:center; font-weight:600; color:var(--magenta);'>Hakuna bidhaa iliyopatikana.</p>"
  }
}

// 7. FUNCTION YA KUCHEK LOGIN KABLA YA ODA
function checkLogin(bidhaa){
  if(auth.currentUser){
    sendToWhatsApp(bidhaa); // Kama ameingia, peleka direct WhatsApp
  } else {
    openPopup(bidhaa); // Kama hajaingia, fungua popup
  }
}

// 8. SOMA BIDHAA KUTOKA DATABASE
function loadBidhaa(){
  db.ref('bidhaa').on('value', snap => {
    bidhaaZote = snap.val();
    displayBidhaa(bidhaaZote);
  })
}

// 9. FUNCTION YA SEARCH
document.getElementById('searchInput').addEventListener('keyup', function(){
  let searchTerm = this.value.toLowerCase();
  let filteredBidhaa = {};
  if(bidhaaZote){
    for(let key in bidhaaZote){
      if(bidhaaZote[key].jina.toLowerCase().includes(searchTerm)){
        filteredBidhaa[key] = bidhaaZote[key];
      }
    }
  }
  displayBidhaa(filteredBidhaa);
});

// 10. ANZA KUPAKIA BIDHAA
loadBidhaa();