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

let allProducts = {};

// KUPAKIA BIDHAA
db.ref('bidhaa').on('value', snap => {
  allProducts = snap.val() || {};
  loadCategories();
  displayProducts('ZOTE');
});

// KUPAKIA CATEGORIES KI AUTOMATIC
function loadCategories(){
  const catDiv = document.getElementById('categoryButtons');
  let categories = ['ZOTE'];
  Object.values(allProducts).forEach(b => {
    if(b.category &&!categories.includes(b.category)){
      categories.push(b.category);
    }
  })
  catDiv.innerHTML = '';
  categories.forEach(cat => {
    catDiv.innerHTML += `<button class="cat-btn" onclick="filterCategory('${cat}')">${cat}</button>`;
  })
}

// KUONYESHA BIDHAA
function displayProducts(category){
  const grid = document.getElementById('bidhaaGrid');
  grid.innerHTML = '';
  Object.keys(allProducts).forEach(key => {
    let b = allProducts[key];
    if(category === 'ZOTE' || b.category === category){
      grid.innerHTML += `
      <div class="product-card">
        <img src="${b.picha}" alt="${b.jina}">
        <div class="product-info">
          <h3>${b.jina}</h3>
          <p class="price">Tsh ${Number(b.bei).toLocaleString()}</p>
          <a href="https://wa.me/255724331379?text=Niaje%20nataka%20${b.jina}" target="_blank" class="btn-hero" style="padding:10px 15px; font-size:14px;">Nunua WhatsApp</a>
        </div>
      </div>`;
    }
  })
}

function filterCategory(cat){
  displayProducts(cat);
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// KUPAKIA DELIVERY METHODS
db.ref('delivery').on('value', snap => {
  const data = snap.val();
  const delDiv = document.getElementById('deliveryList');
  delDiv.innerHTML = '';
  if(data){
    Object.values(data).forEach(d => {
      delDiv.innerHTML += `
      <div class="delivery-card">
        <h3>${d.method}</h3>
        <p>${d.desc}</p>
        <p><b>Gharama: Tsh ${Number(d.fee).toLocaleString()}</b></p>
      </div>`;
    })
  }
})