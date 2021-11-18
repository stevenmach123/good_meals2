var food ; 


var store_list ={"li1":[],"li2":[],"li3":[]}; 
arrDay=[] // collection of Days object  
var selectDay = null; 
var selectIndex = null ; 
var cur_li_id  = null; 
var plannedDays = [];
var currPlannedDay = null;

// calendar date variables
var currSelectedDay = null;
var thisYear, thisMonth, thisDay;


function get_unique(id){
    var kui = id.split('_');
    
    var true_id = "";
    for(var i =1; i < kui.length; i++ ){
        if(i == kui.length-1){
            true_id = true_id + kui[i]; 
        }
        else{
         true_id = true_id + kui[i]+"_"; 
        }
    }
    return true_id;
}

function deleteAll(container){
    console.log(container.childNodes.length); 
    var count = container.childNodes.length;
    while(container.firstChild  ){
        console.log(container.firstChild);   
        container.removeChild(container.firstChild); 
       
    }
}


function go_add(ev){
    var true_id = get_unique(ev.id);

    
  food = document.querySelector("#"+true_id);
  food.style.borderColor = "red";

  var name  =food.firstElementChild.nextElementSibling
 document.querySelector("#what_food").textContent  = name.textContent; 

  var op_list = document.querySelector("#popup_option_list");
  op_list.style.visibility ="visible"; 

  var food_item = document.querySelector(".food_item"); 
  console.log(food_item.offsetWidth);
  op_list.style.width =  (food_item.offsetWidth*0.90).toString()+"px";

    
  op_list.classList.add("show"); 
 
  sec_head = document.querySelector(".sec_head");
    
  sec_head.style.pointerEvents ="none";
  op_list.style.pointerEvents ="initial";
  

}




function see_list(ev){ 
    var collection = document.querySelector("#popup_collection #collection");
    var outer_collection = document.querySelector("#popup_collection");
   deleteAll(collection);
         
    var items_list = store_list[ev.id]; 

    cur_li_id = ev.id; 

    // display no item added message
    if(items_list.length < 1){
        document.getElementById("noFoodMessage").style.display = "unset";
    }
    else{
        document.getElementById("noFoodMessage").style.display = "none";
    }

    for(var i=0; i<items_list.length;i++){ 
        put_to_list(collection,items_list[i] );
    }


    
    var food_item = document.querySelector(".food_item");
    outer_collection.style.width  =  (food_item.offsetWidth*0.90).toString()+"px";
 
    outer_collection.style.visibility ="visible";
    outer_collection.classList.add("show");

    sec_head = document.querySelector(".sec_head");
    
    sec_head.style.pointerEvents ="none";
    outer_collection.style.pointerEvents ="initial";
  
   
} 

function put_to_list(selector,item ){


    var food = document.querySelector("#"+item); 
  
    var box_item= document.createElement("div"); 
    box_item.classList.add("item_box");
    box_item.setAttribute("idd",item); 

    var sti_img = document.createElement("IMG"); 
    var sti_name = document.createTextNode("");
  
    var chi = food.firstElementChild ;
    var chi_name =  chi.nextElementSibling; 
  
    sti_name.textContent =chi_name.innerHTML ;
    console.log("name ",chi_name.innerHTML);
    sti_img.src =chi.src; 
    sti_img.style.height = "110px";
    sti_img.style.width ="160px";

    var remove_but = document.createElement("button"); 
   
    remove_but.textContent = "DELETE";
    remove_but.classList.add("remove_item");
    var find = -1;  

    remove_but.addEventListener("click",function(e){
        var collection = document.querySelector("#collection"); 
        for(var i=0; i<collection.childNodes.length;i++){
            var item = collection.childNodes[i]; 
            if( item.contains(e.target) ){
                find = i;
            }
                     
        }
        if(find !=-1){
            var item = collection.childNodes[find]; 

            var food_id = item.getAttribute("idd");
            collection.removeChild(collection.childNodes[find]);
            console.log(store_list[cur_li_id]);
            store_list[cur_li_id].splice(find,1);
            
            if(store_list[cur_li_id].length == 0){
                document.getElementById("noFoodMessage").style.display = "unset";
            }

            // check if all the meal plan is empty
            // if empty, set the background of day to not planned
            if(store_list["li1"].length == 0 && store_list["li2"].length == 0 && store_list["li3"].length == 0){
                currSelectedDay.style.backgroundColor = "white";
                
            }
                
            removeAMeal(food_id,cur_li_id);
        }
       
        alertCheck();
    });
    
  /*
   addLISTENER.(,)
    var outer_collection = document.querySelector("#popup_collection");
    outer_collection.removeChild(this); s 
    for(var i=0; i<collection.childNode.length;i++){
        
    }
  */
  
    
    //"rgba(0,0,0,0.15)"
    box_item.append(sti_img,sti_name,remove_but); 
       
  
  
     selector.append(box_item); 
  }





