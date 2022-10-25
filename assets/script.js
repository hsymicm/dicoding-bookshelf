const shelfs = document.querySelectorAll('#shelf');
let books = JSON.parse(localStorage.getItem('books'));

const filterBooks = (arr, bool) => {
    if (!arr) return 0;
    const data = [];
    arr.forEach((o) => {
        if (o.isComplete === bool) data.push(o);
    })
    return data.length === 0 ? 0 : data;
}

const handleShow = (element, bool) => {
    if (bool) { if (element.classList.contains('invisible')) element.classList.remove('invisible'); }
    else { if (!element.classList.contains('invisible')) element.classList.add('invisible'); }
}

const enableAddBookCard = (bool) => {
    handleShow(document.querySelector('#add-card'), bool);
    handleShow(document.querySelector('#new-book'), !bool);
}

const makeBook = (obj, isComplete) => {
    const title = document.createElement('h3');
    title.innerText = obj.title;

    const author = document.createElement('p');
    author.innerText = 'Author: ' + obj.author;

    const year = document.createElement('p');
    year.innerText = 'Year: ' + obj.year;

    const buttonFinish = document.createElement('button');
    buttonFinish.innerText = 'Finish';
    buttonFinish.className = 'btn btn-primary'
    buttonFinish.id = 'btn-finish';
    buttonFinish.addEventListener('click', (event) => {
        const id = event.target.parentNode.parentNode.id;
        updateBook(id.split('-')[1], true);
    })

    const buttonEdit = document.createElement('img');
    buttonEdit.setAttribute('width', '24px');
    buttonEdit.setAttribute('src', './assets/img/edit-border.svg');
    buttonEdit.id = 'btn-edit';
    buttonEdit.style.float = 'right';
    buttonEdit.addEventListener('click', (event) => {
        const { title, author, year, isComplete } = getAllInput('edit');
        const modal = document.getElementById('edit-dialog');
        const confirm = document.getElementById('edit-confirm');
        const cancel = document.getElementById('edit-cancel');
        const close = document.getElementById('close-edit-dialog');
        const id = event.target.parentNode.parentNode.id;
        
        modal.style.display = 'block';
        const hide = () => {
            modal.style.display = 'none';
        }
        confirm.addEventListener('click', () => {
            editBook(id.split('-')[1], {
                title : title.value,
                author : author.value,
                year : year.value,
            });
            resetAllInput('edit');
            hide();
        })

        cancel.addEventListener('click', () => {
            hide();
        })

        close.addEventListener('click', () => {
            hide();
        })

        window.addEventListener('click', (e) => {
            if(e.target == modal) hide();
        })
    })


    const buttonDelete = document.createElement('button');
    buttonDelete.innerText = 'Delete';
    buttonDelete.className = 'btn btn-secondary'
    buttonDelete.style.marginLeft = '12px';
    buttonDelete.id = 'btn-delete';
    buttonDelete.addEventListener('click', (event) => {
        const modal = document.getElementById('delete-dialog');
        const text = document.getElementById('delete-text');
        const confirm = document.getElementById('delete-confirm');
        const cancel = document.getElementById('delete-cancel');
        const close = document.getElementById('close-delete-dialog');
        const id = event.target.parentNode.parentNode.id;

        modal.style.display = 'block';
        text.innerHTML = `Are you sure you want to delete <b>${obj.title}</b>?`;

        const hide = () => {
            modal.style.display = 'none';
        }
        confirm.addEventListener('click', () => {
            deleteBook(id.split('-')[1]);
            hide();
        })

        cancel.addEventListener('click', () => {
            hide();
        })

        close.addEventListener('click', () => {
            hide();
        })

        window.addEventListener('click', (e) => {
            if(e.target == modal) hide();
        })
    })

    const buttonUndo = document.createElement('button');
    buttonUndo.innerText = 'Undo';
    buttonUndo.className = 'btn btn-primary'
    buttonUndo.id = 'btn-undo'
    buttonUndo.addEventListener('click', (event) => {
        const id = event.target.parentNode.parentNode.id;
        updateBook(id.split('-')[1], false);
    })

    const div = document.createElement('div');
    div.classList.add('info-book');
    div.append(buttonEdit, title, author, year);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-book');
    buttonDiv.append(isComplete ? buttonUndo : buttonFinish, buttonDelete);

    const container = document.createElement('div');
    container.classList.add('card-book');
    container.append(div, buttonDiv);
    container.setAttribute('id', `book-${obj.id}`);

    return container;
}

