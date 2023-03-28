import './main.css';
import { startOfDay, isEqual } from 'date-fns';

// create components
function notesContainer() {
    const notesContainer = document.createElement('div');
    notesContainer.setAttribute('id', 'notesContainer');
    return { notesContainer };
}

function notesForm() {
    const notesForm = document.createElement('form');
    notesForm.setAttribute('id', 'notesForm');
    const taskInput = document.createElement('input');
    taskInput.style.display = 'none';
    notesForm.appendChild(taskInput);
    return { notesForm, taskInput };
}

function sideMenu() {
    const sideMenu = document.createElement('div');
    sideMenu.setAttribute('id', 'sideMenu');
    return { sideMenu };
}


function projectsForm() {
    const projectsForm = document.createElement('form');
    projectsForm.setAttribute('id', 'projectsForm');
    const titleInput = document.createElement('input');
    titleInput.style.display = 'none';
    projectsForm.appendChild(titleInput);
    return { projectsForm, titleInput }
}

// render components
(function renderComponents() {
    console.log('Rendering Components...');

    // assigned returned properties variables to prevent naming conflicts
    const { notesContainer: notesContainerElement } = notesContainer();
    const { notesForm: notesFormElement, taskInput: notesTaskInputElement } = notesForm();
    const { sideMenu: sideMenuElement } = sideMenu();
    const { projectsForm: projectsFormElement, titleInput: projectsTitleInputElement } = projectsForm();

    // append forms to container & containers to body
    sideMenuElement.appendChild(projectsFormElement);
    notesContainerElement.appendChild(notesFormElement);
    document.body.appendChild(sideMenuElement);
    document.body.appendChild(notesContainerElement);

    console.log('Components Rendered');
    console.log('Project Manager Invoked');

    projectManager(projectsFormElement, projectsTitleInputElement, notesContainerElement, notesTaskInputElement);
})();


function projectManager(projectsFormElement, projectsTitleInputElement, notesContainerElement, notesTaskInputElement) {
    // Set Starting Point for Current Project & Set Default Projects
    let currentProject = 0;
    // prevents projectList from being set on re-render to default values
    let projectList = JSON.parse(localStorage.getItem('projectList'));
    // if projectList already exists do nothing else render initial values
    if (!projectList) {
        // store projectList locally
        projectList = [
            { title: 'All', id: 0, notes: [] },
            { title: 'Today', id: 1, notes: [] },
            { title: 'Week', id: 2, notes: [] },
            { title: 'Month', id: 3, notes: [] },
            { title: 'Year', id: 4, notes: [] }
        ];
        localStorage.setItem('projectList', JSON.stringify(projectList));
    }

    // Add Project Button
    const addProjectButton = document.createElement('button');
    addProjectButton.textContent = 'Add Project';
    addProjectButton.style.display = 'none';
    addProjectButton.addEventListener('click', addProject);
    projectsFormElement.appendChild(addProjectButton);


    // Add Project Event
    function addProject(e) {
        e.preventDefault();
        projectList.push({ title: projectsTitleInputElement.value, id: projectList.length, notes: [] });
        localStorage.setItem('projectList', JSON.stringify(projectList));
        renderProjects();
        projectsTitleInputElement.value = '';
        projectsTitleInputElement.style.display = 'none';
        addProjectButton.style.display = 'none';
        newProjectButton.style.display = 'block';
        console.log(projectList);
    }

    // Create New Project Button
    const newProjectButton = document.createElement('button');
    newProjectButton.textContent = 'Create New Project';
    newProjectButton.addEventListener('click', createNewProject);
    projectsFormElement.appendChild(newProjectButton);

    // Create New Project Event
    function createNewProject(e) {
        e.preventDefault();
        newProjectButton.style.display = 'none';
        projectsTitleInputElement.style.display = 'block';
        addProjectButton.style.display = 'block';
    }

    // Render Projects
    function renderProjects() {


        // prevent duplicate projects rows from being added
        const duplicateProjectRows = document.querySelectorAll('.projectRow');
        duplicateProjectRows.forEach((project) => {
            projectsFormElement.removeChild(project);
        })

        // iterate through projects and render
        for (let i = 0; i < projectList.length; i++) {

            // Create Project Row
            const projectRow = document.createElement('div');
            projectRow.classList.add('projectRow');

            // Create Project Element
            const projectElement = document.createElement('h1');

            // Add ID to 'All Projects' Default Project to Load on Browser Reset
            if (projectList[i].id == 0) {
                projectElement.setAttribute('id', 'allProjects');
            }


            // Switch Project Event
            function switchProject(e) {
                e.preventDefault();
                currentProject = projectList[i].id;
                console.log('Switched to ' + projectList[currentProject].title);
                noteManager(notesContainerElement, notesTaskInputElement, projectList, currentProject);
            }

            projectElement.addEventListener('click', switchProject);

            // Create Delete Project Button
            const deleteProjectButton = document.createElement('button');
            deleteProjectButton.textContent = 'Delete';
            deleteProjectButton.addEventListener('click', deleteProject);

            if (!projectList.slice(0, 5).some(project => project.id == projectList[i].id)) {
                projectRow.appendChild(deleteProjectButton);
            }

            // Delete Project Event
            function deleteProject(e) {
                e.preventDefault();
                const index = projectList.indexOf(projectList[i]);
                if (currentProject == index) {
                    const allProjectsDefaultProject = document.getElementById('allProjects');
                    allProjectsDefaultProject.click();
                }
                projectList.splice(index, 1);
                localStorage.setItem('projectList', JSON.stringify(projectList));
                renderProjects();
            }

            projectElement.classList.add('project');
            projectElement.textContent = projectList[i].title;
            projectRow.appendChild(projectElement);
            projectsFormElement.appendChild(projectRow);
        }
    }
    renderProjects();
    noteManager(notesContainerElement, notesTaskInputElement, projectList, currentProject);
}


