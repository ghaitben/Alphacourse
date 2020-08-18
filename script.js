// search value is deleted once the search field looses focus
const searchBar = document.getElementById('INPUT_1');

searchBar.addEventListener('blur', function(){

  searchBar.value = "";

});

//the menu on phone is not left open
const checkbox = document.getElementById('check');

window.addEventListener('resize',function(){

  if(window.matchMedia('(min-width: 1100px)').matches && checkbox.checked)
  {
    checkbox.checked = false;

  }
},true);



//dynamic naviguation bar ,showing and hiding based on sroll direction
const navBar = document.getElementsByClassName('secondary')[0];

window.onscroll = function(){

  var pos = window.pageYOffset;

  if(pos > 160 && window.innerWidth > 1100)
  {


    navBar.style.top = "0px";
  }
  if(pos < 160 && window.innerWidth > 1100)
  {
    //navBar.style.display = "none";
    navBar.style.top = "-160px";

  }
};

  //var pos = window.pageYOffset;

  //if (pos > prePos)
  //{
  //  console.log("you are scrolling down");
  //}

  //else
  //{
  // console.log("you are scrolling up");
  //}

  //prePos = pos;


//};
