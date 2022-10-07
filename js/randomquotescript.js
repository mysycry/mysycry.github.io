// VARIABLES

let btn = document.querySelector('#new-quote');
let quote = document.querySelector('.quote');
let person = document.querySelector('.person');

const quotes = [{
    quote: "I've been imitated so well I've heard people copy my mistakes.",
    person: "Jimi Hendrix"
}, {
    quote: "When you reach the end of your rope, tie a knot in it and hang on.",
    person: "Franklin D. Roosevelt"
}, {
    quote: "Always remember that you are absolutely unique. Just like everyone else.",
    person: "Margaret Mead"
}, {
    quote: "Don't judge each day by the harvest you reap but by the seeds that you plant.",
    person: "Robert Louis Stevenson"
}, {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    person: "Eleanor Roosevelt"
}, {
    quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    person: "Benjamin Franklin"
}, {
    quote: "Walking with a friend in the dark is better than walking alone in the light.",
    person: "Helen Keller"
}, {
    quote: "It is during our darkest moments that we must focus to see the light.",
    person: "Aristotle"
}, {
    quote: "Whoever is happy will make others happy too.",
    person: "Anne Frank"
}, {
    quote: "I'm starting to see players copy what I do. I'm flattered.",
    person: "Dennis Rodman"
}, ];

btn.addEventListener('click', function() {

    let random = Math.floor(Math.random() * quotes.length);

    quote.innerText = quotes[random].quote;
    person.innerText = quotes[random].person;
})