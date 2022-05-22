function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imgUploaded').attr('src', e.target.result).width('50%').height('auto');
        };

        reader.readAsDataURL(input.files[0]);
    }
}
function makeActive(id) {
    if (id=='profile') {
        document.getElementById("profile-link").classList.add('active');
        document.getElementById("security-link").classList.remove('active');
        document.getElementById("upgrade-link").classList.remove('active');
    } if (id=='security') {
        document.getElementById("profile-link").classList.remove('active');
        document.getElementById("security-link").classList.add('active');
        document.getElementById("upgrade-link").classList.remove('active');
    } if (id=='upgrade') {
        document.getElementById("profile-link").classList.remove('active');
        document.getElementById("security-link").classList.remove('active');
        document.getElementById("upgrade-link").classList.add('active');
    }
}
var respV
var respC
function verifyPassword() {
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var messageV = document.getElementById("messageV")
    var submitBtn = document.getElementById("submit-btn")
    submitBtn.disabled = true;
    var pw = document.getElementById("new_pass").value;
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
    var pw1 = document.getElementById("new_pass").value;
    var pw2 = document.getElementById("r_new_pass").value;
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

//Observer 1                
const elems1 = document.querySelectorAll('#profile');

observer1 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
            document.getElementById("profile-link").classList.add('active');
            document.getElementById("security-link").classList.remove('active');
            document.getElementById("upgrade-link").classList.remove('active');
        }
    });
});

elems1.forEach(text => {
    observer1.observe(text);
});

//Observer2
const elems2 = document.querySelectorAll('#security');
observer2 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
            document.getElementById("profile-link").classList.remove('active');
            document.getElementById("security-link").classList.add('active');
            document.getElementById("upgrade-link").classList.remove('active');
        }
    });
});

elems2.forEach(text => {
    observer2.observe(text);
});

//Observer3
const elems3 = document.querySelectorAll('#upgrade');
observer3 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
            document.getElementById("profile-link").classList.remove('active');
            document.getElementById("security-link").classList.remove('active');
            document.getElementById("upgrade-link").classList.add('active');
        }
    });
});

elems3.forEach(text => {
    observer3.observe(text);
});
