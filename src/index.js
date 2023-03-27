import './main.css';

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

    // Reference Point to Type of Projects
    const defaultProjects = projectList.slice(0, 5);
    const personalProjects = projectList.slice(5);

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
                console.log('SWITCHED');
                // Invoke Note Manager to Render New Notes
            }

            projectElement.addEventListener('click', switchProject);

            // Create Delete Project Button
            const deleteProjectButton = document.createElement('button');
            deleteProjectButton.textContent = 'Delete';
            deleteProjectButton.addEventListener('click', deleteProject);

            if (!defaultProjects.some(project => project.id == projectList[i].id)) {
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
}


function noteManager() { };