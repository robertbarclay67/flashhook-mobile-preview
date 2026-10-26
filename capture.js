(() => {
'use strict';const $=id=>document.getElementById(id),key='flashhook-public-preview-ideas-v1';let ideas=[],readable=true;
function render(){$('ideas').replaceChildren(...ideas.map(text=>{const row=document.createElement('article');row.className='item';row.textContent=text;return row;}));}
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(saved)||!saved.every(x=>typeof x==='string'))throw Error();ideas=saved;}catch{readable=false;$('ideaStatus').textContent='Saved ideas could not be read. Existing data will not be overwritten.';}
render();$('save').addEventListener('click',()=>{const body=$('ideaText').value.trim();if(!body){$('ideaStatus').textContent='Write an idea first.';return;}if(!readable){$('ideaStatus').textContent='Existing data is unreadable. Copy this idea before leaving.';return;}try{const next=[body,...ideas];localStorage.setItem(key,JSON.stringify(next));ideas=next;render();$('ideaText').value='';$('ideaStatus').textContent='Saved in this device’s Idea Pool.';document.dispatchEvent(new Event('flashhook:idea-saved'));}catch{$('ideaStatus').textContent='Could not save. Copy your idea before leaving.';}});
})();
