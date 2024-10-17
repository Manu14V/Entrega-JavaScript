async function cargarImagenes() {
    try {
        const response = await fetch('./json/imagenes.json');

        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON. Estado: ' + response.status);
        }

        const imagenes = await response.json();
        const productosList = document.getElementById('productos-list');
        productosList.innerHTML = '';

        imagenes.forEach(function (imagen) {
            let productoHTML = `
                <div class="col d-flex justify-content-center mb-4">
                    <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
                        <h5 class="card-title pt-2 text-center text-primary">${imagen.titulo}</h5>
                        <img class="card-img-top" src="${imagen.url}" alt="${imagen.titulo}">
                        <div class="card-body">
                            <p class="card-text text-white-50 description">Batería: ${imagen.bateria}<br>Almacenamiento: ${imagen.almacenamiento}</p>
                            <h5 class="text-primary">Precio: <span class="precio">$${imagen.precio}</span></h5>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary button">Añadir al Carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productosList.innerHTML += productoHTML;
        });
    } catch (error) {
        console.error("Error al cargar las imágenes:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarImagenes);

const tbody = document.querySelector('.tbody');
let carrito = [];

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('button')) {
        addToCarritoItem(e);
    }
});

function addToCarritoItem(e) {
    const button = e.target;
    const item = button.closest('.card');
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;

    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1
    };

    addItemCarrito(newItem);
}

function addItemCarrito(newItem) {
    const alert = document.querySelector('.alert');

    setTimeout(() => {
        alert.classList.add('hide');
    }, 2000);
    alert.classList.remove('hide');

    const InputElemnto = tbody.getElementsByClassName('input__elemento');
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === newItem.title.trim()) {
            carrito[i].cantidad++;
            const inputValue = InputElemnto[i];
            inputValue.value++;
            CarritoTotal();
            return;
        }
    }

    carrito.push(newItem);
    renderCarrito();
}

function renderCarrito() {
    tbody.innerHTML = '';
    carrito.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('ItemCarrito');
        const Content = `
            <th scope="row">1</th>
            <td class="table__productos">
              <img src="${item.img}" alt="">
              <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value="${item.cantidad}" class="input__elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
        `;
        tr.innerHTML = Content;
        tbody.append(tr);

        tr.querySelector(".delete").addEventListener('click', removeItemCarrito);
        tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad);
    });
    CarritoTotal();
}

function CarritoTotal() {
    let Total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal');
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("$", ''));
        Total += precio * item.cantidad;
    });

    itemCartTotal.innerHTML = `Total $${Total}`;
    addLocalStorage();
}

function removeItemCarrito(e) {
    const buttonDelete = e.target;
    const tr = buttonDelete.closest(".ItemCarrito");
    const title = tr.querySelector('.title').textContent;
    carrito = carrito.filter(item => item.title.trim() !== title.trim());

    const alert = document.querySelector('.remove');

    setTimeout(() => {
        alert.classList.add('remove');
    }, 2000);
    alert.classList.remove('remove');

    tr.remove();
    CarritoTotal();
}

function sumaCantidad(e) {
    const sumaInput = e.target;
    const tr = sumaInput.closest(".ItemCarrito");
    const title = tr.querySelector('.title').textContent;
    carrito.forEach(item => {
        if (item.title.trim() === title) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            CarritoTotal();
        }
    });
}

function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        renderCarrito();
    }
};