var day_protein = document.querySelector(".plan_day"+" "+"#protein"); 
var day_fat = document.querySelector(".plan_day"+" "+"#fat"); 
var day_sodium = document.querySelector(".plan_day"+" "+"#sodium"); 
var day_vitamin  =document.querySelector(".plan_day"+" "+"#vitamin"); 
var day_calo = document.querySelector(".plan_day"+" "+"#calo"); 
var day_list_count  = document.querySelector(".plan_day"+" "+"#num_item"); 

function removeAMeal(food_id,li_id){
    
    day_protein.textContent  =  parseFloat(day_protein.textContent)- parseFloat(document.querySelector("#"+food_id+" "+"#"+"protein").textContent);
    day_fat.textContent   =   parseFloat(day_fat.textContent) - parseFloat(document.querySelector("#"+food_id+" "+"#"+"fat").textContent);
    day_sodium.textContent = (parseFloat(day_sodium.textContent) - parseFloat(document.querySelector("#"+food_id+" "+"#"+"sodium").textContent)).toFixed(1);
    day_vitamin.textContent  = parseFloat(day_vitamin.textContent) - parseFloat(document.querySelector("#"+food_id+" "+"#"+"vitamin").textContent);
    day_calo.textContent   = parseInt(day_calo.textContent)  - parseInt(document.querySelector("#"+food_id+" "+"#"+"calo").textContent);
    day_list_count.textContent  = parseInt(day_list_count.textContent)  -1;
    updateAMeal(li_id);
}


 function addNutri(li_id){
    var items_list = store_list[li_id];
    var protein =0 ;
    var fat = 0; 
    var sodium =0;
    var vitamin =0; 
    var calo = 0; 
   
    for(var i=0; i<items_list.length;i++){
         var food_id = items_list[i]; 
         protein  +=  parseFloat(document.querySelector("#"+food_id+" "+"#"+"protein").textContent);
         fat  +=  parseFloat(document.querySelector("#"+food_id+" "+"#"+"fat").textContent);
         sodium  +=  parseFloat(document.querySelector("#"+food_id+" "+"#"+"sodium").textContent);
         vitamin  += parseFloat(document.querySelector("#"+food_id+" "+"#"+"vitamin").textContent); 
         calo +=   parseFloat(document.querySelector("#"+food_id+" "+"#"+"calo").textContent); 
        
    }
    day_protein.textContent  = parseFloat(day_protein.textContent) + protein; 
    day_fat.textContent  = parseFloat(day_fat.textContent) + fat; 
    day_sodium.textContent  = (parseFloat(day_sodium.textContent) + sodium).toFixed(1); 
    day_vitamin.textContent  = parseFloat(day_vitamin.textContent) + vitamin; 
    day_calo.textContent  = parseFloat(day_calo.textContent) + calo; 
    
    
 }




function to_list(ev){
    var li_id = "li"+ ev.id 
    store_list[li_id].push(food.id);

  
    day_protein.textContent =0; 
    day_fat.textContent =0; 
    day_sodium.textContent =0; 
    day_vitamin.textContent =0; 
    day_calo.textContent =0; 
    
    addNutri("li1");
    addNutri("li2");
    addNutri("li3");
    day_list_count.textContent = store_list["li1"].length + store_list["li2"].length +store_list["li3"].length;


    
   
    updateAMeal(li_id);
    var op_list = document.querySelector("#popup_option_list");
    op_list.style.visibility  = "hidden"; 
    //op_list.classList.remove("show");

    alertCheck();

     
    // mark the day as planned
   currSelectedDay.style.backgroundColor = "aqua";
   plannedDays.push(currPlannedDay);
   
   
    
   sec_head.style.pointerEvents ="initial";
  
}





