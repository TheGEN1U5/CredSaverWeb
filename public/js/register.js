var respV
var respC
function verifyPassword() {
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var messageV = document.getElementById("messageV")
    var submitBtn = document.getElementById("submit-btn")
    submitBtn.disabled = true;
    var pw = document.getElementById("password").value;
    if(pw == "") {  
        messageV.innerHTML = "Password can't be empty";
        respV=false
    }else if(pw.length < 6) {  
        messageV.innerHTML = "Must be atleast 6 characters";
        respV=false
    }else if(pw.length > 15) {  
        messageV.innerHTML = "Must be less than 15 characters";
        respV=false
    }else if (!format.test(pw)){
        messageV.innerHTML = "Must contain a special character";
        respV=false
    } else {
        messageV.innerHTML = "";
        respV=true;
    }
}
function confirmPassword(){
    var submitBtn = document.getElementById("submit-btn")
    var pw1 = document.getElementById("password").value;
    console.log(pw1)
    var pw2 = document.getElementById("Cpassword").value;
    console.log(pw2)
    if(pw1 != pw2){   
        document.getElementById("messageC").innerHTML = "Passwords don't match";
        submitBtn.disabled = true;
    }else {
        document.getElementById("messageC").innerHTML = "";
        if (respV){
            submitBtn.disabled = false;
            respC = true
        }else{
            submitBtn.disabled = true;
        }
        
    }
}