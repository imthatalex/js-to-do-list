// create components
function container() {
    const container = document.createElement('div');
    container.setAttribute('id', 'container');
    return { container };
}

function sideMenu() {
    const sideMenu = document.createElement('div');
    sideMenu.setAttribute('id', 'sideMenu');
    return { sideMenu };
}

function form() {
    const form = document.createElement('form');
    const title = document.createElement('input');
    const submit = document.createElement('button');
    submit.textContent = 'Add New Note';
    form.appendChild(title);
    form.appendChild(submit);
    return { form, title, submit };
}

// render components
function renderComponents() {
    // prevents naming conflicts
    const { container: containerElement } = container();
    const { sideMenu: sideMenuElement } = sideMenu();
    const { form: formElement, title: titleElement, submit: addNewNoteButton } = form();

    // append child components and container to body
    sideMenuElement.appendChild(formElement);
    containerElement.appendChild(sideMenuElement);
    document.body.appendChild(containerElement);

    noteManager(containerElement, addNewNoteButton, titleElement);
}


// manage notes
function noteManager(containerElement, addNewNoteButton, titleElement) {
    const notes = [];

    function renderNotes() {
        // prevent duplicate notes
        const noteChilds = document.querySelectorAll('.square');
        noteChilds.forEach((note) => containerElement.removeChild(note));

        // render stored notes
        for (let i = 0; i < notes.length; i++) {
            const noteElement = document.createElement('div');
            noteElement.classList.add('square');
            noteElement.textContent = notes[i].title;

            // delete note
            const deleteNoteButton = document.createElement('button');
            deleteNoteButton.textContent = 'Delete';
            deleteNoteButton.addEventListener('click', () => {
                notes.splice(notes.indexOf(notes[i]), 1);
                renderNotes();
            })

            noteElement.appendChild(deleteNoteButton);
            containerElement.appendChild(noteElement);
        }
    }

    function addNewNote(e) {
        // submit form button prevents default
        e.preventDefault();
        notes.push({ title: titleElement.value });
        renderNotes();
    }

    addNewNoteButton.addEventListener('click', addNewNote);
}


renderComponents();


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

T.I.L
- Composition over Inheritance : Use Smaller Functions (Code Blocks) to Create more Complex Behavior without having to write all the Code in one Large Function.
- Single Responsibility Principle : Similar Responsibilities with Only One Reason to Change
- How to Destructure Properties returned from Factory Functions
*/
