console.log("connect")

console.log($("#sender").html());

var x = $("#sub");
let msg = $("#msg")

// console.log(req.user);
// var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
// ​
// var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");

x.hover(()=>{
    
    let key = $("#sender").html()+$("#reciever").val();
    
    key = key.replace(" ","");
    console.log(key);
    msg.val(CryptoJS.AES.encrypt(msg.val(),key.trim()).toString());
    console.log(msg.val()); 
})

