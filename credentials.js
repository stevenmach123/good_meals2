
class UserInfo {
    constructor(){
        this.email = null;
        this.username = null;
        this.password = null;
        this.age = null;
        this.height = null;
        this.weight = null;
        this.fitnessGoal = null;
        this.vegan = false;
        this.tips = false;
    }
};

// variables
var userInfo;

function init(){
    localStorage.clear();
}

function getUserInfo(){
    var userInfo = new UserInfo();
    userInfo.email = document.getElementById('email').value;
    userInfo.username = document.getElementById('username').value;
    userInfo.password = document.getElementById('password').value;
    userInfo.age = document.getElementById('age').value;
    userInfo.height = document.getElementById('height').value;
    userInfo.weight = document.getElementById('weight').value;
    userInfo.fitnessGoal = document.getElementById('fitnessGoal').value;
    userInfo.vegan = document.getElementById("veganCheckbox").checked;
    userInfo.tips = document.getElementById("tipsCheckbox").checked;

    // save user dât 
    localStorage.setItem("email", userInfo.email);
    localStorage.setItem("username", userInfo.username);
    localStorage.setItem("password", userInfo.password);
    localStorage.setItem("age", userInfo.age);
    localStorage.setItem("height", userInfo.height);
    localStorage.setItem("weight", userInfo.weight);
    localStorage.setItem("finessGoal", userInfo.fitnessGoal);
    localStorage.setItem("vegan", userInfo.vegan);
    localStorage.setItem("tips", userInfo.tips);
}

function checkLoginCredentials(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if(username == localStorage.getItem("username") 
        && password == localStorage.getItem("password")){
        window.location.href = "Documents/SP2021/CS424/weby/main2m.html";
    }
    else{
        document.getElementById("wrongCredentials").style.visibility = "visible";
    }
}


// display the fitness vales hint
function displayHint(){
    var hint = document.getElementById("fitnessHint");
    console.log(hint.style.visibility);

    // toggle the hint text box
    if(hint.style.visibility == "visible"){
        offset = 0.01;
        hint.style.visibility = "hidden";
    }
    else{
        hint.style.visibility = "visible";
    }
        
    // var timer = setInterval(function(){
    //     if(counter == 99){
    //         clearInterval(timer);
    //         hint.style.visibility = visibility;
    //     }
    //     else{
    //         temp += offset;
    //         hint.style.opacity = temp.toString();
    //         console.log(temp.toString());
    //         counter++;
    //     }
    // }, 10);
}