function updateAMeal(li_id){
    var list_count  = document.querySelector("#"+li_id +" "+"#num_item");
    var list_calo  = document.querySelector("#"+li_id +" "+"#calo"); 
    list_calo.textContent =0; 

    list_count.textContent=  store_list[li_id].length;
    

    var len  = list_count.textContent ;
    var items_list = store_list[li_id];
    for(var i = 0; i < len;i++ ){
        var food_id = items_list[i]; 
        var item_calo =  document.querySelector("#"+food_id+" "+"#calo").textContent; 
        
        list_calo.textContent  = parseFloat(list_calo.textContent) + parseFloat(item_calo);
    }

}



// var selectDay = new Days("4-3-2021"); 
// arrDay.push(selectDay); 
// selectIndex =0 ;

function lookUpIndex(key){ 
    for(var i=0; i< arrDay.length;i++){
        if(key == arrDay[i].key){
            return i; 
        }
    }
    return -1; 
}

function updateSelectorID(li,meal){
    store_list[li] = [];
    meal.forEach(function(food_id,index){
        store_list[li].push(food_id);
    }
    
    )
    
}


function updateMealInfo(li_id,obj_meal){
    document.querySelector("#"+li_id+" "+"#num_item").textContent =obj_meal.getItems();
    document.querySelector("#"+li_id +" "+"#calo").textContent  =  obj_meal.getCalories();
    
}


function triggerNewDay(uni_key){  
    
    selectDay.sum_protein = day_protein.textContent; 
    selectDay.sum_sodium =  day_sodium.textContent; 
    selectDay.sum_vitamin =  day_vitamin.textContent; 
    selectDay.sum_fat = day_fat.textContent;  
  
    selectDay.breakfast.foodList  = store_list["li1"];
    selectDay.lunch.foodList   =store_list["li2"];
    selectDay.dinner.foodList  = store_list["li3"];

   
    

    var exist= lookUpIndex(uni_key); 

    if(exist >= 0){
         selectDay = arrDay[exist];
         selectIndex = exist; 
       
    }
    else{
        selectDay = new Days(uni_key); 
        arrDay.push(selectDay); 
        selectIndex = arrDay.length -1; 
    }

    updateList(selectDay);  
}



function updateList(selectDay){ 
    
    day_protein.textContent  =parseFloat(selectDay.sum_protein); 
    day_sodium.textContent  = parseFloat(selectDay.sum_sodium).toFixed(1); 
    day_vitamin.textContent =parseFloat(selectDay.sum_vitamin); 
    day_fat.textContent =parseFloat(selectDay.sum_fat); 
  
    
    updateMealInfo("li1",selectDay.breakfast); 
    updateMealInfo("li2",selectDay.lunch);
    updateMealInfo("li3",selectDay.dinner);
    
    updateSelectorID("li1",selectDay.breakfast.foodList);
    updateSelectorID("li2",selectDay.lunch.foodList );
    updateSelectorID("li3",selectDay.dinner.foodList );

    console.log("updateList"+selectDay.dinner.foodList);
    

    var total_items =  selectDay.breakfast.items  +  selectDay.lunch.items  +  selectDay.dinner.items ;
    var total_calo =  selectDay.breakfast.calo  +  selectDay.lunch.calo  +  selectDay.dinner.calo ;
    day_list_count.textContent =   total_items;
    day_calo.textContent = total_calo;

   
        
        
    
}
























function go_delete(ev){
   
    var true_id = get_unique(ev.id);
    console.log("del ",true_id);

    var a  = document.querySelector("#popup_"+true_id);
    a.style.visibility ="hidden";
    a.classList.remove("show"); 
    sec_head = document.querySelector(".sec_head");
     sec_head.style.pointerEvents ="unset";
}; 


