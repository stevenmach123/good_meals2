
var b =0;
var b_c = {
    a:10

}
function incre(){
    //b_c.a +=1;
    b+=2;
    return b;
}
function by_change(){
    console.log("by_change");
}
function by_keydown(){
    console.log("by_keydown");
}


function myf(){
    document.getElementById('demo').innerHTML = incre();
    console.log(b);
};
var demoo = document.getElementById("demo");
var ai = document.getElementById("ai");
console.log("hello");
ai.addEventListener('change',function(){

var my_op = this.options[this.selectedIndex];
var handle = my_op.getAttribute("uy");
var handle_val = my_op.value; 
demoo.innerHTML  = handle+" and "+handle_val;
});

var cebox = document.querySelector("#cebox");
cebox.style.border = "3px solid green";
document.querySelector(".c").style.fontSize = "20px";


var sub_box = document.createElement('div');
var sub_text = document.createElement('p');

sub_box.className = "small_box"; 
sub_text.className = "small_text";
sub_text.appendChild(document.createTextNode("hello me"));
sub_box.appendChild(document.createTextNode("hello friend"));

cebox.append(sub_text,sub_box);

var iubox =document.getElementsByName("iubox")[0];
iubox.style.border ="1px solid red";
var cebox_cop = cebox
iubox.append(cebox_cop);



$(".small_box").wrapAll("<div class='cibox' />");
$(".small_text").wrapAll("<div class='cibox' />");


var big_items = document.getElementById("big_items");
var iselect = -1;
function being_click(){
  console.log("ass ");
  
}
function sellItems(links,names,prices,mydiv){
    for(let i=0;i<links.length;i++ ){
        var item = document.createElement("div");
        var but = document.createElement("button");
        var my_h =  document.createElement("h4");
        var my_p  = document.createElement("h4"); 
        var t_img = document.createElement("IMG");
        
        item.classList.add("itembox");
        but.append(document.createTextNode("Add to Cart")  );
        //but.setAttribute("onclick","being_click()");
        but.onclick = function(){
            console.log(names[i]);
            
        }
        my_h.textContent  += names[i];
        my_p.textContent  += "$"+prices[i];
        t_img.src =  links[i];
        t_img.width ="100";
        t_img.height ="100";

        item.append(t_img,but,my_h,my_p);
        mydiv.appendChild(item);
    }
   
}

function addItem(link,name,price,my_div){
    var item = document.createElement("div");
    var my_h =  document.createElement("p");
    var t_img = document.createElement("IMG");
    var box_adjust = document.createElement("div");
    var my_p  = document.createElement("h4"); 

    item.classList.add("itembox");   
    item.style.width = "200px";
    my_h.textContent += name;
    t_img.src =  link; 
    t_img.width ="100";
    t_img.height ="100";
    my_p.textContent  += "$"+price;

    var inc = document.createElement("div");
    var dec = document.createElement("div");
    var amount_box = document.createElement("div");
    box_adjust.classList.add("adjust_amount");
    amount_box.classList.add("adjust_text");
    amount_box.classList.add("adjust_text2");

    inc.append(document.createTextNode("+"));
    dec.append(document.createTextNode("-"));
    amount_box.append(document.createTextNode("0"));

    inc.id =name+"-"+"inc";
    dec.id =name+"-"+"dec";
    inc_id = "#"+inc.id;
    dec_id ="#"+dec.id;
    

    box_adjust.append(dec,amount_box,inc) ;
    item.append(t_img,name,my_p,box_adjust)
    my_div.append(item);

    $(inc_id).hover(function(){
        $(this).css({"background-color":"pink","color":"white"});
    });

    $(dec_id).hover(function(){
         $(this).css({"background-color":"pink","color":"white"});
    });
    $(inc_id).mouseout(function(){
        $(this).css({"background-color":"transparent","color":"black"});
    });

    $(dec_id).mouseout(function(){
         $(this).css({"background-color":"transparent","color":"black"});
    });
}


tlink = ["images/summer1.jpeg","images/summer2.jpeg","images/summer3.jpeg"];
tname =  ["summer1","summer2","summer3"];
tprice = ["3.4","4,5","2.5"];
sellItems(tlink,tname,tprice,big_items);
var test_box = document.getElementById("test_big_items")
addItem(tlink[0],tname[0],tprice[0],test_box);

$("#yi").hover(function(){
    this.classList.add("adjust_text");
    }
);

//$(".c").wrapAll("<div style='border:1px solid yellow'/>");

