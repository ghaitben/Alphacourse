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
//javascirpt code for the slider
const slides = document.querySelectorAll('.slide');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev');
const auto = true;
const timeInterval = 4000;
let slideInterval;
const items = document.querySelectorAll('.items');
const buttons  = document.querySelectorAll('.slideButton');
let index = 0;
items[0].style.backgroundColor = "#ffcc66";

const nextSlide = () => {

  const current = document.querySelector('.current');

  for(let i = 0 ; i < slides.length ; i++)
  {
    if(current === slides[i])
    {
      index = i;
    }
  }


  current.classList.remove('current');

  if(current.nextElementSibling)
  {
    current.nextElementSibling.classList.add('current');

  }
  else
  {
    slides[0].classList.add('current');
  }
  items.forEach(element => {
    element.style.backgroundColor = "#ccc";
  });
  items[(index+1)%3].style.backgroundColor = "#ffcc66";
  setTimeout(() => current.classList.remove('current'));

}




buttons[0].addEventListener('click', e => {

  // turn all buttons to grey
  items.forEach(element => {

    element.style.backgroundColor = "#ccc";
  });

  //color the right btutton in #ffcc66

  items[0].style.backgroundColor = "#ffcc66";

  //slide movement

  const current = document.querySelector('.current');

  current.classList.remove('current');

  slides[0].classList.add('current');
  if(auto)
  {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide , timeInterval);
  }

});



buttons[1].addEventListener('click', e => {

  // turn all buttons to grey
  items.forEach(element => {

    element.style.backgroundColor = "#ccc";
  });

  //color the right btutton in #ffcc66

  items[1].style.backgroundColor = "#ffcc66";

  //slide movement

  const current = document.querySelector('.current');

  current.classList.remove('current');

  slides[1].classList.add('current');

  if(auto)
  {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide , timeInterval);

  }

});




buttons[2].addEventListener('click', e => {

  // turn all buttons to grey
  items.forEach(element => {

    element.style.backgroundColor = "#ccc";
  });

  //color the right btutton in #ffcc66

  items[2].style.backgroundColor = "#ffcc66";

  //slide movement

  const current = document.querySelector('.current');

  current.classList.remove('current');

  slides[2].classList.add('current');
  if(auto)
  {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide , timeInterval);

  }

});

if(auto)
{
  slideInterval = setInterval(nextSlide , timeInterval);
}
