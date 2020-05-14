
//VARIABLES
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const isbnInput = document.querySelector('#isbn');
const bookList = document.querySelector('#book-list');
const bookForm = document.querySelector('#book-form');
const submitBtn = document.querySelector('#add-book');
const table = document.querySelector('.table');

//CLASSES
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book){
        const row = document.createElement('tr');

        //Create table items
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td style="width: 9%;"></td>`

        //Create Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.style.paddingTop = '0.4rem';
        deleteButton.classList.add('delete-btn', 'btn', 'btn-danger');
        deleteButton.tabIndex = '-1';

        row.lastChild.appendChild(deleteButton);

        //Add row to table
        bookList.append(row);
    }

    deleteBookFromList(target){
        if(target.classList.contains('delete-btn')){
            target.parentElement.parentElement.classList.add('removed-book');
            setTimeout(function(){target.parentElement.parentElement.remove();}, 500);
        }
    }

    showAlert(message, alertType, before, timeout){
        const alert = document.createElement('div');
        
        alert.setAttribute('role', 'alert')
        alert.innerText = message;
        alert.classList.add('alert', alertType);

        document.querySelector('#card-content').insertBefore(alert, before);

        setTimeout(function(){alert.remove();}, timeout);
    }

    clearFields(){
        titleInput.value = '';
        authorInput.value = '';
        isbnInput.value = '';
    }
}

class Store{
    static getBooks(){
        let books;

        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBooks(isbn){
        const books = Store.getBooks();
        
        //Check if the isbn of each book in ls is the same as isbn of removed book and remove from ls
        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//EVENT LISTENERS
document.addEventListener('DOMContentLoaded', Store.displayBooks());
bookForm.addEventListener('submit', createBook);
bookList.addEventListener('click', deleteBook);

//FUNCTIONS

//Add Book to List
function createBook(e){

    //Get Values from form
    const title = titleInput.value;
    const author = authorInput.value;
    const isbn = isbnInput.value;

    //Instatiate  book
    const book = new Book(title, author, isbn);

    //Instantiate UI 
    const ui = new UI();

    //Add to Local Storage
    Store.addBook(book);

    //Validate book
    const inputs = [titleInput, authorInput, isbnInput];
    let valid = true;

    //Check if all inputs have been filled
    inputs.forEach(function(input){
        if(input.value === ''){
            input.classList.add('is-invalid');
            valid = false;
        }
        else{
            input.classList.remove('is-invalid'); 
            valid = true;
        }
    });

    //If all inputs are valid add book to list
    if(valid === true){
        ui.addBookToList(book);
        ui.showAlert('Book added to list', 'alert-success', table, 3000);
        ui.clearFields();
        
        //Remove Warning if requirements are met
        if(document.querySelector('.alert-danger') !== null)
        {
            document.querySelector('.alert-danger').remove();
        }
    }
    else{
        if(document.querySelector('.alert-danger') === null)
        {
            ui.showAlert('Please fill in all input fields', 'alert-danger', bookForm, 10000);
        }
    }

    e.preventDefault();
}

//Delete Book from List
function deleteBook(e)
{
    const target = e.target;

    //Instantiate UI 
    const ui = new UI();

    ui.deleteBookFromList(target);

    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
}