function go_detail(ev){
    var true_id = get_unique(ev.id);
    

    var pop  = document.querySelector("#popup_"+true_id );
    var pop_img = pop.firstElementChild;
   
    pop_img.style.width = "140px";
    pop_img.style.height = "80px";
    
    var food_item = document.querySelector(".food_item"); 
   
    pop.style.width =  (food_item.offsetWidth).toString()+"px";
    
    var isAdded = false;
    for(var i = 0; i < pop.children.length; i++){
        console.log(pop.children.item(i).id);
        if(pop.children.item(i).id == "recipeBtn"){
            isAdded = true;
        }
    }

    if(!isAdded) {
        // attempt to add button "How to cook" to detail window
        var recipeBtn = document.createElement("button");
        recipeBtn.id = "recipeBtn";
        recipeBtn.textContent = "HOW TO COOK";
        recipeBtn.style.float = "left";
        recipeBtn.style.margin = "10px";
        recipeBtn.classList.add("hoverItem");
        // append "how to cook" button to the popup
        pop.appendChild(recipeBtn);
    }
    

    if(pop.style.visibility == "hidden" || pop.style.visibility==""){
        console.log("in hidden");
        pop.style.visibility ="visible";
        pop.classList.add("show"); 

     
    }

    sec_head = document.querySelector(".sec_head");
    
    sec_head.style.pointerEvents ="none";
    pop.style.pointerEvents ="initial";
    sec_head.classList.add("blur_dark");

}

document.querySelector("#meat_item").style.visibility ="visible";

var current_tab = null; 
current_tab = "meat";

function bring_list(ev){
    var id = ev.id;
    var  l  = ["meat","vegi","soup"];
    
   // console.log(ev.id);
    var kui = id.split('_');
    current_tab  = kui[1]; 
    var item_list = document.querySelector("#"+kui[1]+"_item"); 
    item_list.style.visibility  = "visible"; 
    l.forEach(function(key,index){
       // console.log("[ ",key);
        if(key != kui[1]){
            var nol  = document.querySelector("#"+key+"_item"); 
          //  console.log("-",nol.id);
            nol.style.visibility  = "hidden"; 
        }
    });
    document.querySelector("#type_title").textContent = kui[1].toUpperCase();

 

    
}


console.log("start game");


//
// ***************************Start Nguyen Hoa's code *******************
//

// create transparent outline for all days

var userInfo; // store user information received from registration
var dailyIntake;
window.onload = function(){
    // create calendar
    var elem = document.querySelector("#calendarContent");

    // get the current month and year
    var today = new Date();
    thisMonth = today.getMonth() + 1;
    thisYear = today.getFullYear();
    thisDay = today.getDate();
    
    // create calendar with the 
    createCalendar(elem, thisYear, thisMonth);

    // Add listeners for the elements in the calendar
    addCalendarEventListener();

    // select today
    var str = "" + thisMonth + "-" + thisDay + "-" + thisYear;
    selectDay = new Days(str); 
    arrDay.push(selectDay); 
    selectIndex = 0; 
    $("#planDate").text(str);
    currPlannedDay = str;
    // loop through all the days and highlight today
    var days = document.getElementsByClassName("day");;
    for(var i = 0; i < days.length; i++){
        if(parseInt(days[i].innerHTML) == thisDay){
            days[i].style.outline = "2px solid red";
            currSelectedDay = days[i];
        }
    }

    // get the user information from the local storage
    userInfo = getUserInfomation()
    displayInformation(userInfo);
    console.log(userInfo);

    // calculate daily intake
    dailyIntake = new DailyIntake();
    dailyIntake.calculate(userInfo);
    console.log(dailyIntake);
    updateCap();

    
}


// create the calendar
function createCalendar(elem, year, month) {
    // update the year and month
    document.querySelector("#year").innerHTML = year.toString();
    
    document.querySelector("#month").innerHTML = (new MyDay()).numberToMonthName(month);

    let mon = month - 1; // months in JS are 0..11, not 1..12
    let d = new Date(year, mon);

    let table = `<table id="calendarContent" style="border-collapse: collapse;">
                <tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>`;

    // spaces for the first row
    // from Monday till the first day of the month
    // * * * 1  2  3  4
    for (let i = 0; i < getDay(d); i++) {
        table += '<td></td>';
    }

    // <td> with actual dates
    while (d.getMonth() == mon) {
        table += '<td><button class="day">' + d.getDate() + '</button></td>';

        if (getDay(d) % 7 == 6) { // sunday, last day of week - newline
            table += '</tr><tr>';
        }

        d.setDate(d.getDate() + 1);
    }

    // add spaces after last days of month for the last row
    // 29 30 31 * * * *
    if (getDay(d) != 0) {
        for (let i = getDay(d); i < 7; i++) {
            table += '<td></td>';
        }
    }

    // close the table
    table += '</tr></table>';

    // create the elements of calendar
    elem.innerHTML = table;

    // add event listeners for newly created days
    $("#calendarContent tr td button").on("click", onDayClick);
    $("#calendarContent tr td button").on("mouseover", onDayHover);
    $("#calendarContent tr td button").on("mouseout", onDayOut);

    // disable the days before today
    disableDaysBeforeToday();
}

