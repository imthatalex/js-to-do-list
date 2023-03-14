import './main.css';

// create components
function notesContainer() {
    const notesContainer = document.createElement('div');
    notesContainer.setAttribute('id', 'notesContainer');
    return { notesContainer };
}

function notesForm() {
    const form = document.createElement('form');
    form.setAttribute('id', 'notesForm');
    const titleInput = document.createElement('input');
    form.appendChild(titleInput);
    return { form, titleInput };
}

function sideMenu() {
    const sideMenu = document.createElement('div');
    sideMenu.setAttribute('id', 'sideMenu');
    return { sideMenu };
}

function projectsForm() {
    const form = document.createElement('form');
    form.setAttribute('id', 'projectsForm');
    const titleInput = document.createElement('input');
    form.appendChild(titleInput);
    return { form, titleInput }
}


// render components
function renderComponents() {
    console.log('Rendering Components...');

    // prevents naming conflicts
    const { notesContainer: notesContainerElement } = notesContainer();
    const { form: notesFormElement, titleInput: notesTitleInputElement } = notesForm();
    const { sideMenu: sideMenuElement } = sideMenu();
    const { form: projectsFormElement, titleInput: projectsTitleInputElement } = projectsForm();

    // append child components and container to body
    sideMenuElement.appendChild(projectsFormElement);
    notesContainerElement.appendChild(notesFormElement);
    document.body.appendChild(sideMenuElement);
    document.body.appendChild(notesContainerElement);

    console.log('Components Rendered');


    projectManager(projectsFormElement, projectsTitleInputElement, notesContainerElement, notesTitleInputElement);

}

renderComponents();


function projectManager(projectsFormElement, projectsInputTitleElement, notesContainerElement, notesTitleInputElement) {
    console.log('Project Manager Invoked');
    // create a list of projects
    // set main project
    const projectList = [{ title: 'Main', notes: [] }];

    const addNewProjectButton = document.createElement('button');
    addNewProjectButton.textContent = 'Add New Project';
    projectsFormElement.appendChild(addNewProjectButton);

    // sets currentProject to Main on Initial Render
    let currentProject = projectList[0].title;
    console.log('Current Project on Render: ' + currentProject);


    // render method
    function renderProjects() {
        console.log('Rendering Projects...');
        // prevent duplicate projects from being added
        const duplicateProjects = document.querySelectorAll('.project');
        duplicateProjects.forEach((project) => {
            projectsFormElement.removeChild(project);
        })

        for (let i = 0; i < projectList.length; i++) {
            const projectElement = document.createElement('button');
            projectElement.classList.add('project');
            projectElement.textContent = projectList[i].title;
            projectsFormElement.appendChild(projectElement);
            console.log('Projects Rendered');

            // nested switch project method
            function switchCurrentProject(e) {
                e.preventDefault();
                currentProject = projectList[i].title;
                console.log('Current Project Switched to: ' + currentProject);
                console.log('Current Projects in Project Manager', projectList);
                console.log('Passing Updated Project List & Current Project to Note Manager');
                noteManager(notesContainerElement, notesTitleInputElement, projectList, currentProject);
            }
            projectElement.addEventListener('click', switchCurrentProject);
        }
    }

    // invoke on initial render
    renderProjects();
    noteManager(notesContainerElement, notesTitleInputElement, projectList, currentProject);

    // add new project method
    function addNewProject(e) {
        e.preventDefault();
        projectList.push({ title: projectsInputTitleElement.value, notes: [] });
        console.log('New Project Added, List of Projects: ');
        console.log(projectList);
        renderProjects();
    }

    addNewProjectButton.addEventListener('click', addNewProject);

}

function noteManager(notesContainerElement, notesTitleInputElement, projectList, currentProject) {
    console.log('Note Manager Invoked');
    console.log('Current Project in Note Manager: ' + currentProject);
    console.log('Current Projects in Note Manager', projectList);

    const duplicateNewNoteButtons = document.querySelectorAll('.newNoteButton');
    duplicateNewNoteButtons.forEach((newNoteButton) => {
        notesContainerElement.removeChild(newNoteButton);
    })

    const addNewNoteButton = document.createElement('button');
    addNewNoteButton.classList.add('newNoteButton');
    addNewNoteButton.textContent = 'Add New Note';
    addNewNoteButton.addEventListener('click', addNotes);
    notesContainerElement.appendChild(addNewNoteButton);

    function renderNotes() {
        const duplicateNotes = document.querySelectorAll('.note');
        duplicateNotes.forEach((note) => {
            notesContainerElement.removeChild(note);
        })

        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].title == currentProject) {
                for (let j = 0; j < projectList[i].notes.length; j++) {
                    const note = document.createElement('div');
                    note.classList.add('note');
                    note.textContent = projectList[i].notes[j];
                    notesContainerElement.appendChild(note);
                }
            }
        }
    }



    // render on initial render;
    renderNotes();

    // add to notes method
    function addNotes() {
        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].title == currentProject) {
                projectList[i].notes.push(notesTitleInputElement.value);
                renderNotes();
            }
        }
    }




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

T.I.L
- Composition over Inheritance : Use Smaller Functions (Code Blocks) to Create more Complex Behavior without having to write all the Code in one Large Function.
- Single Responsibility Principle : Similar Responsibilities with Only One Reason to Change
- How to Destructure Properties returned from Factory Functions
- Iterating with Nested forLoops : Multiple Arrays Require Multiple Loops
- When Passing Buttons with Attached Event Listeners as a Variable in Params, it May Cause Duplicate Event Listener Invocations

Notes
- Duplicate Function Calls : Check Inner Functions for Multiple Invocations
- Array Methods returning Undefined : Check Access (Array or Array Element)

Questions
- Iterating Through For Loops & Using Nested Conditionals

TO-D0
- Delete Existing Project
*/