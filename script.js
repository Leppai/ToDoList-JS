const form = document.querySelector(".todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");

let todos = [];


function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}


function loadTodos() {

    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }

}


function renderTodos() {

    todoList.innerHTML = "";

    todos.forEach(function(todo) {

        const li = document.createElement("li");

        li.classList.add("todo-item");

        if (todo.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input 
                type="checkbox"
                ${todo.completed ? "checked" : ""}
            >

            <span>${todo.text}</span>

            <button class="edit-button">
                ✏️
            </button>

            <button class="delete-button">
                🗑
            </button>
        `;

        li.dataset.id = todo.id;

        todoList.appendChild(li);

    });

    updateCounter();
}


function updateCounter() {

    const activeCount = todos.filter(function(todo) {
        return !todo.completed;
    }).length;

    todoCount.textContent =
        `${activeCount} tugas tersisa`;
}


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const task = input.value.trim();

    if (task === "") {
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: task,
        completed: false
    };

    todos.push(newTodo);

    saveTodos();

    renderTodos();

    input.value = "";
});


todoList.addEventListener("click", function(event) {

    const todoItem = event.target.parentElement;

    const id = Number(todoItem.dataset.id);


    // EDIT
    if (event.target.classList.contains("edit-button")) {

        const todo = todos.find(function(todo) {
            return todo.id === id;
        });

        const newTask = prompt(
            "Edit task:",
            todo.text
        );

        if (newTask === null) {
            return;
        }

        if (newTask.trim() === "") {
            return;
        }

        todo.text = newTask.trim();

        saveTodos();

        renderTodos();
    }


    // DELETE
    if (event.target.classList.contains("delete-button")) {

        todos = todos.filter(function(todo) {
            return todo.id !== id;
        });

        saveTodos();

        renderTodos();
    }

});


todoList.addEventListener("change", function(event) {

    if (event.target.type === "checkbox") {

        const todoItem = event.target.parentElement;

        const id = Number(todoItem.dataset.id);

        const todo = todos.find(function(todo) {
            return todo.id === id;
        });

        todo.completed = event.target.checked;

        saveTodos();

        renderTodos();
    }

});



const filterButtons =
    document.querySelectorAll(".filter-button");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const filter = button.dataset.filter;

        const todoItems =
            document.querySelectorAll(".todo-item");

        todoItems.forEach(function(todoItem) {

            const isCompleted =
                todoItem.classList.contains("completed");

            if (filter === "all") {
                todoItem.style.display = "flex";
            }

            if (filter === "active") {

                if (isCompleted) {
                    todoItem.style.display = "none";
                } else {
                    todoItem.style.display = "flex";
                }

            }

            if (filter === "completed") {

                if (isCompleted) {
                    todoItem.style.display = "flex";
                } else {
                    todoItem.style.display = "none";
                }

            }

        });

        filterButtons.forEach(function(button) {
            button.classList.remove("active");
        });

        button.classList.add("active");

    });

});


loadTodos();

renderTodos();