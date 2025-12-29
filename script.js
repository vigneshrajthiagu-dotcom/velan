let products = [];

let cart = [];

let ads = [];

let currentAdIndex = 0;

let startX = 0, endX = 0;

// LOAD DATA

window.onload = function(){

    if(localStorage.getItem("storeProducts")){ products = JSON.parse(localStorage.getItem("storeProducts")); displayProducts(); }

    if(localStorage.getItem("cartProducts")){ cart = JSON.parse(localStorage.getItem("cartProducts")); }

    if(localStorage.getItem("ads")){ ads = JSON.parse(localStorage.getItem("ads")); displayAds(); }

};

function saveProducts(){ localStorage.setItem("storeProducts", JSON.stringify(products)); }

function saveCart(){ localStorage.setItem("cartProducts", JSON.stringify(cart)); }

function saveAds(){ localStorage.setItem("ads", JSON.stringify(ads)); }

function scrollToCategory(id){ document.getElementById(id).scrollIntoView({behavior:"smooth"}); }

function openLogin(){ document.getElementById("loginPage").style.display="flex"; }

function closeLogin(){ document.getElementById("loginPage").style.display="none"; }

function login(){

    let u=document.getElementById("loginUser").value;

    let p=document.getElementById("loginPass").value;

    if(u==="viky" && p==="12345"){

        document.getElementById("loginPage").style.display="none";

        document.getElementById("adminPage").style.display="flex";

        document.getElementById("profileBtn").style.display="none";

        document.getElementById("logoutBtn").style.display="inline-block";

        document.getElementById("loginError").innerText="";

    } else { document.getElementById("loginError").innerText="Incorrect!"; }

}

function logout(){

    document.getElementById("profileBtn").style.display="inline-block";

    document.getElementById("logoutBtn").style.display="none";

    document.getElementById("adminPage").style.display="none";

}

// ADMIN / PRODUCT

function closeAdmin(){ document.getElementById("adminPage").style.display="none"; }

function addProduct(){

    let name=document.getElementById("pName").value;

    let price=document.getElementById("pPrice").value;

    let discount=document.getElementById("pDiscount").value;

    let category=document.getElementById("pCategory").value;

    let imageFile=document.getElementById("pImage").files[0];

    if(!name||!price||!discount||!imageFile){ alert("Fill all fields!"); return; }

    let reader = new FileReader();

    reader.onload=function(e){

        let finalPrice = price - (price*discount/100);

        let product={ id:Date.now(), name, price, discount, finalPrice, category, image:e.target.result };

        products.push(product);

        saveProducts();

        displayProducts();

    }

    reader.readAsDataURL(imageFile);

}

function displayProducts(){

    ["utilityList","furnitureList","electronicsList"].forEach(id=>document.getElementById(id).innerHTML="");

    document.getElementById("addedList").innerHTML="";

    products.forEach(p=>{

        let card=`<div class="product-card" id="product-${p.id}">

            <img src="${p.image}">

            <h3>${p.name}</h3>

            <p>Price: ₹${p.price}</p>

            <p class="discount">Discount: ${p.discount}%</p>

            <p class="final-price">After Discount: ₹${p.finalPrice}</p>

            <button class="cartBtn" onclick="addToCart(${p.id})">Add to Cart</button>

        </div>`;

        document.getElementById(p.category+"List").innerHTML+=card;

        document.getElementById("addedList").innerHTML+=`<div>${p.name} <button onclick="deleteProduct(${p.id})">Delete</button></div>`;

    });

}

function deleteProduct(id){ products=products.filter(p=>p.id!==id); saveProducts(); displayProducts(); }

function searchProduct(){

    let text=document.getElementById("searchInput").value.toLowerCase();

    let item=products.find(p=>p.name.toLowerCase().includes(text));

    if(item) document.getElementById("product-"+item.id).scrollIntoView({behavior:"smooth"});

    else alert("Not Found!");

}

// CART

function addToCart(id){

    let item=products.find(p=>p.id===id);

    let cartItem=cart.find(c=>c.id===id);

    if(cartItem) cartItem.qty++; else cart.push({...item, qty:1});

    saveCart();

}

function openCartPage(){ document.getElementById("cartPage").style.display="block"; renderCart(); }

function closeCartPage(){ document.getElementById("cartPage").style.display="none"; }

function renderCart(){

    let list=document.getElementById("cartList"); list.innerHTML=""; let total=0;

    cart.forEach(c=>{

        total+=c.finalPrice*c.qty;

        list.innerHTML+=`<div class="cart-card">

            <img src="${c.image}">

            <h3>${c.name}</h3>

            <p>Price: ₹${c.price}</p>

            <p class="discount">Discount: ${c.discount}%</p>

            <p class="final-price">After Discount: ₹${c.finalPrice}</p>

            <p>Qty: ${c.qty}</p>

            <button onclick="removeFromCart(${c.id})">Remove</button>

        </div>`;

    });

    document.getElementById("cartTotal").innerText=total;

}

function removeFromCart(id){ cart=cart.filter(c=>c.id!==id); saveCart(); renderCart(); }

// AD FUNCTIONALITY

function openAdPopup(){ document.getElementById("adPopup").style.display="flex"; }

function closeAdPopup(){ document.getElementById("adPopup").style.display="none"; }

function addAd(){

    let file=document.getElementById("adFile").files[0];

    if(!file){ alert("Select file"); return; }

    let reader=new FileReader();

    reader.onload=function(e){

        let type = file.type.includes("video") ? "video" : "image";

        let ad={ id:Date.now(), src:e.target.result, type };

        ads.push(ad);

        saveAds();

        displayAds();

    }

    reader.readAsDataURL(file);

}

function displayAds(){

    let slider=document.getElementById("adSlider"); slider.innerHTML="";

    ads.forEach(a=>{

        let content=a.type==="image"? `<img src="${a.src}">` : `<video src="${a.src}" controls></video>`;

        slider.innerHTML+=`<div class="ad-card">${content}</div>`;

    });

    let adList=document.getElementById("adList");

    let adPopupList=document.getElementById("adPopupList");

    if(adList) adList.innerHTML="";

    if(adPopupList) adPopupList.innerHTML="";

    ads.forEach(a=>{

        let delButton = `<button onclick="deleteAd(${a.id})">Delete</button>`;

        if(adList) adList.innerHTML+=`<div>${a.type.toUpperCase()} ${delButton}</div>`;

        if(adPopupList) adPopupList.innerHTML+=`<div>${a.type.toUpperCase()} ${delButton}</div>`;

    });

    currentAdIndex=0; updateAdSlider();

}

function deleteAd(id){ ads=ads.filter(a=>a.id!==id); saveAds(); displayAds(); }

function updateAdSlider(){

    let slider=document.getElementById("adSlider");

    if(ads.length===0) return;

    if(currentAdIndex>=ads.length) currentAdIndex=0;

    if(currentAdIndex<0) currentAdIndex=ads.length-1;

    let offset = -currentAdIndex * slider.offsetWidth;

    slider.style.transform = `translateX(${offset}px)`;

}

function prevAd(){ currentAdIndex--; updateAdSlider(); }

function nextAd(){ currentAdIndex++; updateAdSlider(); }

window.addEventListener('resize', updateAdSlider);

// TOUCH SWIPE SUPPORT

const adContainer = document.getElementById("adSliderContainer");

adContainer.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; });

adContainer.addEventListener('touchend', function(e){

    endX = e.changedTouches[0].clientX;

    if(startX - endX > 50){ nextAd(); }

    else if(endX - startX > 50){ prevAd(); }

});