// get the date Monday or Tuesday or... Sunday
function getDay(date) { // get day number from 0 (monday) to 6 (sunday)
  let day = date.getDay();
  if (day == 0) day = 7; // make Sunday (0) the last day
  return day - 1;
}

// disable the buttons of the days that are before today
function disableDaysBeforeToday(){
    // get all the buttons
    var days = document.getElementsByClassName("day");

    // get the Date object
    var date = new Date();
    
    // get the current year and month
    var realMonth = date.getMonth() + 1;
    var realYear = date.getFullYear();

    function disableDays(days, end){
        for(var i = 0; i < end; i++){
            days[i].disabled = true;
            days[i].style.outline = "none";
        }
    }

    // disables all the days in the month before the current month
    if(thisYear == realYear){
        if(thisMonth < realMonth){
            disableDays(days, days.length);
        }
        else if(thisMonth == realMonth){
            // disable all the days before the current day of this month
            disableDays(days, thisDay - 1);
        }
    }
    else if(thisYear < realYear){
        // if the year is smaller than current year,
        // disable all days
        disableDays(days, days.length);
    }
    
}

// go to next month
function nextMonth(){
    // update the month and year
    if(thisMonth < 12)
        thisMonth++;
    else if(thisMonth == 12){
        thisMonth = 1;
        thisYear++;
    }

    // update the calendar
    createCalendar(document.querySelector("#calendarContent"), thisYear, thisMonth);

    // highlight the planned days
    highlightPlannedDays();
}

// go to previous month
function previousMonth(){
    // update the month and year
    if(thisMonth > 1)
        thisMonth--;
    else if(thisMonth == 1){
        thisMonth = 12;
        thisYear--;
    }

    // update the calendar
    createCalendar(document.querySelector("#calendarContent"), thisYear, thisMonth);

    // highlight the planned days
    highlightPlannedDays();
}

// change the color of the planned date if any
function highlightPlannedDays(){
    console.log("heer");
    // loop through all the planned days
    for(var i = 0; i < plannedDays.length; i++){
        // get the date
        var day = plannedDays[i].split("-");
        // get the day, month, year
        var mm = parseInt(day[0]);
        var dd = parseInt(day[1]);
        var yyyy = parseInt(day[2]);

        var dayButtons = [];

        // get all the days buttons
        var days = document.getElementsByClassName("day");

        // highlight the planned day
        if(mm == thisMonth && yyyy == thisYear){
            days[dd - 1].style.backgroundColor = "aqua";
        }
    }

}

//--LUKE NORRIS' CODE STARTS HERE

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

//Display user information and intake
function displayInformation(inputInfo){
    document.getElementById("USERname").innerHTML = inputInfo.username;
    document.getElementById("USERage").innerHTML = "Age: " + inputInfo.age;
    document.getElementById("USERheight").innerHTML = "Height: " + inputInfo.height;
    document.getElementById("USERweight").innerHTML = "Weight: " + inputInfo.weight;
    document.getElementById("USERfitnessgoal").innerHTML = "Fitness Goal: " + inputInfo.fitnessGoal;
    var isVegan = "yes";
    if(inputInfo.vegan == "false")
        isVegan = "no";
    document.getElementById("USERvegan").innerHTML = "Vegan: " + isVegan;

    dailyIntake = new DailyIntake();
    dailyIntake.calculate(userInfo);
    document.getElementById("USERcalories").innerHTML = "Calories: " + dailyIntake.calo;
    document.getElementById("USERvitamin").innerHTML = "Vitamins: " + dailyIntake.vitamin + " mg";
    document.getElementById("USERsodium").innerHTML = "Sodium: " + dailyIntake.sodium + " g";
    document.getElementById("USERfat").innerHTML = "Fat: " + dailyIntake.fat + " g";
    document.getElementById("USERprotein").innerHTML = "Protein: " + dailyIntake.protein + " g";
    updateCap();
}






