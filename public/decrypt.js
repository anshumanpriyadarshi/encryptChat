console.log("con")
let btn = $(document).ready(function(){
    $("button").on('click', function(){
         $(this).html("decrypted");
         let parentdiv = $(this).parent().find("p")
        
         console.log(parentdiv.html().trim());
         console.log($(this).parent().find("h5").html()+$("span").html());
         //  console.log(CryptoJS.AES.decrypt(parentdiv.html(), $(this).parent().find("h5").html()+$("span").html()).toString(CryptoJS.enc.Utf8));
         var decr = CryptoJS.AES.decrypt(parentdiv.html().trim(), $(this).parent().find("h5").html()+$("span").html()).toString(CryptoJS.enc.Utf8);
            console.log(decr);

         parentdiv.html(CryptoJS.AES.decrypt(parentdiv.html().trim(), $(this).parent().find("h5").html()+$("span").html()).toString(CryptoJS.enc.Utf8));
  });
});

// CryptoJS.AES.decrypt(encrypted, "Secret Passphrase"
// btn.val("hahah");