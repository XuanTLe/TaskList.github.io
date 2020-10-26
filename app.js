// Define UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// Load all event listeners: here we call the function
loadEventLister();

// Load all event listeners: here we define loadEventLister()
function loadEventLister(){
  // DOM Load event: DOMContentLoaded event fires off when DOM is loaded (or reload)
  // So when call getTasks, after reload, all tasks still display because getTasks fn get tasks from local storage
  document.addEventListener('DOMContentLoaded', getTasks);
  // Add task event
  form.addEventListener('submit', addTask); // call addTask function when submit 'Add Task' 

  // Remove task event: use event delegation here, so grab tasklist (ul) and perform removeTask function on li
  taskList.addEventListener('click', removeTask);

  // Clear task events
  clearBtn.addEventListener('click', clearTasks);

  // Filter task events. With each keyup = one letter, filtertasks function is called
  filter.addEventListener('keyup', filterTasks);
}

// Get Tasks from local storage
function getTasks(){
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    // if there is something in local storage, assign them in tasks array. Wrap JSON.parse around to convert string (in local storage) to object
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  // If the array get tasks from local storage, loop through each and create <li> with <a> and <i> (icon tag) to display
  // If the array is empty (local storage is empty) then the result is <li> with the X icon display with no text
  tasks.forEach(function(task){
    // Create li element
    const li = document.createElement('li');
    // Add class
    li.className = 'collection-item'; // materialize class
   // Create label element
    const text = document.createTextNode(task);
    const label = document.createElement('label');
    label.innerHTML = '<input type="checkbox" class="filled-in checkbox-color"/>';
    const span = document.createElement('span');
    span.appendChild(text);
    label.appendChild(span);
    li.appendChild(label);
    // Add task (from local storage) and append to li
    //li.appendChild(document.createTextNode(task));
    // Create new link element <a>
    const link = document.createElement('a');
    // Add class to link
    link.className = 'delete-item secondary-content'; // ma. classes
    // Add icon html to link: icon here is the X
    link.innerHTML = '<i class="fa fa-trash"></i>'; 
    // Append the link to li
    li.appendChild(link);

    // Append li to ul
    taskList.appendChild(li);
  });
}

// Add Task: define addTask function here
function addTask(e) {
  if (taskInput.value === '') {
    alert('Add a task');
  }

  // Create li element
  const li = document.createElement('li');
  // Add class
  li.className = 'collection-item'; // materialize class
  // Create label element
  const text = document.createTextNode(taskInput.value);
  const label = document.createElement('label');
  label.innerHTML = '<input type="checkbox" class="filled-in checkbox-color"/>';
  const span = document.createElement('span');
  span.appendChild(text);
  label.appendChild(span);
  // Add text node (input value - 1 task) and append to li
  // li.appendChild(document.createTextNode(taskInput.value));
  li.appendChild(label);
  // Create new link element <a>
  const link = document.createElement('a');
  // Add class to link
  link.className = 'delete-item secondary-content'; // ma. classes
  // Add icon html to link: icon here is the X
  link.innerHTML = '<i class="fa fa-trash"></i>'; 
  // Append the link to li
  li.appendChild(link);

  // Append li to ul
  taskList.appendChild(li);

  // Store input value (one task) in Local storage
  storeTaskInLocalStorage(taskInput.value);

  // Clear input
  taskInput.value = '';

  e.preventDefault();
}

// Store Task: task argument passed in the fn is input value - 1 task
function storeTaskInLocalStorage(task) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    // if there is something in local storage, assign them in tasks array. Wrap JSON.parse around to convert string (in local storage) to object
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.push(task); // push input value - 1 task to the array

  // set array (with new input value) to local storage 
  // wrap JSON.stringify aroung to convert objects to strings before store in local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove Task: define function
function removeTask(e) {
  // if parentElment <a> of e.target (<i>: icon tag) contains class .delete-item, remove <li>. Confirm before remove
  if (e.target.parentElement.classList.contains('delete-item')) {
    if (confirm('Are You Sure?')) {
      e.target.parentElement.parentElement.remove(); // remove <li>

      // Remove from Local storage: here we call fn
      removeTaskFromLocalStorage(e.target.parentElement.parentElement);
    }
  }
}

// Remove from Local storage: define fn here
// taskItem argument passed in is the <li> that is removed from the DOM (in removeTask fn)
function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    // if there is something in local storage, assign them in tasks array. Wrap JSON.parse around to convert string (in local storage) to object
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  // If tasks array have been assigned tasks from LS,
  // for each task in the array, check to see if it is equal to taskItem (task removed only from DOM) 
  // If yes, splice it out in the array
  // splice(index, howmany, item1, ...., itemX):
  // index: an integer that specifies at what position to add/remove items, Use negative values to specify the position from the end of the array
  // howmany: optional; the number of items to be removed starting from index
  // item1, ..., itemX: optional; the new item(s) to be added 
  tasks.forEach(function(task, index){
    if (taskItem.textContent === task){
      tasks.splice(index, 1);
    }
  });

  // set array (with task removed) to LS
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear Tasks
function clearTasks() {
  // taskList.innerHTML = '';

  // Faster way
  // check to see if there is any child in taskList 
  // (taskList.firstChild) returns true or false
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild); // if true, remove that child
  }

  // Reference:
  // https://jsperf.com/innerhtml-vs-removechild

  // Clear from LS
  clearTasksFromLocalStorage();
}

// Clear Tasks from LS
function clearTasksFromLocalStorage(){
  localStorage.clear();
}

// Filter Tasks
function filterTasks(e) {
  // e.target is the input field of filter. 
  // e.target.value is the letter after immediate keyup
  // assign this letter to text variable
  const text = e.target.value.toLowerCase();
  
  // querySelectorAll return node list, so we can use forEach
  // loop through the lis. For each li, we call task
  document.querySelectorAll('.collection-item').forEach(function(task){
    // task has two child elements. First is text content, second is <a>. So choose firstChild and select its text content then assign to item variable 
    const item = task.firstChild.textContent;
    // convert the text content to lower case then check if there exists the input letter in this text content. 
    // remind you that the input letter assigned to variable text 
    // indexOf(text)!= -1 means letter exists.
    // indexOf(text) = -1 means letter doesn't exist
    if (item.toLowerCase().indexOf(text) != -1){
      task.style.display = 'block'; // if letter exists, display the whole li
    } else {
      task.style.display = 'none'; // else don't display
    }
  });

}

