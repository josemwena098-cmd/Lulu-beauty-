// 1. UNGANISHA FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDbYznd_wEyJPr_r1mnvUEy651QPhhk4TI",
  authDomain: "teknova-3688d.firebaseapp.com",
  databaseURL: "https://teknova-3688d-default-rtdb.firebaseio.com",
  projectId: "teknova-3688d",
  storageBucket: "teknova-3688d.firebasestorage.app",
  messagingSenderId: "1030215294939",
  appId: "1:1030215294939:web:4d82493402600f4285d1fe",
  measurementId: "G-XTL8QCFMWW"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const nambaYaDuka = "+255 724 331 379"; // WEKA NAMBA YA LULU HAPA

// 2. SOMA BIDHAA KUTOKA FIREBASE
function somaBidhaa(){
  db.ref('bidhaa').on('value', (snapshot)=>{
    const data = snapshot.val();
    const grid = document.getElementById('bidhaaGrid');
    grid.innerHTML = "";
    if(data){
      Object.keys(data).forEach(key=>{
        let b = data[key];
        grid.innerHTML += `
        <div class="card">
          <img src="${b.picha}" alt="${b.jina}">
          <div class="card-body">
            <h3>${b.jina}</h3>
            <p class="bei">Tsh ${Number(b.bei).toLocaleString()}</p>
            <a href="https://wa.me/${nambaYaDuka}?text=Habari LULU BEAUTY, nataka kuoda ${b.jina}" target="_blank">
              <button class="btn-whatsapp">Oda WhatsApp</button>
            </a>
          </div>
        </div>`;
      })
    }else{
      grid.innerHTML = "<p>Bado hakuna bidhaa. Admin anaongeza.</p>"
    }
  })
}

// 3. MFUMO WA CHAT
const chatBtn = document.getElementById('chatBtn');
const chatBox = document.getElementById('chatBox');
chatBtn.onclick = () => chatBox.classList.toggle('hidden');

function tumaUjumbe(){
  let msg = document.getElementById('chatInput').value;
  if(msg == "") return;
  db.ref('chat').push({
    ujumbe: msg,
    mtumaji: "Mteja",
    time: Date.now()
  });
  document.getElementById('chatInput').value = "";
}

// Soma ujumbe
db.ref('chat').on('child_added', (snapshot)=>{
  let data = snapshot.val();
  let div = document.createElement('div');
  div.classList.add('msg', data.mtumaji == "Mteja"? 'msg-me' : 'msg-admin');
  div.innerText = data.ujumbe;
  document.getElementById('chatMessages').appendChild(div);
})

somaBidhaa();