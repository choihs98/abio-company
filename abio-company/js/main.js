/* ========== 카테고리별 상품 데이터 ========== */
const productsByCategory = {
  '신선식품': [
    {name:'유기농 친환경 토마토 1kg',price:12800,orig:16000,off:20},
    {name:'제주 감귤 3kg 선물세트',price:28900,orig:35000,off:17,badge:'인기'},
    {name:'국내산 한우 등심 300g',price:32000,orig:42000,off:24},
    {name:'무농약 시금치 500g',price:4500},
  ],
  '가공식품': [
    {name:'수제 된장 500g',price:9800,orig:12900,off:24,badge:'베스트'},
    {name:'전통 고추장 1kg',price:15500,orig:19000,off:18},
    {name:'국산콩 간장 900ml',price:8900},
    {name:'매실청 수제 엑기스 1L',price:22000,orig:28000,off:21},
  ],
  '밀키트': [
    {name:'부대찌개 밀키트 2인분',price:11900,orig:15000,off:21,badge:'신상'},
    {name:'감바스 알 아히요 키트',price:13500,orig:17000,off:21},
    {name:'된장찌개 간편 키트 3인분',price:9800},
    {name:'떡볶이 밀키트 매운맛',price:7900,orig:10000,off:21},
  ],
  '기타': [
    {name:'친환경 대나무 수저 세트',price:6500,badge:'신상'},
    {name:'에코 장바구니 접이식',price:4900},
    {name:'보냉백 대형 15L',price:18000,orig:24000,off:25},
    {name:'주방 다용도 클리너 500ml',price:5500},
  ],
};
function getAllProducts(){
  const all = [];
  Object.values(productsByCategory).forEach(function(arr){ arr.forEach(function(p){ all.push(p); }); });
  return all;
}
function getProducts(cat){
  if(cat==='전체') return getAllProducts();
  return productsByCategory[cat] || [];
}

function formatPrice(n){ return n.toLocaleString('ko-KR')+'원'; }
const cartSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L4.5 3H2"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/></svg>';

function cardHTML(p){
  const badge=p.badge?'<span class="badge-tag">'+p.badge+'</span>':'';
  const orig=p.orig?'<span class="orig">'+formatPrice(p.orig)+'</span>':'';
  const off=p.off?'<span class="off">'+p.off+'%</span>':'';
  return '<div class="list-card" data-name="'+p.name+'" tabindex="0" role="button">'
    +'<div class="list-thumb">상품 이미지'+badge+'<button class="cart-fab" aria-label="장바구니 담기">'+cartSVG+'</button></div>'
    +'<p class="list-name">'+p.name+'</p>'
    +'<p class="list-price">'+orig+'<span class="now">'+off+formatPrice(p.price)+'</span></p></div>';
}

/* ========== 렌더링 ========== */
const productListEl=document.getElementById('productList');
const subBarLabel=document.getElementById('subBarLabel');
let currentCat='전체';

function renderProducts(cat){
  currentCat=cat;
  const items=getProducts(cat);
  productListEl.innerHTML=items.map(cardHTML).join('');
  if(subBarLabel) subBarLabel.textContent=cat;
  bindCards(productListEl);

  // 탭 동기화
  document.querySelectorAll('.cat-tabs button').forEach(function(b){ b.classList.toggle('active',b.getAttribute('data-cat')===cat); });
  document.querySelectorAll('.fullmenu-link').forEach(function(b){ b.classList.toggle('active',b.getAttribute('data-cat')===cat); });
}
renderProducts('전체');

/* ========== 장바구니 ========== */
let cart=[];
const cartCountEl=document.getElementById('cartCount');
function updateCartBadge(){
  if(cartCountEl){cartCountEl.textContent=cart.length;cartCountEl.style.display=cart.length>0?'':'none';}
}
function toggleCart(name,btn){
  const idx=cart.indexOf(name);
  if(idx>-1){cart.splice(idx,1);btn.classList.remove('added');}
  else{cart.push(name);btn.classList.add('added');}
  updateCartBadge();
}
function bindCards(container){
  container.querySelectorAll('.list-card').forEach(function(card){
    const fab=card.querySelector('.cart-fab');
    if(fab) fab.addEventListener('click',function(e){e.stopPropagation();toggleCart(card.getAttribute('data-name'),fab);});
  });
}

/* ========== 카테고리 탭 (앱 내 상단) ========== */
document.querySelectorAll('.cat-tabs button').forEach(function(btn){
  btn.addEventListener('click',function(){ renderProducts(btn.getAttribute('data-cat')); });
});
document.getElementById('subBack').addEventListener('click',function(){ renderProducts('전체'); });

