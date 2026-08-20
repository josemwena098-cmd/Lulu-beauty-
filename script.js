const firebaseConfig = {
  apiKey: "AIzaSyDbYznd_wEyJPr_r1mnvUEy651QPhhk4TI",
  authDomain: "teknova-3688d.firebaseapp.com",
  databaseURL: "https://teknova-3688d-default-rtdb.firebaseio.com",
  projectId: "teknova-3688d",
  storageBucket: "teknova-3688d.firebasestorage.app",
  messagingSenderId: "1030215294939",
  appId: "1:1030215294939:web:4d82493402600f4285d1fe"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const nambaYaDuka = "255724331379";

let bidhaaZote = [];
let bidhaaYaKuchagua = null;

function openPopup(bidhaa){
  bidhaaYaKuchagua = bidhaa;
  document.getElementById('loginPopup').style.display = 'flex';
}
function closePopup(){
  document.getElementById('loginPopup').style.display = 'none';
  bidhaaYaKuchagua = null;
}

// LOGIN MPYA KWA FORM
function loginWithEmailNew(){
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if(email && password){
    auth.signInWithEmailAndPassword(email, password).then(() => {
      closePopup();
      if(bidhaaYaKuchagua) sendToWhatsApp(bidhaaYaKuchagua);
      else document.getElementById('bidhaa').scrollIntoView({behavior: 'smooth'});
    }).catch(error => {
      if(confirm("Huna account. Unataka kujisajili?")){
        auth.createUserWithEmailAndPassword(email, password).then(() => {
          closePopup();
          if(bidhaaYaKuchagua) sendToWhatsApp(bidhaaYaKuchagua);
          else document.getElementById('bidhaa').scrollIntoView({behavior: 'smooth'});
        }).catch(err => alert("Kosa: " + err.message));
      }
    });
  } else {
    alert("Tafadhali jaza Email na Password");
  }
}

function loginWithGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(() => {
    closePopup();
    if(bidhaaYaKuchagua) sendToWhatsApp(bidhaaYaKuchagua);
    else document.getElementById('bidhaa').scrollIntoView({behavior: 'smooth'});
  }).catch(error => alert("Kosa: " + error.message));
}

function sendToWhatsApp(b){
  let url = `https://wa.me/${nambaYaDuka}?text=Habari%20LULU%20BEAUTY,%20Nataka%20kuoda:%0A%0A*${b.jina}*%0ABei:%20Tsh%20${Number(b.bei).toLocaleString()}%0A%0ANitumie%20details%20za%20malipo%20tafadhali.`;
  window.open(url, '_blank');
}

function checkLoginBanner(){
  if(auth.currentUser){
    document.getElementById('bidhaa').scrollIntoView({behavior: 'smooth'});
  } else {
    openPopup(null);
  }
}

function displayBidhaa(data){
  const grid = document.getElementById('bidhaaGrid');
  grid.innerHTML = "";
  if(data && Object.keys(data).length > 0){
    Object.keys(data).reverse().forEach(key => {
      let b = data[key];
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

function checkLogin(bidhaa){
  if(auth.currentUser){
    sendToWhatsApp(bidhaa);
  } else {
    openPopup(bidhaa);
  }
}

function loadBidhaa(){
  db.ref('bidhaa').on('value', snap => {
    bidhaaZote = snap.val();
    displayBidhaa(bidhaaZote);
  })
}

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

loadBidhaa();