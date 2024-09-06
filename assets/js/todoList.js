// Select the necessary DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const completeAllBtn = document.getElementById('complete-all-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const itemsLeft = document.getElementById('items-left');

// Array to store todo items
let todos = [];

// Initialize the app
function init() {
    loadTodos();
    renderTodos();
}

// Update the items left counter
const updateItemsLeft = () => {
    const itemsLeftCount = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = `${itemsLeftCount} items left`;
};

// Load todos from localStorage
const loadTodos = () => {
    const storedTodos = localStorage.getItem('todos');
    todos = storedTodos ? JSON.parse(storedTodos) : [];
};

// Save todos to localStorage
const saveTodos = () => localStorage.setItem('todos', JSON.stringify(todos));

// Render the todo list
const renderTodos = () => {
    todoList.innerHTML = todos.map((todo, index) => createTodoItem(todo, index)).join('');
    updateItemsLeft();
};

// Create a todo list item HTML string
const createTodoItem = (todo, index) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
        ${createCheckbox(todo, index)}
        ${todo.editing ? createTodoEditInput(todo.text, index) : createTodoTextElement(todo.text, todo.completed)}
        ${createButtonContainer(index, todo.editing)}
    </li>
`;

// Create a checkbox element
const createCheckbox = (todo, index) => `
    <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="toggleTodoComplete(${index})">
`;

// Create a text element for a todo item
const createTodoTextElement = (text, completed) => `
    <span class="todo-text ${completed ? 'completed' : ''}">${text}</span>
`;

// Create an input element for editing a todo
const createTodoEditInput = (text, index) => `
    <input type="text" class="form-control editing-input" value="${text}" 
           onblur="saveEdit(${index}, this.value)" onkeyup="handleEditKeyup(event, ${index}, this)">
`;

// Handle keyup events in edit mode
function handleEditKeyup(event, index, input) {
    if (event.key === 'Enter') saveEdit(index, input.value);
    else if (event.key === 'Escape') cancelEdit(index);
}

// Create a container with buttons for each todo item
const createButtonContainer = (index, isEditing) => `
    <div class="button-container">
        <button class="btn btn-sm btn-link text-white ${isEditing ? 'btn-outline-success' : 'btn-outline-warning'}" 
                onclick="${isEditing ? `saveEdit(${index}, document.querySelector('.editing-input').value)` : `editTodoItem(${index})`}">
            ${isEditing ? 'Save' : 'Edit'}
        </button>
        <button class="btn btn-sm btn-link text-white btn-outline-danger" onclick="deleteTodoItem(${index})">Delete</button>
    </div>
`;

// Add a new todo
const addTodoItem = text => {
    todos.push({ text, completed: false, editing: false });
    saveTodos();
    renderTodos();
};

// Edit a todo
const editTodoItem = index => {
    todos = todos.map((todo, i) => ({ ...todo, editing: i === index }));
    renderTodos();
};

// Save edits to a todo
const saveEdit = (index, newText) => {
    todos = todos.map((todo, i) => i === index ? { ...todo, text: newText.trim() || todo.text, editing: false } : todo);
    saveTodos();
    renderTodos();
};

// Cancel editing a todo
const cancelEdit = index => {
    todos = todos.map((todo, i) => i === index ? { ...todo, editing: false } : todo);
    renderTodos();
};

// Delete a todo
const deleteTodoItem = index => {
    todos = todos.filter((_, i) => i !== index);
    saveTodos();
    renderTodos();
};

// Toggle todo completion status
const toggleTodoComplete = index => {
    todos = todos.map((todo, i) => i === index ? { ...todo, completed: !todo.completed } : todo);
    saveTodos();
    renderTodos();
};

// Mark all todos as completed
const markAllComplete = () => {
    todos = todos.map(todo => ({ ...todo, completed: true }));
    saveTodos();
    renderTodos();
};

// Uncheck all completed todos
const clearCompletedTodos = () => {
    todos = todos.map(todo => ({ ...todo, completed: false }));
    saveTodos();
    renderTodos();
};

// Event listeners
todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTodoText = todoInput.value.trim();
    if (newTodoText) addTodoItem(newTodoText);
    todoInput.value = '';
});

completeAllBtn.addEventListener('click', markAllComplete);
clearCompletedBtn.addEventListener('click', clearCompletedTodos);

// Initial setup
init();
