const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/cek', async (req,res)=>{
 try{
   const { msisdn } = req.body;

   const response = await axios.post(
     'https://tri.co.id/api/v1/information/sim-status',
     {
       action:'MSISDN_STATUS_WEB',
       input1:'',
       input2:'',
       language:'ID',
       msisdn
     },
     {
       headers:{
         'Content-Type':'application/json',
         'Origin':'https://tri.co.id',
         'Referer':'https://tri.co.id/'
       }
     }
   );

   res.json(response.data);
 }catch(err){
   res.status(500).json({
     error:true,
     message:err.message
   });
 }
});

app.listen(3000,()=>{
 console.log('http://localhost:3000');
});
