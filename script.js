const searchBar = document.getElementById('INPUT_1');

searchBar.addEventListener('blur', function(){

  searchBar.value = "";

});

const checkbox = document.getElementById('check');

window.addEventListener('resize',function(){

  if(window.matchMedia('(min-width: 1100px)').matches && checkbox.checked)
  {
    checkbox.checked = false;

  }
},true);
