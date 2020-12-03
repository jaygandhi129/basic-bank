var msg1 = document.getElementsByClassName("ANF")[0];
var msg2 = document.getElementsByClassName("IB")[0];
var msg3 = document.getElementsByClassName("Success")[0];

if(msg1!==undefined){
    alert("Account Not Found!");
}
if(msg2 !==undefined){
    alert("Insufficient Balance in Sender's Account");
}
if(msg3 !==undefined){
    alert("Money Transferred Successfully !");
}