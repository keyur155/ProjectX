import crypto from 'crypto';

function GenerateOtp(length =6){
 const min=Math.pow(10,length-1);
 const max =Math.pow(10,length) -1;
 return crypto.randomInt(min,max+1);
}



export default GenerateOtp;