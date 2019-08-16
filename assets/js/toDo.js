let input = document.querySelector("#new-to-do");                                                   //Get the input
let todoItems = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];     //Check if items exist in the local storage and assign them to the todoItems array
const list = document.querySelector('#todo-list');                                                  //Get the todo list
const toggle = document.querySelector('#toggle');                                                   //Get the + button


localStorage.setItem('items', JSON.stringify(todoItems));                                           //Set the 'items' key to the string form of the todoItems array

const hideInput = _ => {                                                                            //Hide the input by toggling the '.hide' css class
    input.classList.toggle('hide');
    input.focus();
} 

const addTodo = (text) => {                                                                         //Add a new todo
    const todo = {                                                                                  //Declare an object constructor with three properties
        text,
        checked: false,
        id: Date.now()
    };

todoItems.push(todo);                                                                               //Push each object to the array
    localStorage.setItem('items', JSON.stringify(todoItems));
    list.insertAdjacentHTML('beforeend', `
        <div class="list" data-key="${todo.id}" id="${todo.id}" >
        <span class="trash" data-key="${todo.id}"><i class="delete-todo far fa-trash-alt"></i></span>
        <span class="text">${todo.text}</span>
        </div>`
    );                                                                                              //Display each object on the screen
    
}

const toggleDone = key => {                                                                         //Toggle each item done
    const index = todoItems.findIndex(item => item.id === Number(key));                             //Set the index const to the first item that satisfies the callback func
    todoItems[index].checked = !todoItems[index].checked;                                           //if it is checked, set it unchecked
  
    const item = document.querySelector(`[data-key='${key}']`);
    if (todoItems[index].checked) {                                                                 //Toggle the css class to display it on screen
      item.classList.add('done');
    } else {
      item.classList.remove('done');
    }
}

const deleteTodo = key => {                                                                         //Delete todos using the same logic
    todoItems = todoItems.filter(item => item.id !== Number(key));
    const item = document.querySelector(`[data-key='${key}']`);
    item.remove();
    if (todoItems.length === 0) list.innerHTML = '';
}

const saveData = dataArr => {                                                                       //Restore the list items when the page refreshes 
    dataArr.forEach(item => {
        list.insertAdjacentHTML('beforeend', `
        <div class="list" data-key="${item.id}" id="${item.id}" >
        <span class="trash" data-key="${item.id}"><i class="delete-todo far fa-trash-alt"></i></span>
        <span class="text">${item.text}</span>
        </div>`
    );
    });
}

toggle.addEventListener('click', _ => {                                                             //hideInput event listener
    hideInput();
});

saveData(todoItems);                                                                                //pass the todoItems array into the restorer

input.addEventListener('keypress', (event) => {                                                     //run the addTodo func based on the conditions
    if(event.keyCode === 13){                                                                       //when the user presses the enter key
        const text = input.value.trim();                                                            //trim the value of the input of any whitespaces
        if(text !== ''){                                                                            
            addTodo(text);
            input.value = '';
            input.focus();
        }
    }            
});

list.addEventListener('click', event => {                                                           //run the toggleDone and deleteTodo on the whole list and use the event object
    if(event.target.classList.contains('text')){
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }
    
    if(event.target.classList.contains('delete-todo')){
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
        localStorage.setItem('items', JSON.stringify(todoItems));
        input.focus();
    }
});

