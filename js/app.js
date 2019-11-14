/*
 * Quill editor
 *************/

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote'],

    [{
        'header': 1
    }, {
        'header': 2
    }], // custom button values
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }],
    [{
        'script': 'sub'
    }, {
        'script': 'super'
    }], // superscript/subscript
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }], // outdent/indent
    [{
        'direction': 'rtl'
    }], // text direction

    , // custom dropdown
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],

    [{
        'color': []
    }, {
        'background': []
    }], // dropdown with defaults from theme,
    [{
        'align': []
    }],

    ['clean'] // remove formatting button
];


//Init editor
var Delta = Quill.import('delta');
var quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow'

});

/*
 * Note list
 ***********/

let noteList = [];

activeId = false;

/* 
 * Buttons
 ***********/
let saveNoteBtn = document.getElementById('save-note');
let deleteNotebtn = document.getElementById('delete-note');
let loadNotebtn = document.getElementById('load-note');

saveNoteBtn.addEventListener("click", saveNote);
loadNotebtn.addEventListener("click", renderNote);
deleteNotebtn.addEventListener("click", deleteNote);

/* 
 * Save, load, delete functions
 *******************************/

function saveToLocalStorage() {
    localStorage.setItem("noteList", JSON.stringify(noteList));
    console.log('saved noteList to LS');
}

function loadFromLocalStorage() {
    let noteListString = localStorage.getItem("notelist");
    let notelist = JSON.parse(noteListString);
    if (!notelist) {
        notelist = [];
        console.log('Notelist set to []');
    }
    console.log('loaded noteList from LS');
}

function renderNote(note){
    activeId = note.id;
    console.log('Active id set to '+note.id);
}

function saveNote() {
    // If id exists in noteList, overwrite orig with updated. 
    let orig = noteList.find(item => item.id == activeId) || false;

    if (orig) {
        console.log('Updating orig in noteList');
        let updatedContent = quill.getContents();
        noteList.splice(noteList.indexOf(orig), 1, updatedContent);
    } else {
        // Otherwhise, add updated as new.
        console.log('Saving new note to noteList');
        let noteObj = {
            favorite: false,
            text: quill.getContents(),
            content: quill.getText(0, 30),
            id: Date.now(),
            title: document.getElementById("title-input").value,
        }

        activeId = noteObj.id;

        noteList.push(noteObj);
    }
    saveToLocalStorage();
    
}

function deleteNote(note) {
    // jämför note.id med id:n i noteList
    // vid match, ta bort notelist[x] ur noteList
    notelist.forEach(function(item, i){
        if (note.id === item.id) {
            noteList.splice(i, 1)
        }
    });
    console.log('Note deleted');
    // spara
    saveToLocalStorage();
}

function deleteTextFromDOM() {
    quill.deleteText(0, 999);
}

/*
 * Popup 
 ***********/

/*(() => { // Runs directly in local scope
    // show welcome popup?
    const popup = document.querySelector(".popup");
    const blur = document.querySelector(".blur");
    const visited = isStored('myNotes'); // Check if first time user (previously stored notes)
    //
    const welcome = () => {
        if (!visited) {
            popup.classList.remove("hidden");
            blur.classList.remove("hidden");
        }
    }
    welcome();
})(); // local scope*/ 





// DOCUMENT CLICK-LISTENER
document.addEventListener("click", function (e) {
    // close welcome popup?
    if (e.target.id === 'closeWelcome') {
        e.target.parentElement.classList.add("hidden");
    }

    // nav?
    const subnav = document.querySelector('#side-subnav');
    if (e.target.parentElement.classList.contains('button-sidebar')) {
        openSubnav(e);
        // if not nav/subnav, but subnav is open, close subnav
    } else if (e.target !== subnav && !subnav.contains(e.target)) {
        if (this.querySelector('#side-subnav').dataset.open) {
            closeSubnav();
        }
    }
    // subnav closebtn?
    if (e.target.classList.contains('closebtn') && e.target.parentElement.id == 'side-subnav') {
        closeSubnav();
    }

    // load note? (make this smarter?)
    if (e.target.classList.contains('note') && e.target.dataset.id) {
        loadNote(e.target.dataset.id);
    } else if (e.target.parentElement.classList.contains('note') && e.target.parentElement.dataset.id) {
        loadNote(e.target.parentElement.dataset.id);
    } else if (e.target.parentElement.parentElement.classList.contains('note') && e.target.parentElement.parentElement.dataset.id) {
        loadNote(e.target.parentElement.parentElement.dataset.id);
    }

    // clear storage? (dev func)
    if (e.target.id == 'clearStorage') {
        tinymce.activeEditor.setContent(clearStorage());
        displayMsg('Storage cleared!');
    }
    //console.log(e);
});