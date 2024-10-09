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
document.getElementById('btn-logout').addEventListener('click', () => {
    location.href = '/';
});

/* FOOTER */
const year = new Date().getFullYear();
document.querySelector('footer p').innerHTML = `&copy; ${year} William Sosa. Todos los derechos reservados.`;

/* MODALES */
// Cerrar modales con click fuera
const modales = document.querySelectorAll("dialog");
modales.forEach(element => {
    element.addEventListener('click', (e) => {
        const rect = element.getBoundingClientRect();
        const isInDialog = (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom);
        if (!isInDialog) {
            element.close();
        }
    });
});

/* FIREBASE */
function inicio(idTabla, coleccion) {
    // Datatables
    const tabla = $(idTabla).DataTable({
        "lengthMenu": [[3, 5, 10, 50, -1], [3, 5, 10, 50, "Todos"]],
        language: {
            loadingRecords: "Cargando...",
            emptyTable: "No hay datos añadidos aún",
            zeroRecords: "No se encontraron resultados",
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ entradas",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior",
            },
        },
        rowId: 'id'
    });
    // LEER DATOS
    db.collection(coleccion).onSnapshot((querySnapshot) => {
        tabla.clear();
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tabla.row.add([
                data.titulo,
                data.texto,
                `<button class="edit" data-id="${doc.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor"
                            d="m2.292 13.36l4.523 4.756L.5 20zM12.705 2.412l4.522 4.755L7.266 17.64l-4.523-4.754zM16.142.348l2.976 3.129c.807.848.086 1.613.086 1.613l-1.521 1.6l-4.524-4.757L14.68.334l.02-.019c.119-.112.776-.668 1.443.033" />
                    </svg>
                </button>`,
                `<button class="delete" data-id="${doc.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g fill="none" fill-rule="evenodd">
                            <path
                                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zM9 10a1 1 0 0 0-.993.883L8 11v6a1 1 0 0 0 1.993.117L10 17v-6a1 1 0 0 0-1-1m6 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1m-.72-6H9.72l-.333 1h5.226z" />
                        </g>
                    </svg>
                </button>`
            ]).draw(false);
        });
    });

}
inicio('#tabla-impactos', 'impactos');
inicio('#tabla-hechos', 'hechos');

// AÑADIR DATOS
// Abrir modal
const modalAdd = document.getElementById('modal-add');
document.getElementById('btn-open-modal-add').addEventListener('click', () => {
    modalAdd.showModal();
});
// Enviar formulario
document.getElementById('form-add').addEventListener('submit', function (e) {
    e.preventDefault();
    const coleccionAdd = document.getElementById('coleccion-add').value;
    const titulo = document.getElementById('titulo-add').value;
    const texto = document.getElementById('texto-add').value;

    db.collection(coleccionAdd).doc().set({
        titulo: titulo,
        texto: texto
    }).then(() => {
        // console.log('Documento añadido');
        document.getElementById('modal-add').close();
        document.getElementById('form-add').reset();
    }).catch((error) => {
        // console.error('Error al añadir el documento a Firestore:', error);
    });
});
// Cerrar modal
document.getElementById('btn-cerrar-modal-add').addEventListener('click', () => {
    modalAdd.close();
});