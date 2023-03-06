// loaded to be handled by bundler
import './main.css';

// factory functions

// create dom elements
function createContainer() {
    const container = document.createElement('div');
    container.setAttribute('id', 'container');
    // created an object (createContainer) and assigned container as a property
    return { container };
}

function createNote() {
    const name = 'Alex';
    const description = 'First Note';

    const note = document.createElement('div');
    note.classList.add('note');

    return { note, name, description }
}

// buttons
function createNoteButton() {
    const noteButton = document.createElement('button');
    noteButton.setAttribute('id', 'noteButton');
    return noteButton;
    noteButton.addEventListener('click', renderNote);
}


function renderNote() {
    console.log('Note Rendered');
}


function createSideMenu() {
    const sideMenu = document.createElement('div');
    sideMenu.setAttribute('id', 'sideMenu');
    return sideMenu;
}



// render dom elements
function renderLayout() {
    // destructured assignment, assigns container varaiable to property returned from object, names must match
    const { container } = createContainer();
    const sideMenu = createSideMenu();
    const { note, name, description } = createNote();

    container.appendChild(sideMenu);
    container.appendChild(note);

    trackNotes(note);

    document.body.appendChild(container);
}

renderLayout();



// track notes
function trackNotes(note) {
    const notes = [];
    notes.push(note);
}

























// application functionality
function addNoteDetails() {

}

function removeToDoItems() {

}

function createNewList() {

}

function removeExistingList() {

}


function scheduleNote() {

}


// core functionality
function saveLocally() {

}



/*

Reminder:
- S.O.L.I.D Principles

Rules:
1. Use Objects : Factories or Classes/Constructors
2. Note Properties : Title, Description, Due Date, Priority
3. Ability to Create Seperate Projects : Default Project, Create Custom Project
4. Separate Application Logic : Modular
5. App Functionalty : View All Projects, View All Notes (Title & Description Only), Change Color of Background to Establish Priority, Edit Note, Delete Note
6. npm i date-fns
7. Use Web Storage API to Save Projects & Notes to Local Storage 
*/



