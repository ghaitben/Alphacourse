// clear the searchbar when it's not in focus
const search_bar = document.getElementById("search");
search_bar.addEventListener('blur',function(){
  search_bar.value = "";
});

//dynamic search bar

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
  element.innerHTML = "";
  for(var i = 0; i < array.length;i++)
  {
    element.innerHTML += `<div>
                              ${array[i]}
                          </div>`;

  }

}
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



//
