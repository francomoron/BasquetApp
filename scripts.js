const bar = document.getElementById("bar");
const menu =document.getElementById("menu");
const cross = document.getElementById("cross");

bar.addEventListener("click", function(e){
    menu.classList.toggle("active")
});

cross.addEventListener("click", function(e){
    menu.classList.toggle("active")
})