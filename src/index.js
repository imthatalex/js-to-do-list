// loaded to be handled by bundler
import './main.css';

// factory functions

// create components
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

function createSideMenu() {
    const sideMenu = document.createElement('div');
    sideMenu.setAttribute('id', 'sideMenu');
    return sideMenu;
}

// buttons
function createNoteButton() {
    const noteButton = document.createElement('button');
    noteButton.setAttribute('id', 'noteButton');
    noteButton.textContent = 'Add Note';
    return noteButton;
}


// renders components
(function renderComponents() {
    const { container } = createContainer();
    const sideMenu = createSideMenu();
    const noteButton = createNoteButton();

    noteButton.addEventListener('click', renderNote);

    container.appendChild(sideMenu);
    container.appendChild(noteButton);

    document.body.appendChild(container);

    console.log('Core Components Rendered');
})();


function renderNote() {
    console.log('note rendered')
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

// track notes
function trackNotes(note) {
    const notes = [];
    notes.push(note);
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






































