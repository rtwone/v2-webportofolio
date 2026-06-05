async function cek(){
 const nomor=document.getElementById('nomor').value.trim();
 const hasil=document.getElementById('hasil');
 hasil.textContent='Loading...';

 try{
   const res=await fetch('/api/cek',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({msisdn:nomor})
   });
   const data=await res.json();
   hasil.textContent=JSON.stringify(data,null,2);
 }catch(e){
   hasil.textContent='Error: '+e.message;
 }
}