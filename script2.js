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

            const itemDetails = document.createElement('div');
            itemDetails.className = 'item-details';
            itemDetails.textContent = `${pieza.material} · ${pieza.dimensiones}`;

            info.appendChild(itemTitle);
            info.appendChild(itemDetails);
            item.appendChild(img);
            item.appendChild(info);
            grid.appendChild(item);
        });

        section.appendChild(grid);
        galleryContainer.appendChild(section);
    });
}

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
modal.addEventListener('touchstart', function() {
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