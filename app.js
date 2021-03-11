'use strict'
const output = document.getElementById('output');

function getBooks() {
    axios.get('http://localhost:8080/getBooks')
    .then(res => {
        output.innerHTML = "";
        const books = res.data;

        books.forEach(book => {
            const newBook = renderBooks(book);
            console.log("New Book: " + newBook);
            output.appendChild(newBook); 
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

    const editButton = document.createElement("a")
    editButton.className = "btn btn-primary";
    editButton.innerText = "Edit";
    cardBody.appendChild(editButton);

    const deleteButton = document.createElement("button")
    deleteButton.className = "btn btn-danger";
    deleteButton.style = "background-color: #f1491a";
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', function() {
        deleteBook(book.id);
    });
    cardBody.appendChild(deleteButton);  

    return newBook;
}

function deleteBook(id) {
    axios.delete('http://localhost:8080/deleteBook/' + id)
    .then(() => getBooks())
    .catch(err => console.error(err));
}

document.getElementById("bookForm").addEventListener('submit', function(event) {
    event.preventDefault();

    const data = {
        title: this.title.value,
        author: this.author.value,
        genre: this.genre.value
    };

    axios.post('http://localhost:8080/createBook', data)
    .then(() => {
        this.reset();
        this.name.focus();
        getBooks();
    })
    .catch(err => console.error(err));
})

getBooks();