const updateShelf = (obj = books) => {
    if (obj) {
        const finishedReadingDiv = document.getElementById('data-finished-reading');
        finishedReadingDiv.innerHTML = '';

        const readingDiv = document.getElementById('data-reading');
        readingDiv.innerHTML = '';

        obj.forEach((book) => {
            const status = book.isComplete;
            const bookElement = makeBook(book, status);

            if (status) finishedReadingDiv.append(bookElement);
            else readingDiv.append(bookElement);
        })
    }

    const finishedReading = filterBooks(obj, true);
    const reading = filterBooks(obj, false);
    handleShow(shelfs[1], finishedReading ? true : false);
    handleShow(shelfs[0], reading ? true : false);
    handleShow(document.querySelector('.empty-shelf'), !finishedReading && !reading ? true : false);
}

const handleStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.getItem(key);
}

const searchBook = (search, arr) => {
    const result = arr.filter(item => { 
        const title = item.title.toLowerCase().split(' ').join('')
        const sr = search.toLowerCase().split(' ').join('')
        return title.includes(sr); 
    });
    updateShelf(result);
}

const addBook = (obj) => {
    if (books) {
        books.push(obj);
    } else {
        const arr = [obj];
        books = arr;
    }
    updateShelf();
    handleStorage('books', books);
}

const updateBook = (id, isComplete) => {
    books.forEach((book) => {
        if (book.id === id) book.isComplete = isComplete;
    })
    updateShelf();
    handleStorage('books', books);
}

const editBook = (id, obj) => {
    books.forEach((value, index) => {
        if(value.id === id) {
            books[index].title = obj.title;
            books[index].author = obj.author;
            books[index].year = obj.year;
        }
    })
    updateShelf();
    handleStorage('books', books);
    
}

const deleteBook = (id) => {
    books.forEach((book, index) => {
        if (book.id === id) books.splice(index, 1);
    })
    updateShelf();
    handleStorage('books', books);
}

const getAllInput = (type) => {
    const title = document.getElementById(`${type}-book-title`);
    const author = document.getElementById(`${type}-book-author`);
    const year = document.getElementById(`${type}-book-year`);
    const isComplete = document.getElementById(`${type}-book-finished`);
    return { title, author, year, isComplete };
}

const resetAllInput = (type) => {
    const { title, author, year, isComplete } = getAllInput(type);
    title.value = '';
    author.value = '';
    year.value = '';
    if(type === 'input') isComplete.checked = false;
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('add-btn')) {
                enableAddBookCard(true);
            }
            if (target.id === 'input-book-submit') {
                const { title, author, year, isComplete } = getAllInput('input');
                if (!title.value || !author.value || !year.value) { alert('Form must be filled out!'); return; }
                const obj = {
                    id: (new Date().getTime() / 1000).toFixed(0),
                    title: title.value,
                    author: author.value,
                    year: year.value,
                    isComplete: isComplete.checked,
                }
                addBook(obj);
                resetAllInput('input');
                enableAddBookCard(false);
            }
            if (target.id === 'input-book-cancel') {
                enableAddBookCard(false);
            }
            if (target.id === 'btn-search') {
                let search = document.getElementById('input-book-search');
                search = search.value;
                searchBook(search, books);
            }
        })
    })
})

updateShelf();