function updateCap(){
    document.querySelector(".cap_calo").textContent  = dailyIntake.calo;
    document.querySelector(".cap_protein").textContent  = dailyIntake.protein;
    document.querySelector(".cap_fat").textContent   =  dailyIntake.fat;
    document.querySelector(".cap_vitamin").textContent   =  dailyIntake.vitamin; 
    document.querySelector(".cap_sodium").textContent   =  dailyIntake.sodium; 
}

//dss

var alert_box = document.querySelector("#alert_nutri");	

function alertCheck(){

    var near_notice  = []
    var exceed_notice=  []
    var nutrition = ["protein","fat","sodium","vitamin"];
    nutrition.forEach(function(x,i){
        var day_nutri = parseFloat(document.querySelector(".plan_day"+" #"+ x).textContent); 
        var cap_nutri =  parseFloat(document.querySelector(".cap_"+x ).textContent);  
        if( day_nutri >= 0.75*cap_nutri){
            if(day_nutri <= cap_nutri ){
                near_notice.push(x);  
            }
            else{exceed_notice.push(x);}
        }
    }); 

    
  
    

    
    deleteAll(alert_box);



    var da_calo = parseFloat(document.querySelector(".plan_day #calo").textContent); 
    var cap_calo =  parseFloat(document.querySelector(".cap_calo").textContent); 
    
    if(da_calo >= 0.75* cap_calo){
        var warn = document.createElement("div");  // don't do document.createElement("p")  or [ document.createTextNode("p") -> not work  alert_box.childNodes[0].style. ]
        if(da_calo <= cap_calo){
            warn.textContent = "Calories is nearly exceed"; 
            warn.style.color =  "#e68a00"; 
            alert_box.appendChild(warn);
        }
        else {
            warn.textContent  = "Calories is exceeding Cap";
            warn.style.color = "#ff4d4d"; 
            //alert_box.appendChild(document.createTextNode("Calories is exceeding Cap"));
            alert_box.appendChild(warn);
        }
        alert_box.childNodes[0].style.fontSize= "19px";
    
               

    }    


  

    near_notice.forEach(function(x,i){
       
        var div = document.createElement("div"); 
        var xu = x.split(""); 
        xu[0] = xu[0].toUpperCase();
        var xu1 = xu.toString();
        var xu2 = xu1.replace(/[, ]+/g,"");
        

        div.innerHTML = xu2+" is nearly exceed"; 
     
        div.style.color = "#e68a00";
        
     
        alert_box.appendChild(div);
    }); 
    
    exceed_notice.forEach(function(x,i){
        var div = document.createElement("div"); 
        var xu = x.split(""); 
        xu[0] = xu[0].toUpperCase();
        var xu1 = xu.toString();
        var xu2 = xu1.replace(/[, ]+/g,"");



        div.innerHTML = xu2+" is exceeding Cap"; 
        div.style.color = "#ff4d4d"; 
        // not worked var t = document.createTextNode(x+" is  exceeding Cap "); 
       
        alert_box.appendChild(div);
        //   alert_box.appendChild(t);
    }); 
  
}







//--LUKE NORRIS' CODE ENDS HERE

// add event listeners to calendar
function addCalendarEventListener(){
    // attach event listener for all days on calendar
    $(".prev").on('click', previousMonth);
    $(".next").on('click', nextMonth);
    $("#calendarContent tr td button").on("click", onDayClick);
    $("#calendarContent tr td button").on("mouseover", onDayHover);
    $("#calendarContent tr td button").on("mouseout", onDayOut);
}


function onDayClick(){
    var date = new MyDay();
    // get the date
    date.day = parseInt(this.innerHTML);
    date.month = date.monthNameToNumber(document.querySelector("#month").innerHTML);
    date.year = parseInt(document.querySelector("#year").innerHTML);
    var unique_key = date.getDate();
    currPlannedDay = unique_key;

    // set outline for selected day
    $("#calendarContent tr td button").css({"outline":"2px solid transparent"});
    this.style.outlineColor = "red";
    
    triggerNewDay(unique_key)
    alertCheck();

    // change the label of the date in plan
    $("#planDate").text(date.getDate());

    // save the clicked element to variable
    currSelectedDay = this;
    
}

