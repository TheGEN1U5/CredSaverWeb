var r = document.querySelector(':root')

function toggleDarkMode(isDarkMode){
    if (isDarkMode){
        r.style.setProperty('--whiteBG', '#2a2b2e');
        r.style.setProperty('--white', '#b8b8b8');
        r.style.setProperty('--yellow', 'rgb(215, 190, 0)');
        r.style.setProperty('--darkBlue', '#011485');
        r.style.setProperty('--darkYellow', 'rgb(146, 134, 42)');
        r.style.setProperty('--grey', '#858585');
        r.style.setProperty('--blue', 'rgb(36, 36, 110)');
        r.style.setProperty('--yellowHover', 'rgb(202, 183, 32)');
        r.style.setProperty('--black', '#ededed');
        r.style.setProperty("--tableBorderGrey", "rgb(189, 189, 189)");
        r.style.setProperty("--tableBgGrey", "rgb(92, 92, 92)");
        r.style.setProperty("--messageRed", "rgb(210, 0, 0)");
        r.style.setProperty("--fieldYellow", "rgb(222, 202, 154)");
        r.style.setProperty("--fieldYellowHover", "rgb(195, 152, 10)");
        r.style.setProperty("--link", "#a5a5ff");
        isDarkModeCurrent = true;
        var theme = {
            isDarkMode: true
        }
        localStorage.setItem("theme",JSON.stringify(theme))
    }else{
        r.style.setProperty('--whiteBG', '#F2F6F6');
        r.style.setProperty('--white', '#F2F6F6');
        r.style.setProperty('--yellow', 'rgb(255, 225, 0)');
        r.style.setProperty('--darkBlue', '#011485');
        r.style.setProperty('--darkYellow', 'rgb(184, 169, 54)');
        r.style.setProperty('--grey', '#646D73');
        r.style.setProperty('--blue', 'rgb(73, 73, 220)');
        r.style.setProperty('--yellowHover', 'rgb(202, 183, 32)');
        r.style.setProperty('--black', 'black');
        r.style.setProperty("--tableBorderGrey", "rgb(92, 92, 92)");
        r.style.setProperty("--tableBgGrey", "rgb(189, 189, 189)");
        r.style.setProperty("--messageRed", "rgb(210, 0, 0)");
        r.style.setProperty("--fieldYellow", "rgb(255, 229, 165)");
        r.style.setProperty("--fieldYellowHover", "rgb(255, 199, 13)");
        r.style.setProperty("--link", "blue");
        isDarkModeCurrent = false;
        var theme = {
            isDarkMode: false
        }
        localStorage.setItem("theme",JSON.stringify(theme))
    }
}