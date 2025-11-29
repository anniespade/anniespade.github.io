// Basic client-side passcode gate.
// For production, swap to a server check (e.g., Netlify/Supabase) so codes aren't visible.
const input = document.getElementById('code-input');
const btn = document.getElementById('enter-btn');
const msg = document.getElementById('msg');

async function fetchCodes(){
  try{
    const res = await fetch('passcodes.json', {cache:'no-store'});
    if(!res.ok) throw new Error('passcodes not found');
    return await res.json();
  }catch(e){
    msg.textContent = 'Could not load codes. Try again soon.';
    msg.className = 'msg error';
    throw e;
  }
}

async function handleEnter(){
  const code = (input.value || '').trim();
  if(!code){ msg.textContent='Enter your passcode ✨'; msg.className='msg'; return; }

  const codes = await fetchCodes(); // [{code:"...", name:"..."}]
  const found = codes.find(c => c.code.toLowerCase() === code.toLowerCase());

  if(found){
    msg.textContent = 'Welcome, angel. ♡';
    msg.className = 'msg ok';
    // set session flags for the secret page
    sessionStorage.setItem('as_access_ok', '1');
    sessionStorage.setItem('as_fan_name', found.name || 'Angel');
    sessionStorage.setItem('as_code', found.code);
    // small delay for vibes
    setTimeout(()=> location.href='secret.html', 450);
  }else{
    msg.textContent = 'That code’s not it, bestie 💔';
    msg.className = 'msg error';
    input.select();
  }
}

btn?.addEventListener('click', handleEnter);
input?.addEventListener('keydown', (e)=>{ if(e.key==='Enter') handleEnter(); });
