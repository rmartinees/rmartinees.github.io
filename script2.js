
let cart = [];

function generateGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    categorias.forEach((categoria, categoryIdx) => {

        // Create section element
        const section = document.createElement('section');
        section.className = 'gallery-section';

        // Create section title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = categoria.titulo;
        section.appendChild(title);

        // Create gallery grid
        const grid = document.createElement('div');
        grid.className = 'gallery-grid';

        // Add pieces to the grid
        categoria.piezas.forEach((pieza, pieceIdx) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = 'images/' + pieza.archivo;
            img.alt = pieza.nombre;


            img.onclick = function () {
                openModal(this, categoryIdx, pieceIdx);
            };



            const info = document.createElement('div');
            info.className = 'item-info';

            const itemTitle = document.createElement('div');
            itemTitle.className = 'item-title';
            itemTitle.textContent = pieza.nombre;

            const spanRef = document.createElement('div');
            spanRef.className = 'item-details';
            spanRef.textContent = `Ref: [${pieza.ref}]`;

            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';
            itemDetails.textContent = `${pieza.material} · ${pieza.dimensiones}`;

            const itemRefPrec = document.createElement('div');
            itemRefPrec.className = 'item-details';
            itemRefPrec.textContent = `PVP: ${pieza.precio}`;

            const addToCartBtn = document.createElement('button');
            addToCartBtn.textContent = 'Añadir al carrito';
            addToCartBtn.className = 'btn-add-cart';
            addToCartBtn.addEventListener('click', () => addToCart(pieza));

            info.appendChild(itemTitle);
            info.appendChild(spanRef);
            info.appendChild(itemDetails);
            info.appendChild(itemRefPrec);
            info.appendChild(addToCartBtn);
            item.appendChild(img);
            item.appendChild(info);
            grid.appendChild(item);
        });

        section.appendChild(grid);
        galleryContainer.appendChild(section);
    });
}
function addToCart(pieza) {
    cart.push(pieza);
    document.getElementById("cart-count").textContent = cart.length;
    renderCart();
}

