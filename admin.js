const firebaseConfig = { apiKey: "AIzaSyDbYznd_wEyJPr_r1mnvUEy651QPhhk4TI", databaseURL: "https://teknova-3688d-default-rtdb.firebaseio.com" };
firebase.initializeApp(firebaseConfig); 
const db = firebase.database();
const auth = firebase.auth();

// CHECK KAMA AMEINGIA TAYARI
auth.onAuthStateChanged(user => {
  if(user){
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAllData(); // pakua data zote
  } else {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
  }
});

// LOGIN FUNCTION
function adminLogin(){
  const email = document.getElementById('adminEmail').value;
  const pass = document.getElementById('adminPass').value;
  auth.signInWithEmailAndPassword(email, pass)
  .catch(err => document.getElementById('loginError').innerText = "❌ " + err.message);
}

// LOGOUT
function adminLogout(){ auth.signOut(); }

// ZINGINE ZOTE NI ILE ILE
function toggleMenu(){ document.getElementById('sidebar').classList.toggle('active'); }
function showPage(page, el){ document.querySelectorAll('.page').forEach(p => p.style.display = 'none'); document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active')); document.getElementById(page).style.display = 'block'; el.classList.add('active'); document.getElementById('pageTitle').innerText = el.innerText; if(window.innerWidth < 900) toggleMenu(); }
function openModal(id){ document.getElementById(id).style.display = 'flex'; }
function closeModal(id){ document.getElementById(id).style.display = 'none'; }

function loadAllData(){
  // BIDHAA
  db.ref('bidhaa').on('value', snap => { let html = ""; let count=0; snap.forEach(c => { count++; let b = c.val(); html += `<tr><td><img src="${b.picha}" width="50" style="border-radius:8px"></td><td>${b.jina}</td><td>Tsh ${Number(b.bei).toLocaleString()}</td><td><button class="btn-danger" onclick="db.ref('bidhaa/${c.key}').remove()">Futa</button></td></tr>` }); bidhaaTable.innerHTML = html; totalProducts.innerText = count; });
  // CATEGORY
  db.ref('categories').on('value', snap => { let html = ""; let count=0; snap.forEach(c => { count++; let x = c.val(); html += `<tr><td><img src="${x.image}" width="50" style="border-radius:8px"></td><td>${x.name}</td><td><button class="btn-danger" onclick="db.ref('categories/${c.key}').remove()">Futa</button></td></tr>` }); catTable.innerHTML = html; totalCategories.innerText = count; });
  // DELIVERY
  db.ref('delivery').on('value', snap => { let html = ""; snap.forEach(c => { let d = c.val(); html += `<tr><td>${d.name}</td><td>Tsh ${Number(d.fee).toLocaleString()}</td><td><button class="btn-danger" onclick="db.ref('delivery/${c.key}').remove()">Futa</button></td></tr>` }); delTable.innerHTML = html });
  // PAYMENT LOAD
  db.ref('settings/payment').on('value', snap => { if(snap.exists()){ let d = snap.val(); bankName.value = d.bank?.name || ''; bankAccName.value = d.bank?.accName || ''; bankAcc.value = d.bank?.acc || ''; bankBranch.value = d.bank?.branch || ''; apiKey.value = d.online?.apiKey || ''; mpesa.checked = d.online?.mpesa || false; card.checked = d.online?.card || false; qr.checked = d.online?.qr || false; }});
}

function addBidhaa(){ db.ref('bidhaa').push({jina:bidhaaJina.value, bei:bidhaaBei.value, picha:bidhaaPicha.value}); alert("✅ Imeongezwa"); closeModal('bidhaaModal'); bidhaaJina.value=''; bidhaaBei.value=''; bidhaaPicha.value=''; }
function saveCategory(){ db.ref('categories').push({name:catName.value, image:catImage.value}); alert("✅ Imehifadhiwa"); closeModal('catModal'); catName.value=''; catImage.value=''; }
function saveDelivery(){ db.ref('delivery').push({name:delName.value, fee:delFee.value}); alert("✅ Imehifadhiwa"); closeModal('delModal'); delName.value=''; delFee.value=''; }
function savePayments(){ const data = { bank: { name: bankName.value, accName: bankAccName.value, acc: bankAcc.value, branch: bankBranch.value }, online: { apiKey: apiKey.value, mpesa: mpesa.checked, card: card.checked, qr: qr.checked } }; db.ref('settings/payment').set(data).then(()=> alert("✅ Payment Settings Zimehifadhiwa")); }