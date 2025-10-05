// Side Menu
const menuBtn=document.getElementById('menuBtn');
const sideMenu=document.getElementById('sideMenu');
const screens={
  chat:document.getElementById('chat'),
  shop:document.getElementById('shop'),
  groups:document.getElementById('groups'),
  team:document.getElementById('team')
};

menuBtn.addEventListener('click',()=>{
  sideMenu.classList.toggle('active');
  menuBtn.style.display=sideMenu.classList.contains('active')?'none':'block';
});

document.querySelectorAll('#sideMenu a').forEach(a=>{
  a.addEventListener('click',()=>{
    sideMenu.classList.remove('active');
    menuBtn.style.display='block';
  });
});

// Show Screen
function showScreen(name){
  Object.values(screens).forEach(s=>s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ----------------- Chat -----------------
const chatMessages=document.getElementById('chatMessages');
const chatInput=document.getElementById('chatInput');

function addMessage(sender,text,cls){
  const div=document.createElement('div');
  div.className=cls;
  div.innerText=sender+": "+text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}

async function getAIResponse(prompt){
  const OPENAI_KEY="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";
  try{
    const res=await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${OPENAI_KEY}`
      },
      body:JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[{role:"user",content:prompt}],
        temperature:0.7
      })
    });
    const data=await res.json();
    return data.choices[0].message.content;
  }catch(e){
    console.error(e);
    return "Fehler bei AI";
  }
}

async function sendMessage(){
  const text=chatInput.value.trim();
  if(!text) return;
  addMessage("Du",text,"user");
  chatInput.value='';
  addMessage("AI","…","ai");
  const lastAI=chatMessages.querySelectorAll('.ai');
  const response=await getAIResponse(text);
  lastAI[lastAI.length-1].innerText=response;
}

// ----------------- Shop -----------------
const shopItems=[{name:'Item 1',price:'5€'},{name:'Item 2',price:'10€'},{name:'Item 3',price:'15€'}];
const cartItems=[];
function renderShop(){
  const shopContainer=document.getElementById('shop-items');
  shopContainer.innerHTML='';
  shopItems.forEach(item=>{
    const div=document.createElement('div');
    div.className='shop-item';
    div.innerHTML=`${item.name} - ${item.price}`;
    div.addEventListener('click',()=>{cartItems.push(item); renderCart();});
    shopContainer.appendChild(div);
  });
}
function renderCart(){
  const cart=document.getElementById('cart-items');
  cart.innerHTML='';
  cartItems.forEach(item=>{
    const div=document.createElement('div');
    div.innerText=`${item.name} - ${item.price}`;
    cart.appendChild(div);
  });
}
renderShop();

// ----------------- Gruppen -----------------
const groupsList=['Gruppe 1','Gruppe 2','Gruppe 3'];
function renderGroups(){
  showScreen('groups');
  const gl=document.getElementById('groups-list');
  gl.innerHTML='';
  groupsList.forEach(g=>{
    const div=document.createElement('div');
    div.className='group-item';
    div.innerText=g;
    gl.appendChild(div);
  });
}

// ----------------- Team -----------------
function showTeam(){
  showScreen('team');
  const infoText=document.getElementById('info-text');
  const infoBtns=document.getElementById('info-buttons');
  infoText.innerHTML='Ben ✅';
  infoBtns.innerHTML='';
  const btnInfo=document.createElement('div');
  btnInfo.className='info-btn'; btnInfo.innerText='Mehr über mich';
  btnInfo.addEventListener('click',()=>addMessage("AI","Ich bin Ben, Entwickler dieser App."));
  infoBtns.appendChild(btnInfo);
  const btnApply=document.createElement('div');
  btnApply.className='info-btn'; btnApply.innerText='Bewerben';
  btnApply.addEventListener('click',()=>addMessage("AI","Bitte melde dich auf WhatsApp: +49 15679 682680"));
  infoBtns.appendChild(btnApply);
}

// Start App auf Chat
showScreen('chat');
