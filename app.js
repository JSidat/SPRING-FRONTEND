'use strict'

let id;
const modalBg = document.querySelector('.modal-bg');
const modalClose = document.querySelector('.modal-close');
const output = document.getElementById('output');

function getBooks() {
    axios.get('http://localhost:8080/getBooks')
    .then(res => {
        output.innerHTML = "";
        const books = res.data;

        books.forEach(book => {
            const newBook = renderBooks(book);
            console.log("New Book: " + newBook);
            output.prepend(newBook); 
        });
    }).catch(err => console.error(err))
}

function renderBooks(book) {
    const newBook = document.createElement("div");
    newBook.className = "card";
    
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.innerHTML = book.title;
    newBook.appendChild(cardHeader);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    newBook.appendChild(cardBody);

    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.innerText = "By: " + book.author + "(" + book.genre + ")";
    cardBody.appendChild(cardText); 

    const editButton = document.createElement("button")
    editButton.className = "btn btn-primary";
    editButton.innerText = "Edit";
    editButton.addEventListener('click', function() {
        id = book.id;
        modalBg.classList.add('bg-active');
        if (book.title != 'null') {
            document.getElementById('modal-title').value = book.title
        };
        if (book.author != '') {
            document.getElementById('modal-author').value = book.author
        };
        if (book.genre != '') {
            document.getElementById('modal-genre').value = book.genre
        };
    })
    cardBody.appendChild(editButton);

    
    modalClose.addEventListener('click', function() {
        modalBg.classList.remove('bg-active');
    })

    const deleteButton = document.createElement("button")
    deleteButton.className = "btn btn-danger";
    deleteButton.style = "background-color: #f1491a";
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', function() {
        deleteBook(book.id);
        showAlert('Book Deleted', 'danger');
    });
    cardBody.appendChild(deleteButton);  

    return newBook;
}

function deleteBook(id) {
    axios.delete('http://localhost:8080/removeBook/' + id)
    .then(() => getBooks())
    .catch(err => console.error(err));
}

    document.getElementById("modal-form").addEventListener('submit', function(event) {
        event.preventDefault();

         if(this.title.value === '' || this.author.value === '' || this.genre.value === '') {
        showAlert('Please fill in fields', 'danger');
    } else {
        showAlert('Success!','success');

        const data = {

            title: this.title.value,
            author: this.author.value,
            genre: this.genre.value
        };

        axios.put('http://localhost:8080/updateBook/' + id, data)
        .then(() => {
        this.reset();
        modalBg.classList.remove('bg-active');
        this.title.focus();
        getBooks();
        })      
    
    .catch(err => console.error(err));
    }
});


document.getElementById("bookForm").addEventListener('submit', function(event) {
    event.preventDefault();

    if(this.title.value === '' || this.author.value === '' || this.genre.value === '') {
        showAlert('Please fill in fields', 'danger');
    } else {
        showAlert('Success!','success');

    const data = {
        title: this.title.value,
        author: this.author.value,
        genre: this.genre.value
    };

    axios.post('http://localhost:8080/createBook', data)
    .then(() => {
        this.reset();
        this.title.focus();
        getBooks();
    })
    .catch(err => console.error(err));
    }
})

function showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    
    const container = document.querySelector('.main-container');
    const header = document.querySelector('.header');
    container.insertBefore(div, header);

    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

getBooks();