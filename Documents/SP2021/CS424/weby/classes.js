

class Meal {
    constructor(){
        this.foodList = [];
        this.calo = 0;
        this.items= 0; 
    }

    addFood(item_id){
        this.foodList.push(item_id); 
    }
    getFood(index){
        return this.foodList[index];
    }
    getCalories(){
        var total =0;
        for(var i=0; i< this.foodList.length; i++ ){
             var food_id =  this.foodList[i]; 
             total +=   parseFloat(document.querySelector("#"+food_id+" "+"#"+"calo").textContent); 
             
        }
        this.calo = total; 
        return this.calo ;
    }  
    getItems(){
        this.items =  this.foodList.length ;
        return this.items;
    }
     
   
}


class Days{ 
    constructor(days){
        this.key = days ;   // "month-day"
        this.breakfast  = new Meal(); 
        this.lunch = new Meal()
        this.dinner = new Meal(); 
        this.sum_protein = 0; 
        this.sum_fat = 0; 
        this.sum_sodium = 0;
        this.sum_vitamin =0; 
        this.sum_calo = 0;
        this.sum_item= 0;

    }
  

    
}

// to easy save and retrieve the date
class MyDay {
    constructor(){
        this.month = 1;
        this.day = 1;
        this.year = 2021;
        this.months = ["january","february","march","april","may","june","july",
                "august","september","october","november","december"];
    }

    // translate month's name to number
    monthNameToNumber(monthName){
        
        // return the index of the month in month list
        return this.months.indexOf(monthName.toLowerCase()) + 1;
    }

    // translate the number to month name
    numberToMonthName(number){
        return this.months[number - 1];
    }


    // get the string of format "month-day-year"
    getDate(){
        return this.month.toString() + "-" + this.day.toString() + "-" + this.year.toString(); 
    }
}


// user information class
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

// daily intake calculator
class DailyIntake{
    constructor(){
        this.protein = 0; 
        this.fat = 0; 
        this.sodium = 0;
        this.vitamin =0; 
        this.calo = 0;
    }

    // calculate all nutrients
    calculate(userInfo){
        this.calo = this.calculateCalo(userInfo);
        this.fat = this.calculateFat(userInfo);
        this.protein = this.calculateProtein(userInfo);
        this.sodium = this.calculateSodium(userInfo);
        this.vitamin = this.calculateVitamin(userInfo);
    }

    // calculate protein intake limit
    calculateProtein(userInfo){
        return Math.round(0.36 * userInfo.weight);
    }

    // calculate fat intake limit
    calculateFat(userInfo){
        return Math.round(0.25 * this.calculateCalo(userInfo));
    }
    // calculate sodium intake limit
    calculateSodium(userInfo){
        var rate = 0;
        if(userInfo.age > 15){
            rate = 1.0;
        }
        else{
            rate = 1 - (15 - userInfo.age)/15.0;
        }

        return Math.round(rate);
    }

    // calculate calries intake limit
    // Adult male: 66 + (6.3 x body weight in lbs.) + (12.9 x height in inches) - (6.8 x age in years) = BMR
    // Adult female: 655 + (4.3 x weight in lbs.) + (4.7 x height in inches) - (4.7 x age in years) = BMR
    // If you are sedentary (little or no exercise) : Calorie-Calculation = BMR x 1.2
    // If you are lightly active (light exercise/sports 1-3 days/week) : Calorie-Calculation = BMR x 1.375
    // If you are moderately active (moderate exercise/sports 3-5 days/week) : Calorie-Calculation = BMR x 1.55
    // If you are very active (hard exercise/sports 6-7 days a week) : Calorie-Calculation = BMR x 1.725
    // If you are extra active (very hard exercise/sports & physical job or 2x training) : Calorie-Calculation = BMR x 1.9
    calculateCalo(userInfo){
        var bmr = 66 + (6.3 * userInfo.weight) + (12.9 * userInfo.height) - (6.8 * userInfo.age);
        var fitnessVal = {
            "none" : 1.2,
            "light" : 1.375,
            "moderate" : 1.55,
            "hard" : 1.725,
            "very hard" : 1.99
        };
        var rate = fitnessVal[userInfo.fitnessGoal];

        if(rate == null)
            rate = 1.2;
        return Math.round(bmr * rate); 
    }

    // daily vitamin B complex intake
    calculateVitamin(userInfo){
        // male: 550, female: 450
        // set vitamin intake equal 550 by default
        return 550;
    }
}