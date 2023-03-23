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

    // assigned returned properties variables to prevent naming conflicts
    const { notesContainer: notesContainerElement } = notesContainer();
    const { form: notesFormElement, titleInput: notesTitleInputElement } = notesForm();
    const { sideMenu: sideMenuElement } = sideMenu();
    const { form: projectsFormElement, titleInput: projectsTitleInputElement, displayInputButton: displayProjectInputButtonElement } = projectsForm();

    // append container and child components to body
    sideMenuElement.appendChild(projectsFormElement);
    notesContainerElement.appendChild(notesFormElement);
    document.body.appendChild(sideMenuElement);
    document.body.appendChild(notesContainerElement);

    console.log('Components Rendered');
    console.log('Project Manager Invoked');

    projectManager(projectsFormElement, projectsTitleInputElement, notesContainerElement, notesTitleInputElement, displayProjectInputButtonElement);
})();


function projectManager(projectsFormElement, projectsInputTitleElement, notesContainerElement, notesTitleInputElement, displayProjectInputButtonElement) {
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
        projectList.push({ title: projectsInputTitleElement.value, id: projectList.length, notes: [] });
        // updates local projectList value
        localStorage.setItem('projectList', JSON.stringify(projectList));
        console.log('New Project Added');
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
        projectList = [{ title: 'Today', id: 0, notes: [] }, { title: 'Week', id: 1, notes: [] }, { title: 'Month', id: 2, notes: [] }, { title: 'Year', id: 3, notes: [] }];
        localStorage.setItem('projectList', JSON.stringify(projectList));
    }

    // create instance of currentProject set to today default project
    let currentProject = 0;

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
            if (!projectList.slice(0, 4).some(p => p.id == projectList[i].id)) {
                projectElement = document.createElement('button');
                // Only Append Delete Button to Non Default Projects
                projectRow.appendChild(deleteProjectButton);
            }
            else {
                projectElement = document.createElement('h1');
            }
            projectElement.classList.add('project');
            if (projectList[i].id == projectList[0].id) {
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
                currentProject = projectList[i].id;
                console.log('Current Project Switched to ', projectList[i]);
                noteManager(notesContainerElement, notesTitleInputElement, projectList, currentProject);
            }
            projectElement.addEventListener('click', switchCurrentProject);

            // Delete Project Method
            deleteProjectButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Only Delete Non-Default Projects
                const otherProjects = projectList.slice(4);
                if (otherProjects.some(project => project.id == projectList[i].id)) {
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
                        currentProject = projectList[0].id;
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
        console.log('Adding Note...');
        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].id == currentProject) {
                // changed pushed value to object literal
                projectList[i].notes.push({ task: notesTitleInputElement.value, date: '', projectNoteID: projectList[i].id, noteID: projectList[i].notes.length });
                localStorage.setItem('projectList', JSON.stringify(projectList));
                console.log('Note Added');
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
    if (projectList.slice(0, 4).some(project => project.id == currentProject || currentProject == undefined)) {
        displayNoteInputButton.style.display = 'none';
    }

    // Render Notes Method
    function renderNotes() {

        // Relocate Notes based on Date as Time Passes
        function updateDefaultProjectNotesByDate() {
            const todayProjectNotes = projectList[0].notes;
            const weekProjectNotes = projectList[1].notes;
            const monthProjectNotes = projectList[2].notes;
            const yearProjectNotes = projectList[3].notes;

            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const today = new Date();
            const startOfWeek = new Date(today);
            const endOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + 1);
            endOfWeek.setDate(today.getDate() - today.getDay() + 7);

            for (let o = weekProjectNotes.length - 1; o >= 0; o--) {
                const noteDate = new Date(weekProjectNotes[o].date + 'T23:59:59');
                if (noteDate && isEqual(startOfDay(new Date(noteDate.toUTCString())), startOfDay(new Date(today.toUTCString())))) {
                    todayProjectNotes.push(weekProjectNotes[o]);
                    weekProjectNotes.splice(o, 1);
                    localStorage.setItem('projectList', JSON.stringify(projectList));
                }
            }

            for (let k = monthProjectNotes.length - 1; k >= 0; k--) {
                const noteDate = new Date(monthProjectNotes[k].date);
                if (noteDate && noteDate >= startOfWeek && noteDate <= endOfWeek) {
                    weekProjectNotes.push(monthProjectNotes[k]);
                    monthProjectNotes.splice(k, 1);
                    localStorage.setItem('projectList', JSON.stringify(projectList));
                }
            }

            for (let i = yearProjectNotes.length - 1; i >= 0; i--) {
                const noteDate = new Date(yearProjectNotes[i].date);
                if (noteDate && noteDate.getMonth() === currentMonth && noteDate.getFullYear() === currentYear) {
                    monthProjectNotes.push(yearProjectNotes[i]);
                    yearProjectNotes.splice(i, 1);
                    localStorage.setItem('projectList', JSON.stringify(projectList));
                }
            }
        }
        updateDefaultProjectNotesByDate();


        // Prevent Duplicate Notes
        const duplicateNotes = document.querySelectorAll('.note');
        duplicateNotes.forEach((note) => {
            notesContainerElement.removeChild(note);
        })

        // Iterate through ProjectNotes and Render
        for (let i = 0; i < projectList.length; i++) {
            // If Note Was Deleted & Existed in Default Project, Remove from Default Project
            for (let k = 0; k < projectList[i].notes.length; k++) {
                const defaultProjects = projectList.slice(0, 4);
                if (defaultProjects.some(project => project.notes.some(note => note.task === projectList[i].notes[k].task)) &&
                    !projectList.slice(4).some(project => project.notes.some(note => note.task === projectList[i].notes[k].task))) {
                    projectList[i].notes.splice(projectList[i].notes.indexOf(projectList[i].notes[k]), 1);
                    console.log('Note in Other, Deleted in Default');
                }
            }

            if (projectList[i].id == currentProject) {
                for (let j = 0; j < projectList[i].notes.length; j++) {
                    // Create Note
                    const note = document.createElement('div');
                    note.classList.add('note');
                    note.textContent = projectList[i].notes[j].task;
                    notesContainerElement.appendChild(note);

                    // Update Calendar Method
                    function updateCalendar() {
                        console.log('Updating Note Date..');

                        let previousNote = projectList[i].notes[j];
                        let previousDate = '';
                        if (previousNote.date !== noteCalendar.value) {
                            previousDate = previousNote.date;
                        }

                        // Update Note in Other Projects, with New Date when Changed in Default Project
                        const otherProjects = projectList.slice(4);
                        for (let t = 0; t < otherProjects.length; t++) {
                            const notes = otherProjects[t].notes;
                            for (let f = 0; f < notes.length; f++) {
                                console.log('Changing Note Date in Other Project...');
                                if (notes[f].projectNoteID === previousNote.projectNoteID && notes[f].noteID === previousNote.noteID && notes[f].date !== noteCalendar.value) {
                                    notes[f].date = noteCalendar.value;
                                    console.log('Note Changed in Other Project');
                                }
                                else {
                                    console.log('Note IDs Did Not Match when Replacing Other Note Dates')
                                }
                            }
                        }

                        // Set New Note
                        console.log('Setting Date...');
                        if (projectList[i].notes[j]) {
                            projectList[i].notes[j].date = noteCalendar.value;
                        }
                        console.log('Date Set');

                        // Check Date, Push Note to Default Project based on Date
                        // Sets Time 'T23..' to prevent Time Zone OffSet
                        let noteDate = '';
                        if (projectList[i].notes[j]) {
                            noteDate = new Date(projectList[i].notes[j].date + 'T23:59:59');
                        }
                        else {
                            noteDate = new Date(noteCalendar.value + 'T23:59:59');
                        }
                        const today = new Date();
                        // Passes Today as Reference Point to Current Day
                        const startOfWeek = new Date(today);
                        const endOfWeek = new Date(today);

                        // Subtracts Day of the Month from Day of the Week to get the Start & End of the Week
                        // Example : 17th of the Month - 5th Day of the Week (Friday) = 12th Day + 1 (13th Day)
                        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                        endOfWeek.setDate(today.getDate() - today.getDay() + 7);

                        // Push Notes to Corresponding Default Project based on Selected Date
                        if (isEqual(startOfDay(new Date(noteDate.toUTCString())), startOfDay(new Date(today.toUTCString())))) {
                            if (projectList[i].notes[j]) {
                                projectList[0].notes.push(previousNote);
                                console.log('Scheduled for Today with Existing Note');
                                console.log('Note Appended : ', projectList[i].notes[j]);
                            }
                            else {
                                projectList[0].notes.push({ task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                                console.log('Scheduled for Today without Existing Note');
                                console.log('Note Appended : ', { task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                            }
                        } else if (noteDate >= startOfWeek && noteDate <= endOfWeek) {
                            if (projectList[1]) {
                                if (projectList[i].notes[j]) {
                                    projectList[1].notes.push(previousNote);
                                    console.log('Scheduled for This Week with Existing Note');
                                    console.log('Note Appended : ', previousNote);
                                }
                                else {
                                    projectList[1].notes.push({ task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                                    console.log('Scheduled for This Week without Existing Note');
                                    console.log('Note Appended : ', { task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                                }
                            } else {
                                console.error('Unable to add note to this week - projectList[1] is undefined');
                            }
                        } else if (noteDate.getMonth() === today.getMonth() && noteDate.getFullYear() === today.getFullYear()) {
                            if (projectList[2]) {
                                if (projectList[i].notes[j]) {
                                    projectList[2].notes.push(previousNote);
                                    console.log('Scheduled for This Month with Existing Note');
                                    console.log('Note Appended : ', projectList[i].notes[j]);
                                }
                                else {
                                    projectList[2].notes.push({ task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                                    console.log('Scheduled for This Month without Existing Note');
                                    console.log('Note Appended : ', { task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                                }
                            } else {
                                console.error('Unable to add note to this month - projectList[2] is undefined');
                            }
                        } else if (noteDate.getFullYear() === today.getFullYear()) {
                            if (projectList[3]) {
                                if (projectList[i].notes[j]) {
                                    projectList[3].notes.push(previousNote);
                                    console.log('Scheduled for This Year with Existing Note');
                                    console.log('Note Appended : ', projectList[i].notes[j]);
                                }
                                else {
                                    projectList[3].notes.push({ task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                                    console.log('Scheduled for This Year without Existing Note');
                                    console.log('Note Appended : ', { task: previousNote.task, date: noteCalendar.value, projectNoteID: previousNote.projectNoteID, noteID: previousNote.noteID });
                                }
                            } else {
                                console.error('Unable to add note to this year - projectList[3] is undefined');
                            }
                        }

                        // Delete Previous Note from Default Projects if Date Changed
                        function deletePreviousNote() {
                            console.log('Deleting Previous Note...');
                            const defaultProjects = projectList.slice(0, 4);
                            for (let g = 0; g < defaultProjects.length; g++) {
                                const index = defaultProjects[g].notes.findIndex(note => note == previousNote);
                                if (index !== -1) {
                                    defaultProjects[g].notes.splice(index, 1);
                                    break;
                                }
                            }
                        }
                        if (previousDate !== noteCalendar.value && previousDate !== '') {
                            deletePreviousNote();
                            console.log('Previous Note Deleted');
                        }
                        else {
                            console.log('Previous Date is Equal to Calendar Value, Previous Note Deletion Failed');
                        }

                        // Update Local projectList
                        localStorage.setItem('projectList', JSON.stringify(projectList));
                        renderNotes();
                        console.log('Date Updated');
                    }

                    // Delete Note Method
                    function deleteNote() {
                        console.log('Deleting Note...');
                        // Reference to Deleted Note
                        const deletedNote = projectList[i].notes[j];
                        // J points to Index of Note in ForLoop
                        projectList[i].notes.splice(j, 1);
                        // If Note Was Deleted from Default Project, Delete Note in Other Projects
                        const defaultProjects = projectList.slice(0, 4);
                        const otherProjects = projectList.slice(4);
                        // If Note was Deleted from a Default Project
                        if (defaultProjects.some(project => project.id === projectList[i].id)) {
                            for (let o = 0; o < otherProjects.length; o++) {
                                const index = otherProjects[o].notes.indexOf(deletedNote);
                                if (index !== -1) {
                                    otherProjects[o].notes.splice(index, 1);
                                }
                            }
                        }

                        // Update Local projectList
                        localStorage.setItem('projectList', JSON.stringify(projectList));
                        console.log('Note Deleted');
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
- Some Array Method can Help Access Nested Properties to test Conditional Statements
- Using an Array Length as an ID Reference Point
- Creating an Index for Splice Array Methods using the index of a forLoop as a Reference Point
- IndexOf Method returns -1 when Element Not Found; Can Cause Unintended Behavior; Example : Removing Last Element from within a Splice Method
- When Removing Elements using a forLoop it's Best Practice to Decrease the Iterator not Increase

Notes
- Duplicate Function Calls : Check Inner Functions for Multiple Invocations
- Array Methods returning Undefined : Check Access (Array or Array Element)
- Could Have Added Type to Project : Default or Personal
- Slice Method - Returns a Shallow Copy of an Array (Does Not Mutate)
- Splice Method - Mutates Original Array (Deleting or Replacing Elements)

BUGS
- Input Stays on Display if No Note was Added

TO-D0
- Add All Notes to an All Projects Default Project - Iterate through all Projects & Push Notes, Re-Renders
- Sort Notes in AllNotesDefaultProject by Date
- Add Edit Note Action - RenderNotes Edit Button, Change Note Titles in All Default Projects
- Click on Default Project Row to Switch instead of H1
- Begin Thinking About Design Layout
*/