/* ========== 전체화면 메뉴 (웹 좌측) ========== */
const fullmenu=document.getElementById('fullmenu');
const fullmenuBackdrop=document.getElementById('fullmenuBackdrop');
document.getElementById('menuBtn').addEventListener('click',function(){fullmenu.classList.add('open');fullmenuBackdrop.classList.add('open');});
document.getElementById('fullmenuClose').addEventListener('click',closeFullmenu);
fullmenuBackdrop.addEventListener('click',closeFullmenu);
function closeFullmenu(){fullmenu.classList.remove('open');fullmenuBackdrop.classList.remove('open');}
document.querySelectorAll('.fullmenu-link').forEach(function(btn){
  btn.addEventListener('click',function(){
    renderProducts(btn.getAttribute('data-cat'));
    closeFullmenu();
    showView('main');
  });
});

/* ========== 검색 ========== */
function runSearch(q){
  q=(q||'').trim();
  document.getElementById('brandSearchInput').value=q;
  document.getElementById('appSearchInput').value=q;
  if(!q){renderProducts(currentCat);return;}
  const all=getAllProducts().filter(function(p){return p.name.toLowerCase().includes(q.toLowerCase());});
  productListEl.innerHTML=all.length?all.map(cardHTML).join(''):'<p class="empty-msg">\''+q+'\' 검색결과가 없습니다.</p>';
  if(subBarLabel) subBarLabel.textContent="'"+q+"' 검색결과";
  bindCards(productListEl);
  showView('main');
}
document.getElementById('brandSearchForm').addEventListener('submit',function(e){e.preventDefault();runSearch(document.getElementById('brandSearchInput').value);});
document.getElementById('appSearchForm').addEventListener('submit',function(e){e.preventDefault();runSearch(document.getElementById('appSearchInput').value);});

/* ========== 필터 드롭다운 ========== */
const filterBtn=document.getElementById('filterSelectBtn'),filterMenu=document.getElementById('filterMenu');
filterBtn.addEventListener('click',function(e){e.stopPropagation();filterMenu.classList.toggle('open');});
filterMenu.querySelectorAll('li').forEach(function(li){
  li.addEventListener('click',function(){
    filterMenu.querySelectorAll('li').forEach(function(l){l.classList.remove('active');});
    li.classList.add('active');
    document.getElementById('filterSelectLabel').textContent=li.getAttribute('data-value');
    filterMenu.classList.remove('open');
  });
});
document.addEventListener('click',function(){filterMenu.classList.remove('open');});

/* ========== 리스트/그리드 토글 ========== */
const vList=document.getElementById('viewListBtn'),vGrid=document.getElementById('viewGridBtn');
vList.addEventListener('click',function(){productListEl.classList.remove('grid-view');vList.classList.add('active');vGrid.classList.remove('active');});
vGrid.addEventListener('click',function(){productListEl.classList.add('grid-view');vGrid.classList.add('active');vList.classList.remove('active');});

/* ========== 하단 탭바 → 앱 내 뷰 전환 (장바구니/마이페이지) ========== */
const views={main:document.getElementById('mainAppView'),cart:document.getElementById('cartView'),mypage:document.getElementById('mypageView')};
function showView(name){
  Object.keys(views).forEach(function(k){views[k].style.display=k===name?'':'none';});
  document.querySelectorAll('.bottom-nav button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-view')===name);});
  if(name==='cart') renderCart();
  document.querySelector('.screen').scrollTop=0;
}
document.querySelectorAll('.bottom-nav button').forEach(function(btn){
  btn.addEventListener('click',function(){
    var v=btn.getAttribute('data-view');
    if(v==='category'){fullmenu.classList.add('open');fullmenuBackdrop.classList.add('open');return;}
    showView(v);
  });
});
document.querySelectorAll('[data-back]').forEach(function(btn){
  btn.addEventListener('click',function(){showView('main');});
});
function renderCart(){
  const el=document.getElementById('cartItems'),empty=document.getElementById('cartEmpty');
  if(!cart.length){el.innerHTML='';empty.style.display='';return;}
  empty.style.display='none';
  const all=getAllProducts();
  el.innerHTML=cart.map(function(name){
    const p=all.find(function(x){return x.name===name;});
    if(!p) return '';
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--line)"><div><p style="font-size:14px;font-weight:700">'+p.name+'</p><p style="font-size:15px;font-weight:800;margin-top:4px">'+(p.off?'<span style="color:var(--coral)">'+p.off+'%</span> ':'')+formatPrice(p.price)+'</p></div><button onclick="removeFromCart(\''+name+'\')" style="font-size:12px;color:var(--coral);font-weight:700;padding:6px 12px;border:1px solid var(--line);border-radius:8px">삭제</button></div>';
  }).join('');
}
window.removeFromCart=function(name){
  cart=cart.filter(function(n){return n!==name;});
  updateCartBadge();renderCart();
};