// Renderizar carrito
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre}: ${item.dimensiones}  [${item.ref}] · ${item.precio} IVA incluido`;

        // Botón eliminar
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.className = "remove-btn";
        removeBtn.addEventListener("click", () => {
            cart.splice(index, 1);
            document.getElementById("cart-count").textContent = cart.length;
            renderCart();
        });

        li.appendChild(removeBtn);
        cartItems.appendChild(li);
    });
     document.getElementById("send-order").classList.toggle("hidden", cart.length === 0)
}

// Toggle del carrito
document.getElementById("cart-icon").addEventListener("click", () => {
    document.getElementById("cart-dropdown").classList.toggle("hidden");
});

// Abrir modal al enviar pedido
document.getElementById("send-order").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    document.getElementById("order-modal").classList.remove("hidden");
});

// Cancelar pedido
document.getElementById("cancel-order").addEventListener("click", () => {
    document.getElementById("order-modal").classList.add("hidden");
});

// Confirmar pedido y enviar correo con EmailJS
document.getElementById("confirm-order").addEventListener("click", () => {
    const email = document.getElementById("customer-email").value;
    const phone = document.getElementById("customer-phone").value;

    if (!email || !phone) {
        alert("Por favor introduce email y teléfono");
        return;
    }

    // Preparar datos del pedido
    const orderDetails = cart.map(p =>  `${p.nombre}: ${p.dimensiones}  [${p.ref}] · ${p.precio} IVA incluido`).join("\n");

    emailjs.send("service_mahnj3e", "template_ml4dyhm", { 
        customer_email: email,
        customer_phone: phone,
        order_list: orderDetails
    }, "BM8sGVN3ZLbU0mobG").then(() => {
        alert("Pedido enviado correctamente ✅");
        cart = [];
        document.getElementById("cart-count").textContent = 0;
        renderCart();
        document.getElementById("order-modal").classList.add("hidden");
    }).catch(err => {
        console.error("Error:", err);
        alert("Hubo un error al enviar el pedido ❌");
    });
});


// Call the function to generate the gallery when the page loads
window.onload = generateGallery;

// Modal functionality
var modal = document.getElementById("myModal");
var modalImg = document.getElementById("modal-img");

// Modal functionality with arrow navigation
let currentCategoryIndex = 0;
let currentPieceIndex = 0;
let modalOpen = false;

function openModal(imgElement, categoryIdx, pieceIdx) {
    currentCategoryIndex = categoryIdx;
    currentPieceIndex = pieceIdx;
    modalOpen = true;

    modal.style.display = "block";
    modalImg.src = imgElement.src;
    modalImg.alt = imgElement.alt;
    document.body.style.overflow = "hidden"; // Prevent page scrolling

    if ('ontouchstart' in window) {
        showModalArrows(); // Always show arrows on touch devices
    }
}

function closeModal() {
    modalOpen = false;
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable page scrolling
}

function navigateModal(direction) {
    if (!modalOpen) return;

    const currentCategory = categorias[currentCategoryIndex];
    let newPieceIndex = currentPieceIndex + direction;
    if (window.navigator.vibrate) {
        window.navigator.vibrate(10);
    }

    // Check if we need to move to next/previous category
    if (newPieceIndex >= currentCategory.piezas.length) {
        if (currentCategoryIndex < categorias.length - 1) {
            currentCategoryIndex++;
            newPieceIndex = 0;
        } else {
            newPieceIndex = currentPieceIndex; // Stay on last image
        }
    } else if (newPieceIndex < 0) {
        if (currentCategoryIndex > 0) {
            currentCategoryIndex--;
            newPieceIndex = categorias[currentCategoryIndex].piezas.length - 1;
        } else {
            newPieceIndex = 0; // Stay on first image
        }
    }

    // Update current index
    currentPieceIndex = newPieceIndex;

    // Update modal image
    const newPiece = categorias[currentCategoryIndex].piezas[currentPieceIndex];
    modalImg.src = 'images/' + newPiece.archivo;
    modalImg.alt = newPiece.nombre;
}


// Keyboard event listener
document.addEventListener('keydown', function (event) {
    if (modalOpen) {
        if (event.key === "Escape") {
            closeModal();
        } else if (event.key === "ArrowLeft") {
            navigateModal(-1);
            event.preventDefault(); // Prevent page scrolling
        } else if (event.key === "ArrowRight") {
            navigateModal(1);
            event.preventDefault(); // Prevent page scrolling
        }
    }
});

// Update modal close handlers
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
};

// Add this to your existing modal functions
function showModalArrows() {
    document.querySelectorAll('.nav-arrow').forEach(arrow => {
        arrow.style.display = 'block';
    });
}

function hideModalArrows() {
    document.querySelectorAll('.nav-arrow').forEach(arrow => {
        arrow.style.display = 'none';
    });
}

// Update your openModal function
function openModal(imgElement, categoryIdx, pieceIdx) {
    currentCategoryIndex = categoryIdx;
    currentPieceIndex = pieceIdx;
    modalOpen = true;

    modal.style.display = "block";
    modalImg.src = imgElement.src;
    modalImg.alt = imgElement.alt;
    document.body.style.overflow = "hidden";
    showModalArrows(); // Show arrows when modal opens
}

// Update closeModal
function closeModal() {
    modalOpen = false;
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    hideModalArrows(); // Hide arrows when modal closes
}

// Add touch event support for mobile
modal.addEventListener('touchstart', function () {
    showModalArrows();
    setTimeout(hideModalArrows, 2000); // Hide after 2 seconds
});



// Add these variables at the top with your other modal variables
let touchStartX = 0;
let touchEndX = 0;

// Add these event listeners after your keyboard listener
modal.addEventListener('touchstart', handleTouchStart, { passive: true });
modal.addEventListener('touchend', handleTouchEnd, { passive: true });

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance in pixels

    if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left (next image)
        navigateModal(1);
    } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right (previous image)
        navigateModal(-1);
    }
}