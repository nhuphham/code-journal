const photoUrl = document.getElementById('photoUrl');
const img = document.querySelector('img');
photoUrl.addEventListener('input', event => {
  img.setAttribute('src', event.target.value);
});

const form = document.querySelector('form');
const placeholderForm = document.getElementById('placeholder-form');
const entriesHTML = document.getElementById('entries');
const entriesRaw = localStorage.getItem('entries');
let entries = [];

if (entriesRaw !== null) {
  entries = JSON.parse(entriesRaw);
}

form.addEventListener('submit', event => {
  let entryId = entries.length;
  event.preventDefault();
  const results = {
    title: form.elements.title.value,
    photoUrl: form.elements.photoUrl.value,
    notes: form.elements.notes.value,
    entryId: entryId++
  };

  const editingKey = localStorage.getItem('editing');
  editingKey !== 'null' ? entries[editingKey] = { ...results, entryId: editingKey } : entries.push(results);
  resetForm();

  const entriesToStorage = JSON.stringify(entries);
  localStorage.setItem('entries', entriesToStorage);
  const columnFull = document.getElementById('entry-root');
  editingKey !== 'null' ? addEntries() : columnFull.prepend(addEntry(results));
  localStorage.setItem('editing', null);
  !form.classList.contains('hidden') && form.classList.add('hidden');
  entriesHTML.classList.contains('hidden') && entriesHTML.classList.remove('hidden');
  !deleteButton.classList.contains('hidden') && deleteButton.add('hidden');
});

function resetForm() {
  form.reset();
  img.setAttribute('src', 'images/placeholder-image-square.jpg');
  const titleInput = document.getElementById('title');
  const photoInput = document.getElementById('photoUrl');
  const notesInput = document.getElementById('notes');
  titleInput.setAttribute('value', '');
  photoInput.setAttribute('value', '');
  notesInput.textContent = '';
}

function addEntry(entry) {
  const ul = document.createElement('ul');
  const imageLi = document.createElement('li');
  const img = document.createElement('img');
  img.setAttribute('src', entry.photoUrl);
  ul.appendChild(imageLi).appendChild(img);
  const descripLi = document.createElement('li');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');
  h2.textContent = entry.title;
  p.textContent = entry.notes;
  const editIcon = document.createElement('i');
  editIcon.classList.add('fas');
  editIcon.classList.add('fa-pen');
  h2.appendChild(editIcon);
  descripLi.appendChild(h2);
  ul.appendChild(descripLi).appendChild(p);
  ul.setAttribute('data-entry-id', entry.entryId);
  !placeholderForm.classList.contains('hidden') && placeholderForm.classList.add('hidden');
  return ul;
}

function addEntries() {
  const columnFull = document.getElementById('entry-root');
  columnFull.innerHTML = '';
  columnFull.appendChild(placeholderForm);
  for (let i = entries.length - 1; i >= 0; i--) {
    columnFull.appendChild(addEntry(entries[i]));
  }
  if (entries.length > 0) {
    placeholderForm && placeholderForm.classList.add('hidden');
  }
}

window.addEventListener('DOMContentLoaded', event => {
  addEntries();
  if (localStorage.getItem('entries') === null) {
    localStorage.setItem('entries', JSON.stringify([]));
    entries = [];
  }
  if (localStorage.getItem('editing') === null) {
    localStorage.setItem('editing', 'null');
  }
});

const newButton = document.getElementById('new');
newButton.addEventListener('click', event => {

  form.classList.contains('hidden') && form.classList.remove('hidden');
  !entriesHTML.classList.contains('hidden') && entriesHTML.classList.add('hidden');
  !deleteButton.classList.contains('hidden') && deleteButton.classList.add('hidden');

});

const entriesHeader = document.getElementById('entries-header');
entriesHeader.addEventListener('click', event => {

  !form.classList.contains('hidden') && form.classList.add('hidden');
  entriesHTML.classList.contains('hidden') && entriesHTML.classList.remove('hidden');
  !deleteButton.classList.contains('hidden') && deleteButton.classList.add('hidden');

});

const columnFull = document.getElementById('entry-root');
const deleteButton = document.getElementById('delete-button');
const modal = document.getElementById('modal');
const cancelButton = document.getElementById('button-cancel');
const confirmButton = document.getElementById('button-confirm');

columnFull.addEventListener('click', event => {
  if (event.target.classList.contains('fa-pen')) {
    form.classList.contains('hidden') && form.classList.remove('hidden');
    !entriesHTML.classList.contains('hidden') && entriesHTML.classList.add('hidden');
    const entryId = event.target.parentElement.parentElement.parentElement.getAttribute('data-entry-id');
    localStorage.setItem('editing', entryId);
    const editEntry = entries.find(x => x.entryId.toString() === entryId);
    const titleInput = document.getElementById('title');
    const photoInput = document.getElementById('photoUrl');
    const notesInput = document.getElementById('notes');
    titleInput.setAttribute('value', editEntry.title);
    photoInput.setAttribute('value', editEntry.photoUrl);
    notesInput.textContent = editEntry.notes;
    img.setAttribute('src', editEntry.photoUrl);
    deleteButton.classList.contains('hidden') && deleteButton.classList.remove('hidden');
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
});

deleteButton.addEventListener('click', event => {
  modal.classList.contains('hidden') && modal.classList.remove('hidden');
});

cancelButton.addEventListener('click', event => {
  !modal.classList.contains('hidden') && modal.classList.add('hidden');
});

confirmButton.addEventListener('click', event => {
  const editingKey = localStorage.getItem('editing');
  const deleteMe = entries.findIndex(x => x.entryId === editingKey);
  entries.splice(deleteMe, 1);
  localStorage.setItem('entries', JSON.stringify(entries));
  addEntries();
  resetForm();
  localStorage.setItem('editing', null);
  !form.classList.contains('hidden') && form.classList.add('hidden');
  entriesHTML.classList.contains('hidden') && entriesHTML.classList.remove('hidden');
  !deleteButton.classList.contains('hidden') && deleteButton.classList.add('hidden');
  !modal.classList.contains('hidden') && modal.classList.add('hidden');
  entries.length === 0 && placeholderForm.classList.contains('hidden') && placeholderForm.classList.remove('hidden');
});
