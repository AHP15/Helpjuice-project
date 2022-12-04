
const filterList = document.querySelector('.filter-list');
const list = document.querySelector('.list');
const form = document.querySelector('form');
const input = document.querySelector('input');
const titles = document.querySelector('.titles');

const headingFilter = [
  {type: 'Heading 1', shortcut: '# + space'},
  {type: 'Expandable Heading 1', shortcut: '>># + space'},
  // We can add more headings :)
];
const headings = JSON.parse(localStorage.getItem('headings')) ?? [];

const renderHeadings = () => {
  headings.forEach(heading => titles.insertAdjacentHTML('beforeend', `<h1>${heading}</h1>`));
};

renderHeadings();

// I can make the src attr inside the img tag dynamic from the item param
const filterItem = (item) => `
<div class="filter-item">
  <div class="image">
    <img src="./media/text.png" alt="text icon" /> 
  </div>
  <div class="info">
    <h4>${item.type}</h4>
    <p class="desc">Shortcut: type ${item.shortcut}</p>
  </div>
</div>
`;

form.addEventListener('input', (e) => {
  const text = e.target.value;
  const length = text.length;
  const lastCharacter = text[length - 1];
  const secondLastCharacter = text[length - 2];
  // if the user did not type any / and then 1: hide the filterlist and just return
  if(length < 2 || lastCharacter !== '1' || secondLastCharacter !== '/') {
    filterList.classList.remove('show-filter');
    return;
  };
  
  list.replaceChildren('');
  headingFilter.forEach(heading => {
    list.insertAdjacentHTML('beforeend', filterItem(heading));
  });

  const items = document.querySelectorAll('.filter-item');
  headingFilter.forEach((heading, i) => items[i].addEventListener('click', () => {
    input.classList.add('heading');
    input.focus();
    const value = input.value;
    input.value = value.slice(0, -2); // remove the two last characters (/ and 1)
    input.setAttribute('placeholder', heading.type);
    filterList.classList.remove('show-filter');
  }));
  filterList.classList.add('show-filter');

});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const { heading }  = form;
  // if the value of the input is empty or the user did not indicate that this is 
  // a heading yet just return
  if(heading.value === '' || !heading.classList.contains('heading')) return;

  // added it the dom
  titles.insertAdjacentHTML('beforeend', `<h1>${heading.value}</h1>`);
  
  // change the input UI
  heading.value = '';
  heading.setAttribute('placeholder', 'Type / for blocks, @ to links docs or people')
  heading.classList.remove('heading');

  // store in localStorage
  const old = JSON.parse(localStorage.getItem('headings')) ?? [];
  localStorage.setItem('headings', JSON.stringify([...old, heading.value]));
});