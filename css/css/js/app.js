// ===== MATTTWORLD — logica condivisa =====
(function(){
  const $  = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];

  // Loader boot
  window.addEventListener('load',()=>{
    const l=$('#loader');
    if(l){setTimeout(()=>l.classList.add('gone'),900);setTimeout(()=>l.remove(),1500);}
  });

  // Burger
  const burger=$('#burger'); if(burger) burger.onclick=()=>$('.nav-links').classList.toggle('open');

  // FAQ
  $$('.faq-q').forEach(q=>q.onclick=()=>q.parentElement.classList.toggle('open'));

  // Carrello (localStorage)
  const KEY='mw_cart';
  const getCart=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}};
  const setCart=c=>{localStorage.setItem(KEY,JSON.stringify(c));renderCart();};

  window.addToCart=(name,price)=>{
    const c=getCart(); const f=c.find(i=>i.name===name);
    if(f) f.qty++; else c.push({name,price:+price,qty:1});
    setCart(c); openCart();
  };
  window.buyNow=(name,price)=>{ setCart([{name,price:+price,qty:1}]); location.href='checkout.html'; };

  function renderCart(){
    const c=getCart(); const badge=$('#cartCount'); const list=$('#cartList'); const sub=$('#cartSubtotal');
    const n=c.reduce((s,i)=>s+i.qty,0);
    if(badge){badge.textContent=n;badge.style.display=n?'block':'none';}
    if(list){
      list.innerHTML=c.length?c.map((i,idx)=>`
        <div class="cart-item">
          <div><div>${i.name}</div><div class="label">€${i.price} × ${i.qty}</div></div>
          <div class="wrap items-center gap-2">
            <button class="ds-btn ds-btn-outline" style="min-height:28px;padding:0 .5rem" onclick="chQty(${idx},-1)">−</button>
            <span>${i.qty}</span>
            <button class="ds-btn ds-btn-outline" style="min-height:28px;padding:0 .5rem" onclick="chQty(${idx},1)">+</button>
          </div>
        </div>`).join(''):'<p class="label">Il tuo carrello è vuoto</p>';
      const total=c.reduce((s,i)=>s+i.price*i.qty,0);
      if(sub) sub.textContent='€'+total;
    }
  }
  window.chQty=(i,d)=>{const c=getCart();c[i].qty+=d;if(c[i].qty<=0)c.splice(i,1);setCart(c);};

  window.openCart=()=>{$('#overlay')?.classList.add('open');$('#drawer')?.classList.add('open');};
  window.closeCart=()=>{$('#overlay')?.classList.remove('open');$('#drawer')?.classList.remove('open');};
  $('#overlay')&&($('#overlay').onclick=closeCart);

  // Live feed
  const feed=$('#feed');
  if(feed){
    const evs=[
      ['Ordine #VAL-34556 spedito','PACK BUSINESS 50 - Tracking attivo'],
      ['Ricarica PayPal 200 EUR completata','Accredito su conto R***@gmail.com - 3.8s'],
      ['Nuovo feedback 5 stelle','TRASFERIMENTO ADVANCED - Recensione verificata'],
      ['Ordine #ASSET-33271 consegnato','CARTA MEDIUM V2 - Saldo confermato'],
      ['Nuovo cliente VIP registrato','Acquisto confermato - Accesso prioritario abilitato']
    ];
    feed.innerHTML=evs.map(e=>`<div class="row"><b>${e[0]}</b><br><span>${e[1]}</span></div>`).join('');
  }

  // Contatori
  $$('[data-count]').forEach(el=>{
    const target=+el.dataset.count; let n=0; const step=Math.max(1,Math.ceil(target/60));
    const t=setInterval(()=>{n+=step; if(n>=target){n=target;clearInterval(t);} el.textContent=n.toLocaleString('it-IT');},25);
  });

  // Modal lingua
  const modal=$('#langModal');
  if(modal){
    const saved=localStorage.getItem('mw_lang');
    if(saved) modal.classList.add('hidden');
    $$('.lang-opt').forEach(b=>b.onclick=()=>{
      $$('.lang-opt').forEach(x=>x.classList.remove('sel')); b.classList.add('sel');
    });
    $('#langContinue')?.addEventListener('click',()=>{
      localStorage.setItem('mw_lang','it'); modal.classList.add('hidden');
    });
  }

  renderCart();
})();
