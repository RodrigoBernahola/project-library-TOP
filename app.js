//<----------------------------------------------------->
//Sección de código para manejar el array, añadir libro y el constructor de libros

const myLibrary = [];


function Book(title, author, pages, read) {

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function() {

        let stringRead = 'not readed yet';
        if (read) stringRead = 'already readed';

        let string = `${this.title} by ${this.author}, ${this.pages} pages, ${stringRead}`

        return string

    }

}


function addBookToLibrary(title, author, pages, read) {

    //Tomar los argumentos recibidos y luego crear un nuevo libro con new utilizando el constructor, luego añadir el nuevo libro.
    let newBook = new Book(title, author, pages, read);

    let uuid = self.crypto.randomUUID();
    newBook.id = uuid;

    myLibrary.push(newBook);

}


function displayBook(book) {

    let nuevaFila = document.createElement('tr');

    for (const propiedad in book) {

        if (propiedad !== 'info' && propiedad !== 'id') {

            let nuevaCelda = document.createElement('td');
            nuevaCelda.innerText = book[propiedad];
            if (propiedad === 'read') {

                if (book[propiedad]) {
                    nuevaCelda.innerText = 'Si';
                }
                else{
                    nuevaCelda.innerText = 'No';
                }
            }

            nuevaFila.appendChild(nuevaCelda);
        }
        
    }


    //Agrego los botones que se piden en los últimos pasos

    let celdaEliminar = document.createElement('td');
    let celdaMarcar = document.createElement('td');

    let botonEliminar = document.createElement('button');
    let botonMarcarLeido = document.createElement('button');

    botonEliminar.innerText = 'Eliminar libro';
    botonMarcarLeido.innerText = 'Cambiar estado leído';

    celdaEliminar.appendChild(botonEliminar);
    celdaMarcar.appendChild(botonMarcarLeido);

    nuevaFila.appendChild(celdaEliminar);
    nuevaFila.appendChild(celdaMarcar);

    //Asocio un atributo data-id con el id correspondiente que tenga este objeto

    nuevaFila.setAttribute('data-id', book.id);

    //Para el paso 5 asociar a cada botón una clase para luego usar un event listener

    botonEliminar.setAttribute('class', 'botonEliminarLibro');
    botonMarcarLeido.setAttribute('class', 'botonMarcarLeido');

    let bodyDeLaTabla = document.querySelector('.cuerpoDeTabla');
    bodyDeLaTabla.appendChild(nuevaFila);

}


function displayLibrary(myLibrary) {

    myLibrary.forEach(displayBook);

}

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295, false);
addBookToLibrary('Game of Thrones', 'George R.R. Martin', 700, false);


//<----------------------------------------------------->
//Sección de código para manejar el botón y el formulario 


//Definición de objetos que representan a los nodos del DOM
const botonAgregarLibro = document.querySelector('.botonAgregarLibro')
const botonCancelar = document.querySelector('.botonCancelar');
const botonAceptar = document.querySelector('.botonAceptar');
const dialog = document.querySelector('dialog');
const botonMostrar = document.querySelector('.botonMostrarLibros');
const formulario = document.querySelector('dialog form');


function clearDisplay() {

    let cuerpoDeTabla = document.querySelector('.cuerpoDeTabla');

    let filas = document.querySelectorAll('tbody tr');

    let lenghtFilas = filas.length;

    if (filas.length > 0) {

        for (let i = 0; i < lenghtFilas; i++) {

            cuerpoDeTabla.removeChild(filas[i]);

        }

    }


}



// 3. Mejora la función de extracción de datos con trim():
function extraerDatosForm() {

    let title = document.querySelector('#title').value.trim();
    let autor = document.querySelector('#author').value.trim();
    let pages = parseInt(document.querySelector('#pages').value);
    let readValue = document.querySelector('input[type=radio]:checked');
    
    // Validación adicional
    if (!title || !autor || isNaN(pages)) {
        throw new Error("Datos del formulario incompletos");
    }
    
    let read = readValue && readValue.value === 'Si';
    
    return {
        title,
        autor,
        pages,
        read
    };
}


//Manejadores de eventos


botonAgregarLibro.addEventListener('click', () => {dialog.showModal()});


botonCancelar.addEventListener('click', () => {dialog.close()});


formulario.addEventListener('submit', (e) => {

    e.preventDefault(); // Prevenir el envío automático
    
    // Verificar la validez del formulario
    if (formulario.checkValidity()) {
        // Solo si el formulario es válido, procesa los datos
        let dataForm = extraerDatosForm();
                
        addBookToLibrary(dataForm.title, dataForm.autor, dataForm.pages, dataForm.read);
        
        // Limpia el formulario y cierra el diálogo
        formulario.reset();
        dialog.close();
        clearDisplay()
        displayLibrary(myLibrary);
    } else {
        // Mostrar errores de validación
        formulario.reportValidity();
    }

});


// 3. Modifica el evento del botón aceptar para que simplemente envíe el formulario
botonAceptar.addEventListener('click', (e) => {

    e.preventDefault();

    // Disparar el evento submit del formulario

    const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
    });
    formulario.dispatchEvent(submitEvent);

});


botonMostrar.addEventListener('click', () => {

    clearDisplay()
    displayLibrary(myLibrary);

});


//Sección para manejar la eliminación y cambio de estado de libros


const table = document.querySelector('table');


function eliminarLibroDelArray(id) {

    let indexAEliminar = myLibrary.findIndex( (elem) => {elem.id === id});
    myLibrary.splice(indexAEliminar, 1);

}
 

function eliminarLibro (e) {

    //Accedo a td y luego a tr con estas propiedades
    let filaAEliminar = e.target.parentNode.parentNode;
    let idAEliminar = filaAEliminar.getAttribute('data-id');

    eliminarLibroDelArray(idAEliminar);

    document.querySelector('.cuerpoDeTabla').removeChild(filaAEliminar);

}


function cambiarEstadoLectura(id) {

    let libroACambiar = myLibrary.find( (elem) => elem.id === id);
    libroACambiar.read = !libroACambiar.read;
    return libroACambiar;

}


function cambiarEstadoLeido(e) {

    let filaACambiar = e.target.parentNode.parentNode;
    let idACambiar = filaACambiar.getAttribute('data-id');

    document.querySelector('.cuerpoDeTabla').removeChild(filaACambiar);
    displayBook(cambiarEstadoLectura(idACambiar));

}


table.addEventListener('click', (e) => {

    //Se verifica que lo que se presiona es uno de los botones dentro de la fila de cada libro

    if (e.target.nodeName === 'BUTTON') {

        if (e.target.classList.value === 'botonEliminarLibro') {

            eliminarLibro(e);

        }
        else if (e.target.classList.value === 'botonMarcarLeido') {

            cambiarEstadoLeido(e);

        }

    }

})

