// get user information from local storage
function getUserInfomation(){
    var userInfo = new UserInfo();
    userInfo.email = localStorage.getItem("email");
    userInfo.username = localStorage.getItem("username");
    userInfo.password = localStorage.getItem("password");
    userInfo.age = localStorage.getItem("age");
    userInfo.height = localStorage.getItem("height");
    userInfo.weight = localStorage.getItem("weight");
    userInfo.fitnessGoal = localStorage.getItem("finessGoal");
    userInfo.vegan = localStorage.getItem("vegan");
    userInfo.tips = localStorage.getItem("tips");

    return userInfo;
}

function setUserInfo(){
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
    // save user data
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

// function attached to "Confim Edits" button
function editInformation(){
    //close the edit panel
    document.getElementById("my-edit-panel").style.display = "none";
    // save data to local storage
    setUserInfo();

    // get data from local storage
    userInfo = getUserInfomation();

    // display edited information and intake
    displayInformation(userInfo);
}