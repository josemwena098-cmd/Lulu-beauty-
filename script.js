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

// FUNCTION MPYA: ONYESHA PAGE YA NDANI
function viewProduct(key){
  const b = bidhaaZote[key];
  document.querySelector('main').style.display = 'none';
  document.querySelector('header').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
  document.getElementById('productDetailPage').style.display = 'block';

  let saleHTML = '';
  if(b.sale > 0){
    saleHTML = `<span class="save">Save ${b.sale}%</span>`;
  }

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-grid">
      <div class="detail-img"><img src="${b.picha}" onerror="this.src='https://via.placeholder.com/400/ff69b4/ffffff?text=LULU+BEAUTY'"></div>
      <div class="detail-info">
        <p class="detail-category">${b.category || 'NYINGINE'}</p>
        <h1>${b.jina}</h1>
        <div class="detail-price">Tsh ${Number(b.bei).toLocaleString()}
          ${b.beiZamani > 0? `<span class="old-price-detail">Tsh ${Number(b.beiZamani).toLocaleString()}</span> ${saleHTML}` : ''}
        </div>
        <p class="detail-desc">${b.maelezo || 'Bidhaa bora kutoka LULU BEAUTY. Wasiliana nasi kwa maelezo zaidi.'}</p>
        <div class="detail-meta">
          <p><b>Availability:</b> ✓ In Stock</p>
          <p><b>SKU:</b> ${b.sku || 'N/A'}</p>
        </div>
        <button onclick='checkLogin(${JSON.stringify(b)})' class="btn-whatsapp-detail">📱 Oda WhatsApp</button>
      </div>
    </div>
  `;
}

function backToHome(){
  document.querySelector('main').style.display = 'block';
  document.querySelector('header').style.display = 'block';
  document.querySelector('footer').style.display = 'block';
  document.getElementById('productDetailPage').style.display = 'none';
}

function displayBidhaa(data){
  const grid = document.getElementById('bidhaaGrid');
  grid.innerHTML = "";
  if(data && Object.keys(data).length > 0){
    Object.keys(data).reverse().forEach(key => {
      let b = data[key];
      // HESABU SALE %
      let sale = 0;
      if(b.beiZamani && b.beiZamani > b.bei){
        sale = Math.round(((b.beiZamani - b.bei) / b.beiZamani) * 100);
        b.sale = sale; // Tuiweke kwenye object
      }

      grid.innerHTML += `
      <div class="card">
        ${b.sale > 0? `<div class="sale-badge">-${b.sale}%</div>` : ''}
        <img src="${b.picha}" onerror="this.src='https://via.placeholder.com/320x350/ff69b4/ffffff?text=LULU+BEAUTY'">
        <div class="card-body">
          <p style="font-size:11px; color:var(--pink); font-weight:700;">${b.category || 'NYINGINE'}</p>
          <h3>${b.jina}</h3>
          <div class="price-wrap">
            <p class="bei">Tsh ${Number(b.bei).toLocaleString()}</p>
            ${b.beiZamani > 0? `<p class="bei-zamani">Tsh ${Number(b.beiZamani).toLocaleString()}</p>` : ''}
          </div>
          <button onclick='viewProduct("${key}")' class="btn-view">View Product</button>
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