function noteManager(notesContainerElement, notesTaskInputElement, projectList, currentProject) {
    console.log('Note Manager Invoked');


    // Prevent Duplicate Buttons
    const duplicateAddNoteButtons = document.querySelectorAll('.addNoteButton');
    duplicateAddNoteButtons.forEach((addNoteButton) => {
        notesContainerElement.removeChild(addNoteButton);
    })
    const duplicateNewNoteButtons = document.querySelectorAll('.createNewNoteButton');
    duplicateNewNoteButtons.forEach((newNoteButton) => {
        notesContainerElement.removeChild(newNoteButton);
    })

    // Create Add Note Button
    const addNoteButton = document.createElement('button');
    addNoteButton.classList.add('addNoteButton');
    addNoteButton.textContent = 'Add Note';
    addNoteButton.style.display = 'none';
    addNoteButton.addEventListener('click', addNote);
    notesContainerElement.appendChild(addNoteButton);

    // Create Add Note Event
    function addNote(e) {
        e.preventDefault();
        projectList[0].notes.push({ task: notesTaskInputElement.value, date: '', projectID: projectList.length, noteID: projectList[currentProject].notes.length });
        projectList[currentProject].notes.push({ task: notesTaskInputElement.value, date: '', projectID: projectList.length, noteID: projectList[currentProject].notes.length });
        console.log(projectList);
        localStorage.setItem('projectList', JSON.stringify(projectList));
        renderNotes();
        notesTaskInputElement.value = '';
        notesTaskInputElement.style.display = 'none';
        addNoteButton.style.display = 'none';
        addNewNoteButton.style.display = 'block';
    }

    // Create New Note Button
    const addNewNoteButton = document.createElement('button');
    addNewNoteButton.classList.add('createNewNoteButton');
    addNewNoteButton.textContent = 'Create New Note';
    addNewNoteButton.addEventListener('click', createNewNote);
    notesContainerElement.appendChild(addNewNoteButton);

    // Hide Create New Note Button if CurrentProject is a Default Project
    if (projectList.slice(0, 5).some(project => project.id == currentProject || currentProject == undefined)) {
        addNewNoteButton.style.display = 'none';
    }

    // Create New Note Event
    function createNewNote(e) {
        e.preventDefault();
        addNewNoteButton.style.display = 'none';
        notesTaskInputElement.style.display = 'block';
        addNoteButton.style.display = 'block';
    }


    // Render Notes
    function renderNotes() {

        const defaultProjects = projectList.slice(0, 5);
        const personalProjects = projectList.slice(5);

        // Remove Deleted Notes from Default Projects When a Personal Project is Deleted
        for (let j = 0; j < projectList.length; j++) {
            for (let k = 0; k < projectList[j].notes.length; k++) {
                // Use Some as an Iterator
                if (defaultProjects.some(project => project.notes.some(note => note.noteID == projectList[j].notes[k].noteID && note.projectID == projectList[j].notes[k].projectID)) &&
                    !personalProjects.some(project => project.notes.some(note => note.noteID == projectList[j].notes[k].noteID && note.projectID == projectList[j].notes[k].projectID))
                ) {
                    projectList[j].notes.splice(projectList[j].notes.indexOf(projectList[j].notes[k], 1));
                }
            }
        }

        // Prevent Duplicate Notes
        const duplicateNotes = document.querySelectorAll('.note');
        duplicateNotes.forEach((note) => {
            notesContainerElement.removeChild(note);
        })

        // Render Notes for Current Projects
        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].id == currentProject) {
                console.log('Rendering Notes...');
                for (let o = 0; o < projectList[i].notes.length; o++) {

                    // Create Note
                    const note = document.createElement('div');
                    note.classList.add('note');
                    note.textContent = projectList[currentProject].notes[o].task;

                    // Change Calendar Date Event
                    function setDate() {

                        let previousNote = projectList[i].notes[o];
                        let previousDate = '';
                        if (previousNote.date !== noteCalendar.value) {
                            previousDate = previousNote.date;
                        }

                        let noteDate = '';
                        if (projectList[i].notes[o]) {
                            projectList[i].notes[o].date = noteCalendar.value;
                            noteDate = new Date(projectList[i].notes[o].date + 'T23:59:59');
                        }
                        else {
                            noteDate = new Date(noteCalendar.value + 'T23:59:59');
                        }

                        const today = new Date();
                        const startOfWeek = new Date(today);
                        const endOfWeek = new Date(today);

                        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                        endOfWeek.setDate(today.getDate() - today.getDay() + 7);

                        if (isEqual(startOfDay(new Date(noteDate.toUTCString())), startOfDay(new Date(today.toUTCString())))) {
                            if (projectList[i].notes[o]) {
                                projectList[1].notes.push(previousNote);
                                console.log('Scheduled for Today with Existing Note');
                                console.log('Note Appended : ', projectList[i].notes[o]);
                            }
                            else {
                                projectList[1].notes.push({ task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                                console.log('Scheduled for Today without Existing Note');
                                console.log('Note Appended : ', { task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                            }
                        }
                    }

                    // Create Calendar Input
                    const noteCalendar = document.createElement('input');
                    noteCalendar.setAttribute('type', 'date');
                    noteCalendar.addEventListener('change', setDate);
                    noteCalendar.value = projectList[i].notes[o].date;

                    // Delete Note Event
                    function deleteNote() {
                        console.log('Deleting Note...');
                        // Reference to Deleted Note
                        const deletedNote = projectList[i].notes[o];
                        // O points to Index of Note in ForLoop
                        projectList[i].notes.splice(o, 1);
                        // If Note Was Deleted from Default Project, Delete Note in Other Projects
                        const defaultProjects = projectList.slice(0, 4);
                        const otherProjects = projectList.slice(4);

                        if (defaultProjects.some(project => project.id === projectList[i].id)) {
                            for (let p = 0; p < otherProjects.length; p++) {
                                const index = otherProjects[p].notes.indexOf(deletedNote);
                                if (index !== -1) {
                                    otherProjects[p].notes.splice(index, 1);
                                }
                            }
                        }

                        // Update Local projectList
                        localStorage.setItem('projectList', JSON.stringify(projectList));
                        console.log('Note Deleted');
                        console.log('Re-Rendering...');
                        renderNotes();
                    }

                    // Create Completed Button
                    const noteCompletedButton = document.createElement('button');
                    noteCompletedButton.textContent = 'Completed';
                    noteCompletedButton.addEventListener('click', deleteNote);


                    // Create Delete Button
                    const deleteNoteButton = document.createElement('button');
                    deleteNoteButton.textContent = 'Delete';
                    deleteNoteButton.addEventListener('click', deleteNote);


                    // Append Components
                    note.appendChild(noteCalendar);
                    note.appendChild(deleteNoteButton);
                    note.appendChild(noteCompletedButton);
                    notesContainerElement.appendChild(note);

                }
                console.log('Notes Rendered');
            }
        }
    }

    renderNotes();
};


