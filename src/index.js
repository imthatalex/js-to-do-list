// loaded to be handled by bundler
import './main.css';

// factories

// create dom elements
function createLayout() {
    console.log('Create Layout');
    const container = document.createElement('div');
    container.setAttribute('id', 'container');
    // append to the body
    document.body.appendChild(container);

    function sideMenu() {
        console.log('Side Menu Rendered V2');
        const sideMenu = document.createElement('div');
        sideMenu.setAttribute('id', 'sideMenu')
        container.appendChild(sideMenu);
    }


    function notes() {
        console.log('Note Rendered');
        const note = document.createElement('div');
        note.classList.add('note');
        container.appendChild(note);
    }

    // returns functions/methods
    return { sideMenu, notes }
}










// application functionality
function addToDoItems() {

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


// render application
(function renderList() {
    console.log('Render List V5');
    // // call createLayout and assign the returned functions to variables
    const { sideMenu, notes } = createLayout();
    // call the sideMenu and notes functions to add elements to the container
    sideMenu();
    notes();
})();


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

