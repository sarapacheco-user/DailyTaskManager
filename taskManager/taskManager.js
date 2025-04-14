// Recupera as tarefas do localStorage ou cria um array vazio
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  
  // Ordena as tarefas pela prioridade (maior número = maior prioridade)
  tasks.sort((a, b) => b.priority - a.priority);
  
  // Limpa a lista antes de renderizar
  taskList.innerHTML = '';
  
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${task.text} <span class="priority">(Prioridade: ${task.priority === 3 ? 'Alta' : task.priority === 2 ? 'Média' : 'Baixa'})</span></span>
      <button onclick="deleteTask(${index})">Excluir</button>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const priorityInput = document.getElementById('priorityInput');
  const taskText = taskInput.value.trim();
  const priority = parseInt(priorityInput.value);

  if (taskText === '') {
    alert("Digite uma tarefa!");
    return;
  }

  tasks.push({ text: taskText, priority: priority });
  saveTasks();
  renderTasks();

  // Limpa o campo de entrada
  taskInput.value = '';
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

document.getElementById('addTaskBtn').addEventListener('click', addTask);

renderTasks();
