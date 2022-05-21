window.onload = () =>{
    var eyeList1 = document.getElementsByClassName('fa-eye')
    for(i=0 ; i<eyeList1.length ; i++){
        eyeList1[i].style.display = 'inline'
    }
    var eyeList = document.getElementsByClassName('fa-eye-slash')
    for(i=0 ; i<eyeList.length ; i++){
        eyeList[i].style.display = 'none'
    }
    var noCred = document.getElementById('notfound')
    noCred.style.display = 'none'
    setTimeout(() => {
        document.querySelector('.wrapper-wrapper').style.visibility = "hidden";
        document.querySelector('.wrapper-wrapper').style.opacity = "0";
    }, 2000);
}
hideShowfunc = () => {
    var pwdList = document.getElementsByClassName('pwdBox')
    console.log(pwdList.length)
    var i;
    for(i = 0 ; i < pwdList.length ; i++){
        console.log(i)
        var x = pwdList[i]
        if (x.type === "password") {
            x.type = "text";
            // style.display = 'none'
            var eyeList1 = document.getElementsByClassName('fa-eye')
            for(j=0 ; j<eyeList1.length ; j++){
                eyeList1[j].style.display = 'none'
            }
            var eyeList = document.getElementsByClassName('fa-eye-slash')
            for(j=0 ; j<eyeList.length ; j++){
                eyeList[j].style.display = 'inline'
            }
        } else {
            x.type = "password";
            var eyeList = document.getElementsByClassName('fa-eye-slash')
            for(j=0 ; j<eyeList.length ; j++){
                eyeList[j].style.display = 'none'
            }
            var eyeList1 = document.getElementsByClassName('fa-eye')
            for(j=0 ; j<eyeList1.length ; j++){
                eyeList1[j].style.display = 'inline'
            }
        }
    }
    
}

var searchFunc = ()=>{
    var query = document.getElementById('searchbar').value.toLowerCase()
    var creds = document.getElementsByClassName('creds')
    for(i=0 ; i<creds.length ; i++){
        var text = creds[i].getElementsByClassName('sitename')[0].innerText.toLowerCase()
        if (text.indexOf(query) > -1) {
            creds[i].style.display = "";
        } else {
            creds[i].style.display = "none";
        }
    }
    var counter = 0
    for(i=0 ; i<creds.length ; i++){
        if(creds[i].style.display !== 'none'){
            counter = 0
            console.log(counter)
        }else if(creds[i].style.display == 'none'){
            counter++
            console.log(counter)
        }
    }
    if(counter == creds.length){
        var noCred = document.getElementById('notfound')
        noCred.style.display = 'block'
    }else{
        var noCred = document.getElementById('notfound')
        noCred.style.display = 'none'
    }
}
