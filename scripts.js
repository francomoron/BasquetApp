// Variables
const bar = document.getElementById("bar");
const menu =document.getElementById("menu");
const cross = document.getElementById("cross");
const arrow = document.getElementById("arrow");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
const cards = document.getElementById("cards");
let carrito = {};
const items = document.getElementById("items");
const templateCarrito = document.getElementById("template-carrito").content;
const footer = document.getElementById("footer");
const templateFooter = document.getElementById("template-footer").content;


// Eventos
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarrito();
    }
});

bar.addEventListener("click", function(e){
    menu.classList.toggle("active")
});

cross.addEventListener("click", function(e){
    menu.classList.toggle("active")
})

cards.addEventListener("click", function(e){
    addCarrito(e);
})

items.addEventListener("click", (e) =>{
    btnAccion(e);
})

// Funciones
const fetchData = async () => {
    try{
        const res = await fetch("api.json");
        const data = await res.json();
        pintarCard(data);
    }
    catch(error){
        console.log(error);
    }
}

const pintarCard = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector("img").setAttribute("alt", producto.title);
        templateCard.querySelector("img").setAttribute("width", "150px");
        templateCard.querySelector("img").setAttribute("height", "150px");
        templateCard.querySelector(".btn_comprar").dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}

const addCarrito = (e) =>{
    if(e.target.classList.contains("btn_comprar")){
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
}

const setCarrito = (objeto) =>{
    const producto = {
        id : objeto.querySelector(".btn_comprar").dataset.id,
        title : objeto.querySelector("h5").textContent,
        precio : objeto.querySelector("p").textContent,
        cantidad : 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    carrito[producto.id] = {...producto};
    pintarCarrito();
}

const pintarCarrito = () => {
    items.innerHTML = "";
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelectorAll("p")[0].textContent = producto.id;
        templateCarrito.querySelectorAll("p")[1].textContent = producto.title;
        templateCarrito.querySelectorAll("p")[2].textContent = producto.cantidad;
        templateCarrito.querySelectorAll("p")[3].textContent = producto.precio * producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);
    pintarFooter();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const pintarFooter = () =>{
    footer.innerHTML = "";
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        Carrito vacío - comience a comprar!`
        return;
    }
    const nCantidad = Object.values(carrito).reduce( (acc, {cantidad} ) => acc + cantidad,0);
    const nPrecio = Object.values(carrito).reduce( (acc, {cantidad,precio} ) => acc + cantidad * precio,0 );
    templateFooter.querySelectorAll("p")[1].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    const btnVaciar = document.getElementById("vaciar-carrito");
    btnVaciar.addEventListener("click", () =>{
        carrito = {};
        pintarCarrito();
    })
}

const btnAccion = (e) =>{
    if(e.target.classList.contains("btn-info")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad ++;
        carrito[e.target.dataset.id] = {...producto};
        pintarCarrito();
    }
    if(e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }
    e.stopPropagation();
}