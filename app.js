console.log("pepe");


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

const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);

//console.log(theHobbit.info());


console.log(Object.getPrototypeOf(theHobbit));

console.log(Book);
console.log(Book.prototype);