// highlight day when hover
function onDayHover(){
    if(this.style.outlineColor != "red")
        this.style.outlineColor = "blue";
}

// remove highlight when out
function onDayOut(){
    if(this.style.outlineColor != "red")
        this.style.outlineColor = "transparent";
}


//
// ***************************End Nguyen Hoa's code *******************
//

/// tab change; 
var tab_schedule = document.querySelector("#tab_schedule"); 
var tab_article = document.querySelector("#tab_article"); 
var page_art  = document.querySelector("#page_article"); 
var page_sche  =  document.querySelector("#page_schedule"); 
page_art.style.visibility = "hidden"; 
tab_article.addEventListener("click",function(){
     console.log("hee");
     console.log(current_tab);
     var food_item =   document.querySelector(".center_food "+"#"+current_tab+"_item");  

     page_sche.style.visibility = "hidden"; 
     food_item.style.visibility = "hidden"; 
     page_art.style.visibility  ="visible"; 
});
tab_schedule.addEventListener("click",function(){
    console.log("hee");
    var food_item =   document.querySelector(".center_food "+"#"+current_tab+"_item");  
    console.log(current_tab);
    page_sche.style.visibility = "visible"; 
    food_item.style.visibility = "visible"; 
   //$(".center_food .food_item").css({"visibility":"visible"}); 
    page_art.style.visibility = "hidden"; 

  
});


//// change amongs article tab 
var click_healthy1  =document.querySelector("#click_healthy1"); 
var click_healthy2  =document.querySelector("#click_healthy2");
var healthy1_div =document.querySelector("#healthy1");
var healthy2_div =document.querySelector("#healthy2");

click_healthy1.addEventListener("click",function(){
    healthy1_div.style.display ="block";
    healthy2_div.style.display ="none";
}); 

click_healthy2.addEventListener("click",function(){
    healthy1_div.style.display ="none";
    healthy2_div.style.display ="block";
}); 











/*
function to_list(ev){
/*
function put_to_list(selector){
 
  
  var box_item= document.createElement("div"); 
  box_item.classList.add("item_box");
  var sti_img = document.createElement("IMG"); 
  var sti_name = document.createTextNode("");
  var chi = food.firstElementChild ;
  var chi_name =  chi.nextElementSibling; 
  sti_name.textContent =chi_name.innerHTML 
  console.log("name ",chi_name.innerHTML);
  sti_img.src =chi.src; 
  sti_img.style.height = "180px";
  sti_img.style.width ="300px";
  box_item.append(sti_img,sti_name);    
  /* console.log(food.firstElementChild.id);
  console.log(chi.nextElementSibling.id) ;
  sti_img.src = food[0];    
   selector.append(box_item); 
}  
*/


/*
function see_list(ev){ 
    var collection = document.querySelector("#popup_collection #collection");
    var outer_collection = document.querySelector("#popup_collection");
   deleteAll(collection);
    if(store_list.indexOf(ev.id) >= 0){    
        var ind = store_list.indexOf(ev.id)  ;
        var items_list = store_item[ind]; 
        for(var i=0; i<items_list.length;i++){ 
            put_to_list(collection,items_list[i] );
        }
    }
    var food_item = document.querySelector(".food_item");
    outer_collection.style.width  =  (food_item.offsetWidth*0.90).toString()+"px";
 
    outer_collection.style.visibility ="visible";
    outer_collection.classList.add("show");
  
   
}   */









/* 
 1.show
 2. no show 
 
 1.no show
 2.show -- no have show()
*/

/*
$("#px").toggle(function(){
    console.log("sdsd");
    a.classList.add("show");
    a.textContent = "hellow" //overwrite
    
    console.log(a.classList.length);
}
);       */

/*
console.log(pop_content.firstElementChild.id);
var co  = pop_content.firstElementChild; 
var co1 = co.nextElementSibling;
console.log(co1.id);
var pa = document.querySelector(".meat_item").children;
console.log(pa[0].id);
console.log(pa[1].id); 
child = pop_content.children.length // give 1, is pic 
 pop_content.childNodes.length // is 2, such  pic, content
 var first  =pop_content.firstChild // work
    var s = first.nextSibling;
    console.log(s.id);
var first  =pop_content.firstElementChild // not work
    var s = first.nextElementSibling;
    console.log(s.id);
*/