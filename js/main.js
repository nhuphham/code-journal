const photoUrl = document.getElementById('photoUrl');
const img = document.querySelector('img');
photoUrl.addEventListener('input', event => {
  img.setAttribute('src', event.target.value);
});

const form = document.querySelector('form');
const entriesRaw = localStorage.getItem('entries');
let entries = [];

if (entriesRaw !== null) {
  entries = JSON.parse(entriesRaw);
}
let entryId = 0;
form.addEventListener('submit', event => {
  event.preventDefault();
  const results = {
    title: form.elements.title.value,
    photoUrl: form.elements.photoUrl.value,
    notes: form.elements.notes.value,
    entryId: entryId++
  };
  entries.unshift(results);
  img.setAttribute('src', 'images/placeholder-image-square.jpg');
  form.reset();

  const entriesToStorage = JSON.stringify(entries);
  localStorage.setItem('entries', entriesToStorage);

});
