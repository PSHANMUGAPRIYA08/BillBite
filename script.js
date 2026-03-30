let menu = [
    { name: "Idly", price: 30, img: "images/idly.jpg" },
    { name: "Dosa", price: 50, img: "images/dosa.jpg" },
    { name: "Poori", price: 40, img: "images/poori.jpg" },
    { name: "Vada", price: 20, img: "images/vada.jpg" },
    { name: "Coffee", price: 25, img: "images/coffee.jpg" }
];

let cart = {};

// LOAD
document.addEventListener("DOMContentLoaded", function () {
    let role = localStorage.getItem("role");
    if (role === "admin") {
        document.getElementById("adminPanel").style.display = "block";
    }
    loadMenu();
});

// MENU
function loadMenu() {
    let menuDiv = document.getElementById("menu");
    menuDiv.innerHTML = "";

    menu.forEach((item, index) => {
        menuDiv.innerHTML += `
        <div class="card">
            <img src="${item.img}">
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>
            <button onclick="addToCart(${index})">Add</button>
        </div>`;
    });
}

// SEARCH
function searchItem() {
    let value = document.getElementById("search").value.toLowerCase();
    let cards = document.querySelectorAll(".card");
    let found = false;

    cards.forEach(card => {
        if (card.innerText.toLowerCase().includes(value)) {
            card.style.display = "block";
            found = true;
        } else {
            card.style.display = "none";
        }
    });

    document.getElementById("notFound").style.display = found ? "none" : "block";
}

// CART
function addToCart(index) {
    let item = menu[index];

    if (cart[item.name]) cart[item.name].qty++;
    else cart[item.name] = { price: item.price, qty: 1 };

    updateCart();
}

function updateCart() {
    let cartTable = document.getElementById("cart");
    cartTable.innerHTML = "";
    let total = 0;

    for (let item in cart) {
        total += cart[item].price * cart[item].qty;

        cartTable.innerHTML += `
        <tr>
            <td>${item}</td>
            <td>${cart[item].qty}</td>
            <td>₹${cart[item].price * cart[item].qty}</td>
            <td><button onclick="removeItem('${item}')">X</button></td>
        </tr>`;
    }

    document.getElementById("total").innerText = total;
}

function removeItem(name) {
    delete cart[name];
    updateCart();
}

function clearCart() {
    cart = {};
    updateCart();
}

// PAYMENT + QR
function payNow() {
    let total = document.getElementById("total").innerText;

    if (total == 0) {
        alert("Cart empty!");
        return;
    }

    let upi = "yourupi@upi"; // change

    let upiLink = `upi://pay?pa=${upi}&pn=SmartServe&am=${total}&cu=INR`;

    let qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

    document.getElementById("qrImage").src = qr;
    document.getElementById("qrSection").style.display = "block";
}

// PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let y = 10;
    doc.text("Restaurant Bill", 10, y);
    y += 10;

    for (let item in cart) {
        let line = `${item} x ${cart[item].qty} = Rs ${cart[item].price * cart[item].qty}`;
        doc.text(line, 10, y);
        y += 10;
    }

    doc.text("Total: Rs " + document.getElementById("total").innerText, 10, y + 10);
    doc.save("bill.pdf");
}

// USERS
function countUsers() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    alert("Total Users: " + users.length);
}

// LOGOUT
function logout() {
    localStorage.removeItem("role");
    window.location.href = "login.html";
}