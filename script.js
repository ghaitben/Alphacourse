  // clear the searchbar when it's not in focus
const search_bar = document.getElementById("search");
search_bar.addEventListener('blur',function(){
  search_bar.value = "";
});

//dynamic search bar + scroll when focus + scroll when clicking on the arrow



real_data = ["Computer science","Python","Linear algebra"]

search_bar.addEventListener('keyup' , e => {
  var search_value = search_bar.value;
  var new_data = searchData(search_value,real_data);
  buildData(new_data);
});


function searchData(value,data){

  var array = [];

  for(var i = 0; i < data.length ; i++)
  {
    value = value.toLowerCase();
    var subject = data[i].toLowerCase();

    if(subject.includes(value))
    {
      array.push(data[i]);
    }
  }
  return array;
}


function buildData(array){

  element = document.getElementById('main');
  element.innerHTML = "<h2 class = 'text'>FREQUENTLY VISITED SUBJECTS ON ALPHACOURSE</h2> <p class='text_under'>Look up the subject you like by typing it down in the search bar above. Don't forget to sign up to be able to post online courses to enrich the AlphaCourse community !</p>";
  for(var i = 0; i < array.length;i++)
  {
    element.innerHTML += `<div>
                              ${array[i]}
                          </div>`;

  }

}

//scroll when keyup
const target = document.querySelector('.grid_container');

search_bar.addEventListener("focus", function scrollToTarget() {
  target.scrollIntoView({behavior:"smooth"});

});

//scroll when clicking on the arrows
const arrow = document.querySelector(".container");
arrow.addEventListener("click", e => {
  target.scrollIntoView({behavior:"smooth"});
});


// javascript for slider

const slides = document.querySelectorAll('.slide');
const buttons = document.querySelectorAll('.buttons');
const auto = true;
const intervalTime = 5000;
let slideInterval;
let index = 0;

buttons[0].style.backgroundColor = "#ffff1a";

const nextSlide = () => {

  //GET the current slide
  const current = document.querySelector('.current');

  //check where is the current slide right now and color the appropriate bar in yellow

  for(var i = 0; i < slides.length; i++)
  {
    if(slides[i] === current)
    {
      index = i;
    }
  }

  //remove the class from current
  current.classList.remove("current");
  //check if there is any next slide
  if(current.nextElementSibling)
  {
    current.nextElementSibling.classList.add('current')
  }
  else
  {
      slides[0].classList.add('current')
  }

  buttons.forEach(element => {
    element.style.backgroundColor = "lightgrey";
  });

  buttons[(index+1)%3].style.backgroundColor = "#ffff1a";



  setTimeout(() => current.classList.remove('current'));
};

// change slides when clicking on the bars
function barClick(idx){

  buttons[idx].addEventListener('click',e => {
    const current = document.querySelector('.current');

    current.classList.remove('current');

    slides[idx].classList.add('current');

    buttons.forEach(element => {
      element.style.backgroundColor = "lightgrey";
    });

    buttons[idx].style.backgroundColor = "#ffff1a";

    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);

  });
}

barClick(0);
barClick(1);
barClick(2);

if(auto)
{
  slideInterval = setInterval(nextSlide,intervalTime);
}
//javascript for bouncing arrows
$("#arrow").click(function() {
    doBounce($(this), 3, '10px', 200);
});
function doBounce(element, times, distance, speed) {
    for(var i = 0; i < times; i++) {
        element.animate({marginTop: '-='+distance}, speed)
            .animate({marginTop: '+='+distance}, speed);
    }
}
//end of bouncing arrows javascript


//javascript for login dropdown
const login = document.querySelector("#item3");
const pages = document.querySelectorAll('.appearing_page');
const overlay = document.querySelector('.overlay');
const signup = document.querySelector('#item4');


login.addEventListener('click', e =>
{
  window.scrollTo({
    top:0,
    left:0,
    behavior:"smooth"
  });

  pages[0].classList.add('appear');
  overlay.style.display = "block";
});
//javascript for sign up dropdown


signup.addEventListener('click', e =>
{
  window.scrollTo({
    top:0,
    left:0,
    behavior:"smooth"
  });
  pages[1].classList.add('appear');
  overlay.style.display = "block";

});



//function to disable the overlay when clicking on it

function overlay_off(){
  overlay.style.display = "none";
  pages.forEach(element => {
    element.classList.remove('appear');
  });
  
}
