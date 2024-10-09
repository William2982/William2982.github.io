/* MENU NAVBAR HAMBURGER */
const body = document.body;
const hamburger = document.querySelector('.hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('#nav-menu li a');
hamburger.addEventListener('click', function () {
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
    body.classList.toggle('menu-open');
});
// Cerrar el menú al seleccionar una opción del menú
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        body.classList.remove('menu-open');
    });
});
// Cerrar el menú cuando se haga clic fuera del menú
document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');
        }
    }
});
// Ocultar y mostrar menu al hacer scroll
let lastScrollTop = 0;
const nav = document.querySelector('header');
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const widthWindow = window.innerWidth;
    if (scrollTop > lastScrollTop) {
        nav.style.top = (widthWindow > 1400) ? '-140px' : '-100px';
    } else {
        nav.style.top = '0';
    }
    lastScrollTop = scrollTop;
}
window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);
document.getElementById('btn-login').addEventListener('click', () => {
    location.href = 'dashboard.html';
});

/* FOOTER */
const year = new Date().getFullYear();
document.querySelector('footer p').innerHTML = `&copy; ${year} William Sosa. Todos los derechos reservados.`;

/* CARRUSEL */
function initCarousel(containerSelector, itemSelector, nextSelector, prevSelector) {
    let currentSlide = 0;
    let itemsToShow;
    let totalSlides;
    let slideInterval;
    const carousel = document.querySelector(containerSelector);
    const items = document.querySelectorAll(itemSelector);
    const next = document.querySelector(nextSelector);
    const prev = document.querySelector(prevSelector);
    function updateItemsToShow() {
        const widthWindow = window.innerWidth;
        itemsToShow = (widthWindow > 1400) ? 3 : 1;
        totalSlides = Math.ceil(items.length / itemsToShow);
        items.forEach(item => {
            item.style.width = `${100 / itemsToShow}%`;
        });
        currentSlide = 0;
        carousel.style.transform = `translateX(0)`;
        const showButtons = items.length > itemsToShow;
        next.style.display = showButtons ? 'block' : 'none';
        prev.style.display = showButtons ? 'block' : 'none';
    }
    function moveSlide(direction) {
        return function () {
            currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            resetAutoSlide();
        };
    }
    function autoSlide() {
        slideInterval = setInterval(() => {
            moveSlide(1)();
        }, 10000);
    }
    function resetAutoSlide() {
        clearInterval(slideInterval);
        autoSlide();
    }
    autoSlide();
    updateItemsToShow();
    let previousWidth = window.innerWidth;
    window.addEventListener('resize', function () {
        let currentWidth = window.innerWidth;
        if (currentWidth !== previousWidth) {
            updateItemsToShow();
            previousWidth = currentWidth;
        }
    });
    next.addEventListener('click', moveSlide(1));
    prev.addEventListener('click', moveSlide(-1));
}

/* FIREBASE */
// Leer datos - impactos
function readImpactos() {
    const carousel = document.querySelector('#impactos .carousel');
    db.collection("impactos").onSnapshot((querySnapshot) => {
        carousel.innerHTML = '';
        if (querySnapshot.empty) {
            carousel.innerHTML += `
            <div class="container-empty">
                <b>NO HAY RESULTADOS</b>
            </div> `;
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                carousel.innerHTML += `
                <div class="carousel-item">
                    <div class="carousel-text">
                        <h3>${data.titulo}</h3>
                        <p>${data.texto}</p>
                    </div>
                </div>
                `;
            });
            // Iniciar carrusel
            initCarousel('#impactos .carousel', '#impactos .carousel-item', '#impactos .next', '#impactos .prev');
        }
    });
}
readImpactos();
// Leer datos - hechos
function readHechos() {
    const carousel = document.querySelector('#hechos .carousel');
    db.collection("hechos").onSnapshot((querySnapshot) => {
        carousel.innerHTML = '';
        if (querySnapshot.empty) {
            carousel.innerHTML += `
            <div class="container-empty">
                <b>NO HAY RESULTADOS</b>
            </div> `;
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                carousel.innerHTML += `
                <div class="carousel-item">
                    <div class="carousel-text">
                        <h3>${data.titulo}</h3>
                        <p>${data.texto}</p>
                    </div>
                </div>
                `;
            });
            // Iniciar carrusel
            initCarousel('#hechos .carousel', '#hechos .carousel-item', '#hechos .next', '#hechos .prev');
        }
    });
}
readHechos();
// Leer datos - fotos hero
function readFotosHero() {
    const carousel = document.querySelector('#fotos-hero .carousel');
    db.collection("fotos-hero").onSnapshot((querySnapshot) => {
        carousel.innerHTML = '';
        if (querySnapshot.empty) {
            carousel.innerHTML += `
            <div class="container-empty">
                <b>NO HAY RESULTADOS</b>
            </div> `;
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                carousel.innerHTML += `
                <div class="carousel-item">
                    <img data-file="${data.foto}" src="" alt=" ">
                </div>
                `;
            });
            // storage
            const ref = storage.ref('fotos-hero');
            ref.listAll().then((result) => {
                result.items.forEach((imageRef) => {
                    imageRef.getDownloadURL().then((url) => {
                        const imgElements = document.querySelectorAll(`#fotos-hero .carousel img[data-file="${imageRef.name}"]`);
                        imgElements.forEach((img) => {
                            img.src = url;
                        });
                    }).catch((error) => {
                        // console.error('Error al obtener la URL de la imagen:', error);
                    });
                });
            }).catch((error) => {
                // console.error('Error al listar las imágenes:', error);
            });
            // Iniciar carrusel
            initCarousel('#fotos-hero .carousel', '#fotos-hero .carousel-item', '#fotos-hero .next', '#fotos-hero .prev');
        }
    });
}
readFotosHero();
// Leer datos - fotos batallas
function readFotosBatallas() {
    const carousel = document.querySelector('#fotos-batallas .carousel');
    db.collection("fotos-batallas").onSnapshot((querySnapshot) => {
        carousel.innerHTML = '';
        if (querySnapshot.empty) {
            carousel.innerHTML += `
            <div class="container-empty">
                <b>NO HAY RESULTADOS</b>
            </div> `;
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                carousel.innerHTML += `
                <div class="carousel-item">
                    <div class="carousel-image">
                        <img data-file="${data.foto}" src="" alt=" ">
                    </div>
                    <div class="carousel-text">
                        <h3>${data.titulo}</h3>
                        <p>${data.texto}</p>
                    </div>
                </div>
                `;
            });
            // storage
            const ref = storage.ref('fotos-batallas');
            ref.listAll().then((result) => {
                result.items.forEach((imageRef) => {
                    imageRef.getDownloadURL().then((url) => {
                        const imgElements = document.querySelectorAll(`#fotos-batallas .carousel img[data-file="${imageRef.name}"]`);
                        imgElements.forEach((img) => {
                            img.src = url;
                        });
                    }).catch((error) => {
                        // console.error('Error al obtener la URL de la imagen:', error);
                    });
                });
            }).catch((error) => {
                // console.error('Error al listar las imágenes:', error);
            });
            // Iniciar carrusel
            initCarousel('#fotos-batallas .carousel', '#fotos-batallas .carousel-item', '#fotos-batallas .next', '#fotos-batallas .prev');
        }
    });
}
readFotosBatallas();