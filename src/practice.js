function createContainer() {
    const container = document.createElement('div');
    container.setAttribute('id', 'container');
    return container;
}

function createSideMenu() {
    const sideMenu = document.createElement('div');
    sideMenu.setAttribute('id', 'sideMenu');
    return sideMenu;
}


function createNote() {
    const note = document.createElement('div');
    note.classList.add('note');
    return note;
}

function renderLayout() {
    const container = createContainer();
    const sideMenu = createSideMenu();
    const note = createNote();

    container.appendChild(sideMenu);
    container.appendChild(note);
}