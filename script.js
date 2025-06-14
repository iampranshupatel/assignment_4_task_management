// script.js

class Task {
  constructor({ id, title, description, category, priority, dueDate = '', completed = false }) {
    this.id          = id;
    this.title       = title;
    this.description = description;
    this.category    = category;
    this.priority    = priority;
    this.dueDate     = dueDate;
    this.completed   = completed;
  }
}

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }

  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  add(task) {
    this.tasks.push(task);
    this.save();
  }

  update(updated) {
    this.tasks = this.tasks.map(t => t.id === updated.id ? updated : t);
    this.save();
  }

  delete(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  clearCompleted() {
    this.tasks = this.tasks.filter(t => !t.completed);
    this.save();
  }

  filter({ category, search }) {
    return this.tasks.filter(t => {
      return (!category || t.category === category)
        && (!search || (t.title + t.description).toLowerCase().includes(search));
    });
  }
}

// UI HANDLERS
const mgr          = new TaskManager();
const form         = document.getElementById('task-form');
const list         = document.getElementById('task-list');
const notification = document.getElementById('notification');
const progressBar  = document.getElementById('progress-bar');

const idField       = document.getElementById('task-id');
const titleInput    = document.getElementById('title');
const descInput     = document.getElementById('description');
const dateInput     = document.getElementById('due-date');
const categoryInput = document.getElementById('category');
const priorityInput = document.getElementById('priority');

function notify(msg) {
  notification.textContent = msg;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3500);
}

function updateProgress() {
  const total = mgr.tasks.length;
  const done  = mgr.tasks.filter(t => t.completed).length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  progressBar.style.width = pct + '%';
}

function render() {
  const cat    = document.getElementById('filter-category').value;
  const search = document.getElementById('search').value.trim().toLowerCase();
  const tasks  = mgr.filter({ category: cat, search });

  list.innerHTML = '';
  tasks.sort((a, b) => ({ high:1, medium:2, low:3 })[a.priority] - ({ high:1, medium:2, low:3 })[b.priority])
       .forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.completed ? ' completed' : '');
    li.innerHTML = `
      <span class="title">${t.title}</span>
      <div class="controls">
        <button class="toggle">${t.completed ? '↺' : '✔'}</button>
        <button class="edit">✎</button>
        <button class="delete">🗑</button>
      </div>
      <span class="desc">${t.description || ''}</span>
      <span class="meta">
        ${t.category} • ${t.priority}
        ${t.dueDate ? ' • Due: ' + t.dueDate : ''}
      </span>
    `;

    // deletions
    li.querySelector('.delete').onclick = () => {
      mgr.delete(t.id);
      render();
      updateProgress();
    };

    // edits
    li.querySelector('.edit').onclick = () => {
      idField.value        = t.id;
      titleInput.value     = t.title;
      descInput.value      = t.description;
      dateInput.value      = t.dueDate;
      categoryInput.value  = t.category;
      priorityInput.value  = t.priority;
    };

    // toggle complete
    li.querySelector('.toggle').onclick = () => {
      t.completed = !t.completed;
      mgr.update(t);
      render();
      updateProgress();
      // notify on high-priority complete only
      if (t.priority === 'high' && t.completed) {
        notify(`High-priority "${t.title}" completed`);
      }
    };

    list.appendChild(li);
  });

  updateProgress();
}

// handle task creation & updates
form.addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    id:          idField.value || Date.now().toString(),
    title:       titleInput.value.trim(),
    description: descInput.value.trim(),
    category:    categoryInput.value,
    priority:    priorityInput.value,
    dueDate:     dateInput.value,
    completed:   false
  };

  if (!data.title) {
    alert('Title cannot be empty');
    return;
  }

  if (idField.value) {
    mgr.update(new Task(data));
    notify(`Task "${data.title}" updated`);
  } else {
    mgr.add(new Task(data));
    if (data.priority === 'high') {
      notify(`New high-priority "${data.title}" added`);
    }
  }

  form.reset();
  idField.value = '';
  render();
});

// filters & clear completed
document.getElementById('search').addEventListener('input', render);
document.getElementById('filter-category').addEventListener('change', render);
document.getElementById('clear-completed').onclick = () => {
  mgr.clearCompleted();
  render();
  notify('Cleared all completed tasks');
};

// theme toggle & persistence
const toggle  = document.getElementById('theme-toggle');
const current = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', current);
toggle.textContent = current === 'dark' ? '☀️' : '🌙';
toggle.onclick = () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  toggle.textContent = next === 'dark' ? '☀️' : '🌙';
};

// initial render
render();
