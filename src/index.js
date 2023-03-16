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
    titleInput.style.display = 'none';
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
    titleInput.style.display = 'none';
    const displayInputButton = document.createElement('button');
    displayInputButton.textContent = 'Add New Project';
    form.appendChild(titleInput);
    form.appendChild(displayInputButton);
    return { form, titleInput, displayInputButton }
}


// render components
(function renderComponents() {
    console.log('Rendering Components...');

    // prevents naming conflicts
    const { notesContainer: notesContainerElement } = notesContainer();
    const { form: notesFormElement, titleInput: notesTitleInputElement } = notesForm();
    const { sideMenu: sideMenuElement } = sideMenu();
    const { form: projectsFormElement, titleInput: projectsTitleInputElement, displayInputButton: displayInputButtonElement } = projectsForm();

    // append child components and container to body
    sideMenuElement.appendChild(projectsFormElement);
    notesContainerElement.appendChild(notesFormElement);
    document.body.appendChild(sideMenuElement);
    document.body.appendChild(notesContainerElement);

    console.log('Components Rendered');

    projectManager(projectsFormElement, projectsTitleInputElement, notesContainerElement, notesTitleInputElement, displayInputButtonElement);
})();


function projectManager(projectsFormElement, projectsInputTitleElement, notesContainerElement, notesTitleInputElement, displayInputButtonElement) {
    console.log('Project Manager Invoked');
    // creates local projectList value
    let projectList = JSON.parse(localStorage.getItem('projectList'));
    // runs a check to prevent initial state overwriting projectList by checking if it already exists in localStorage, seeing as setItem updates state
    if (!projectList) {
        projectList = [{ title: 'Today', notes: [] }, { title: 'Week', notes: [] }, { title: 'Month', notes: [] }, { title: 'Year', notes: [] }];
        localStorage.setItem('projectList', JSON.stringify(projectList));
    }

    const addNewProjectButton = document.createElement('button');
    addNewProjectButton.textContent = 'Add';
    projectsFormElement.appendChild(addNewProjectButton);
    addNewProjectButton.style.display = 'none';

    // sets currentProject to Main on Initial Render
    let currentProject = '';
    console.log('Current Project on Render: ' + currentProject);

    // render method
    function renderProjects() {
        console.log('Rendering Projects...');
        // prevent duplicate projects from being added
        const duplicateProjects = document.querySelectorAll('.projectRow');
        duplicateProjects.forEach((project) => {
            projectsFormElement.removeChild(project);
        })
        // prevent duplicate delete project buttons from being added
        const duplicateDeleteProjectNoteButtons = document.querySelectorAll('.deleteProjectButton');
        duplicateDeleteProjectNoteButtons.forEach((deleteNoteButton) => {
            projectsFormElement.removeChild(deleteNoteButton);
        })

        // iterate through projects and render
        for (let i = 0; i < projectList.length; i++) {
            const deleteProjectButton = document.createElement('button');
            deleteProjectButton.classList.add('deleteProjectButton');
            deleteProjectButton.textContent = 'Delete';

            const projectRow = document.createElement('div');
            projectRow.classList.add('projectRow');

            let projectElement = '';
            if (!projectList.slice(0, 4).some(p => p.title == projectList[i].title)) {
                projectElement = document.createElement('button');
                projectRow.appendChild(deleteProjectButton);
            }
            else {
                projectElement = document.createElement('h1');
            }
            projectElement.classList.add('project');
            if (projectList[i].title == projectList[0].title) {
                projectElement.setAttribute('id', 'firstProject');
            }
            projectElement.textContent = projectList[i].title;

            projectRow.appendChild(projectElement);
            projectsFormElement.appendChild(projectRow);
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
            deleteProjectButton.addEventListener('click', (e) => {
                // if no projects direct to today
                e.preventDefault();
                // extract first four default elements using slice and run a condition for any of the elements using some
                if (!projectList.slice(0, 4).some(p => p.title == projectList[i].title)) {
                    console.log('Deleting Project...');
                    projectList.splice(projectList.indexOf(projectList[i]), 1);
                    localStorage.setItem('projectList', JSON.stringify(projectList));
                    console.log('Project Deleted...');
                    console.log('Re-Rendering...');
                    let deletedProject = projectList.find(project => project == currentProject);
                    if (deletedProject == undefined) {
                        currentProject = projectList[0].title;
                        const firstProject = document.getElementById('firstProject');
                        firstProject.click();
                        console.log('Current Project Changed to First Project');
                    }
                    renderProjects();
                }
                else {
                    console.log('Cannot Delete Default Project');
                }
            })
        }
    }

    // invoke on initial render
    renderProjects();
    noteManager(notesContainerElement, notesTitleInputElement, projectList, currentProject);

    function displayInput(e) {
        e.preventDefault();
        projectsInputTitleElement.style.display = 'block';
        addNewProjectButton.style.display = 'block';
        displayInputButtonElement.style.display = 'none';
    }

    displayInputButtonElement.addEventListener('click', displayInput);

    // add new project method
    function addNewProject(e) {
        e.preventDefault();
        projectsInputTitleElement.style.display = 'none';
        addNewProjectButton.style.display = 'none';
        displayInputButtonElement.style.display = 'block';
        projectList.push({ title: projectsInputTitleElement.value, notes: [] });
        // updates local projectList value
        localStorage.setItem('projectList', JSON.stringify(projectList));
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

    const duplicateDisplayInputButtons = document.querySelectorAll('.displayNoteInput');
    duplicateDisplayInputButtons.forEach((displayNoteButton) => {
        notesContainerElement.removeChild(displayNoteButton);
    })

    const displayNoteInputButton = document.createElement('button');
    displayNoteInputButton.textContent = 'Add New Note';
    displayNoteInputButton.classList.add('displayNoteInput');
    notesContainerElement.appendChild(displayNoteInputButton);

    const duplicateNewNoteButtons = document.querySelectorAll('.newNoteButton');
    duplicateNewNoteButtons.forEach((newNoteButton) => {
        notesContainerElement.removeChild(newNoteButton);
    })

    const addNewNoteButton = document.createElement('button');
    addNewNoteButton.classList.add('newNoteButton');
    addNewNoteButton.textContent = 'Add';
    addNewNoteButton.addEventListener('click', addNotes);
    addNewNoteButton.style.display = 'none';
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


                    const noteCalendar = document.createElement('input');
                    noteCalendar.setAttribute('type', 'date');
                    note.appendChild(noteCalendar);

                    function deleteNote() {
                        console.log('Deleting Note...');
                        projectList[i].notes.splice(projectList[i].notes.indexOf(projectList[i].notes[j]), 1);
                        localStorage.setItem('projectList', JSON.stringify(projectList));
                        console.log('Note Deleted...');
                        console.log('Re-Rendering...');
                        renderNotes();
                    }

                    const noteCompletedButton = document.createElement('button');
                    noteCompletedButton.textContent = 'Completed';
                    noteCompletedButton.addEventListener('click', deleteNote);


                    const deleteNoteButton = document.createElement('button');
                    deleteNoteButton.textContent = 'Delete';
                    deleteNoteButton.addEventListener('click', deleteNote);


                    note.appendChild(deleteNoteButton);
                    note.appendChild(noteCompletedButton);
                    notesContainerElement.appendChild(note);
                }
            }
        }
    }

    // render on initial render;
    renderNotes();


    function displayInput(e) {
        e.preventDefault();
        notesTitleInputElement.style.display = 'block';
        addNewNoteButton.style.display = 'block';
        displayNoteInputButton.style.display = 'none';
    }

    displayNoteInputButton.addEventListener('click', displayInput);


    // add to notes method
    function addNotes() {
        notesTitleInputElement.style.display = 'none';
        addNewNoteButton.style.display = 'none';
        displayNoteInputButton.style.display = 'block';
        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].title == currentProject) {
                projectList[i].notes.push(notesTitleInputElement.value);
                localStorage.setItem('projectList', JSON.stringify(projectList));
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
- Dealing with State should be Handled in Application Logic not Component Creation
- Using JSON to Stringify Objects & a Parser to Convert String Data back into an Object
- Using LocalStorage to Store Data Locally
- Update Locally Stored Data

Notes
- Duplicate Function Calls : Check Inner Functions for Multiple Invocations
- Array Methods returning Undefined : Check Access (Array or Array Element)

Questions
- Iterating Through For Loops & Using Nested Conditionals
- Could Have Added Type to Project : Default or Personal
- Could have Created Separate Project List

TO-D0
- Design
- Add Calendar per Note


If Equal to Default Projects Do Not Render Add Note Button & Change Project Element to Div
Add Note to Project & If Date.now == Date, Datel.now + 7 etc....
*/