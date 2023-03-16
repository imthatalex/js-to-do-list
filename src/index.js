import './main.css';
import { startOfDay, isEqual } from 'date-fns';



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
    const { form: projectsFormElement, titleInput: projectsTitleInputElement, displayInputButton: displayProjectInputButtonElement } = projectsForm();

    // append child components and container to body
    sideMenuElement.appendChild(projectsFormElement);
    notesContainerElement.appendChild(notesFormElement);
    document.body.appendChild(sideMenuElement);
    document.body.appendChild(notesContainerElement);

    console.log('Components Rendered');

    projectManager(projectsFormElement, projectsTitleInputElement, notesContainerElement, notesTitleInputElement, displayProjectInputButtonElement);
})();


function projectManager(projectsFormElement, projectsInputTitleElement, notesContainerElement, notesTitleInputElement, displayProjectInputButtonElement) {
    console.log('Project Manager Invoked');

    // Add New Project Button 
    const addNewProjectButton = document.createElement('button');
    addNewProjectButton.textContent = 'Add';
    addNewProjectButton.style.display = 'none';
    projectsFormElement.appendChild(addNewProjectButton);

    // Add New Project Method
    function addNewProject(e) {
        e.preventDefault();
        projectsInputTitleElement.style.display = 'none';
        addNewProjectButton.style.display = 'none';
        displayProjectInputButtonElement.style.display = 'block';
        console.log('Adding New Project...');
        projectList.push({ title: projectsInputTitleElement.value, notes: [] });
        // updates local projectList value
        localStorage.setItem('projectList', JSON.stringify(projectList));
        console.log('New Project Added, List of Projects: ');
        renderProjects();
    }
    addNewProjectButton.addEventListener('click', addNewProject);

    // Display Input Method
    function displayInput(e) {
        e.preventDefault();
        projectsInputTitleElement.style.display = 'block';
        addNewProjectButton.style.display = 'block';
        displayProjectInputButtonElement.style.display = 'none';
    }
    displayProjectInputButtonElement.addEventListener('click', displayInput);

    // prevents projectList from being set on re-render to default values
    let projectList = JSON.parse(localStorage.getItem('projectList'));
    // if projectList already exists do nothing else render initial values
    if (!projectList) {
        // store projectList locally
        projectList = [{ title: 'Today', notes: [] }, { title: 'Week', notes: [] }, { title: 'Month', notes: [] }, { title: 'Year', notes: [] }];
        localStorage.setItem('projectList', JSON.stringify(projectList));
    }

    // create instance of currentProject set to null
    let currentProject = '';

    // render method
    function renderProjects() {
        console.log('Rendering Projects...');

        // prevent duplicate projects from being added
        const duplicateProjects = document.querySelectorAll('.projectRow');
        duplicateProjects.forEach((project) => {
            projectsFormElement.removeChild(project);
        })

        // iterate through projects and render
        for (let i = 0; i < projectList.length; i++) {
            // Add Delete Project Button
            const deleteProjectButton = document.createElement('button');
            deleteProjectButton.classList.add('deleteProjectButton');
            deleteProjectButton.textContent = 'Delete';

            // Create Project Row to Add Projects
            const projectRow = document.createElement('div');
            projectRow.classList.add('projectRow');

            // Render Project
            // If Project Type is Default, Set to H1 Element else Set to Button Element
            let projectElement = '';
            if (!projectList.slice(0, 4).some(p => p.title == projectList[i].title)) {
                projectElement = document.createElement('button');
                // Only Append Delete Button to Non Default Projects
                projectRow.appendChild(deleteProjectButton);
            }
            else {
                projectElement = document.createElement('h1');
            }
            projectElement.classList.add('project');
            if (projectList[i].title == projectList[0].title) {
                // Reference to First Project in List
                projectElement.setAttribute('id', 'firstProject');
            }
            projectElement.textContent = projectList[i].title;
            projectRow.appendChild(projectElement);
            projectsFormElement.appendChild(projectRow);
            console.log('Projects Rendered');

            // Switch Project Method
            function switchCurrentProject(e) {
                e.preventDefault();
                currentProject = projectList[i].title;
                console.log('Current Project Switched to: ' + currentProject);
                noteManager(notesContainerElement, notesTitleInputElement, projectList, currentProject);
            }
            projectElement.addEventListener('click', switchCurrentProject);

            // Delete Project Method
            deleteProjectButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Only Delete Non-Default Projects
                if (!projectList.slice(0, 4).some(p => p.title == projectList[i].title)) {
                    console.log('Deleting Project...');
                    projectList.splice(projectList.indexOf(projectList[i]), 1);
                    // Update Local projectList
                    localStorage.setItem('projectList', JSON.stringify(projectList));
                    console.log('Project Deleted...');
                    console.log('Re-Rendering...');
                    // Search for Deleted Project, if Deleted Project was Currently Selected at Delete, Re-Direct User to firstProject Reference
                    let deletedProject = projectList.find(project => project == currentProject);
                    if (deletedProject == undefined) {
                        // Switch Current Project to firstProject
                        currentProject = projectList[0].title;
                        const firstProject = document.getElementById('firstProject');
                        // Change to firstProject
                        firstProject.click();
                        console.log('Current Project Changed to ' + currentProject);
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
}

function noteManager(notesContainerElement, notesTitleInputElement, projectList, currentProject) {
    console.log('Note Manager Invoked');
    console.log('Current Project in Note Manager: ' + currentProject);
    console.log('Current Projects in Note Manager: ', projectList);

    // Prevent Duplicate Buttons
    const duplicateDisplayInputButtons = document.querySelectorAll('.displayNoteInput');
    duplicateDisplayInputButtons.forEach((displayNoteButton) => {
        notesContainerElement.removeChild(displayNoteButton);
    })
    const duplicateNewNoteButtons = document.querySelectorAll('.newNoteButton');
    duplicateNewNoteButtons.forEach((newNoteButton) => {
        notesContainerElement.removeChild(newNoteButton);
    })

    // Create Display Note Button
    const displayNoteInputButton = document.createElement('button');
    displayNoteInputButton.textContent = 'Add New Note';
    displayNoteInputButton.classList.add('displayNoteInput');
    notesContainerElement.appendChild(displayNoteInputButton);

    // Create Add New Note Button
    const addNewNoteButton = document.createElement('button');
    addNewNoteButton.classList.add('newNoteButton');
    addNewNoteButton.textContent = 'Add';
    addNewNoteButton.addEventListener('click', addNotes);
    addNewNoteButton.style.display = 'none';
    notesContainerElement.appendChild(addNewNoteButton);

    // Add New Note Method
    function addNotes() {
        notesTitleInputElement.style.display = 'none';
        addNewNoteButton.style.display = 'none';
        displayNoteInputButton.style.display = 'block';
        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].title == currentProject) {
                projectList[i].notes.push({ task: notesTitleInputElement.value, date: '' });
                localStorage.setItem('projectList', JSON.stringify(projectList));
                renderNotes();
            }
        }
    }

    // Display Input Method
    function displayInput(e) {
        e.preventDefault();
        notesTitleInputElement.style.display = 'block';
        addNewNoteButton.style.display = 'block';
        displayNoteInputButton.style.display = 'none';
    }
    displayNoteInputButton.addEventListener('click', displayInput);

    // Hide Display Note Button if CurrentProject is a Default Project
    if (projectList.slice(0, 4).some(project => project.title == currentProject || currentProject == '')) {
        displayNoteInputButton.style.display = 'none';
    }

    // Render Notes Method
    function renderNotes() {
        // Prevent Duplicate Notes
        const duplicateNotes = document.querySelectorAll('.note');
        duplicateNotes.forEach((note) => {
            notesContainerElement.removeChild(note);
        })


        // Iterate through ProjectNotes and Render
        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].title == currentProject) {




                for (let j = 0; j < projectList[i].notes.length; j++) {
                    // Create Note
                    const note = document.createElement('div');
                    note.classList.add('note');
                    note.textContent = projectList[i].notes[j].task;
                    notesContainerElement.appendChild(note);

                    // Update Calendar Method
                    function updateCalendar() {
                        console.log('Updating Note Date..');
                        projectList[i].notes[j].date = noteCalendar.value;


                        // Check Date, Push Note to Default Project based on Date
                        const noteDate = new Date(projectList[i].notes[j].date + 'T23:59:59');
                        const today = new Date();

                        if (isEqual(startOfDay(new Date(noteDate.toUTCString())), startOfDay(new Date(today.toUTCString())))) {
                            console.log('Today!');
                            projectList[0].notes.push(projectList[i].notes[j]);
                        }

                        else {
                            console.log('Date in Note Array: ' + projectList[i].notes[j].date)
                            console.log('Date in Date(): ' + noteDate);
                            console.log('Date in Today(): ' + today);
                        }
                        // Update Local projectList
                        localStorage.setItem('projectList', JSON.stringify(projectList));
                        console.log('Date Updated');
                    }

                    // Delete Note Method
                    function deleteNote() {
                        console.log('Deleting Note...');
                        projectList[i].notes.splice(projectList[i].notes.indexOf(projectList[i].notes[j]), 1);
                        // Update Local projectList
                        localStorage.setItem('projectList', JSON.stringify(projectList));
                        console.log('Note Deleted...');
                        console.log('Re-Rendering...');
                        renderNotes();
                    }

                    // Create Calendar Input
                    const noteCalendar = document.createElement('input');
                    noteCalendar.setAttribute('type', 'date');
                    noteCalendar.addEventListener('change', updateCalendar);
                    noteCalendar.value = projectList[i].notes[j].date;

                    // Create Completed Button
                    const noteCompletedButton = document.createElement('button');
                    noteCompletedButton.textContent = 'Completed';
                    noteCompletedButton.addEventListener('click', deleteNote);

                    // Create Delete Button
                    const deleteNoteButton = document.createElement('button');
                    deleteNoteButton.textContent = 'Delete';
                    deleteNoteButton.addEventListener('click', deleteNote);

                    note.appendChild(noteCalendar);
                    note.appendChild(deleteNoteButton);
                    note.appendChild(noteCompletedButton);
                    notesContainerElement.appendChild(note);
                }
            }
        }
    }
    renderNotes();
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
- Add Calendar per Note : Notes Array turns into Object Array with Task & Date Properties
*/
