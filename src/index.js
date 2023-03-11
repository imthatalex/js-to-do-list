import './main.css';

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

function projectList() {
    let currentProject = '';
    let allProjects = [];
    const projectList = document.createElement('div');
    const addProject = document.createElement('button');
    addProject.textContent = 'Add New Project';
    projectList.appendChild(addProject);
    return { projectList, addProject, currentProject, allProjects }
}

// render components
function renderComponents() {
    console.log('Rendering Components...');

    // prevents naming conflicts
    const { container: containerElement } = container();
    const { sideMenu: sideMenuElement } = sideMenu();
    const { form: formElement, title: titleElement, submit: addNewNoteButton } = form();
    const { projectList: projectListElement, addProject: addProjectButton, currentProject: currentProjectElement, allProjects: allProjectsElement } = projectList();

    // append child components and container to body
    sideMenuElement.appendChild(projectListElement);
    containerElement.appendChild(formElement);
    document.body.appendChild(sideMenuElement);
    document.body.appendChild(containerElement);

    projectManager(currentProjectElement, allProjectsElement, addProjectButton, containerElement, addNewNoteButton, titleElement);
}


function projectManager(currentProjectElement, allProjectsElement, addProjectButton, containerElement, addNewNoteButton, titleElement) {
    console.log('Project Manager Invoked');
    // adds default project to list
    console.log('Setting Main/Default Project...');
    allProjectsElement.push({ title: 'Main', notes: ['note one', 'note two', 'note three'] });
    // sets current project to default
    console.log('Setting Current Project...');
    currentProjectElement = allProjectsElement[0].title;
    // Invoke Note Manager
    noteManager(currentProjectElement, allProjectsElement, containerElement, addNewNoteButton, titleElement);

    addProjectButton.addEventListener('click', () => {
        console.log('Adding New Project...');
    })

}

// manage notes
function noteManager(currentProjectElement, allProjectsElement, containerElement, addNewNoteButton, titleElement) {
    console.log('Note Manager Invoked');
    const projects = allProjectsElement;

    function renderNotes() {
        // prevent duplicate notes
        const noteChilds = document.querySelectorAll('.square');
        noteChilds.forEach((note) => containerElement.removeChild(note));

        // render stored notes
        // iterate through projects
        for (let i = 0; i < projects.length; i++) {
            console.log(projects.length);
            if (currentProjectElement == projects[i].title) {
                // iterate through the notes of currentProject
                for (let j = 0; j < projects[i].notes.length; j++) {
                    console.log('CurrentProject Found, Rendering Notes...');
                    const noteElement = document.createElement('div');
                    noteElement.classList.add('square');
                    noteElement.textContent = projects[i].notes[j];

                    // delete note
                    const deleteNoteButton = document.createElement('button');
                    deleteNoteButton.textContent = 'Delete';
                    deleteNoteButton.addEventListener('click', () => {
                        console.log('Deleting Note...');
                        projects[i].notes.splice(projects[i].notes[j].indexOf(projects[i].notes[j]), 1);
                        console.log('Note Deleted...');
                        console.log('Re-Rendering...');
                        renderNotes();
                    })

                    noteElement.appendChild(deleteNoteButton);
                    containerElement.appendChild(noteElement);
                }
            }
        }
        // add new Note
        function addNewNote(e) {
            console.log('Adding New Note..');
            // submit form button prevents default
            e.preventDefault();
            projects[0].notes.push(titleElement.value);
            console.log('New Note Added...');
            console.log('Re-Rendering...')
            renderNotes();
        }

        addNewNoteButton.addEventListener('click', addNewNote);

    }

    renderNotes();

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
- Iterating with Nested forLoops
*/
