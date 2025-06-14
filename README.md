# assignment_4_task_management

# How It Works

#**Overall Structure**
The app is a single‐page HTML document enhanced by a linked `styles.css` for layout, theming, and animations, and a `script.js` that drives all interactivity. At the top sits a banner image and a brief title/subtitle. Below that is a header bar with the app title and a dark-/light-mode toggle. The main “Controls” panel contains a form for creating or editing tasks (including title, description, due date, category, and priority) alongside filters for live search and category filtering. Underneath is a progress bar that visually shows the percentage of tasks completed, and finally the task list itself, which dynamically displays either a friendly “empty state” illustration or a grid of task cards. Toast notifications pop up in the corner for important events.

#**JavaScript Architecture (OOP)**
Two ES6 classes encapsulate the core logic. The `Task` class represents a single to-do item with properties for ID, title, description, due date, category, priority, and completed state. The `TaskManager` class maintains an array of `Task` instances, handles all CRUD operations (add, update, delete, clear completed), persists the array to `localStorage`, and provides a filter method that returns tasks matching the current search text and selected category. This separation ensures data logic is cleanly decoupled from the UI layer.

#**Rendering & Event Flow**
On page load and after every action, a `render()` function runs: it retrieves the current search text and category filter, asks the `TaskManager` for matching tasks, sorts them High→Medium→Low, and builds a `<li>` card for each—showing title, description, due date, category/priority metadata, and buttons for complete, edit, and delete. Marking a task completed toggles its state, updates persistence, re-renders the list, updates the progress bar, and if it’s high priority, shows a “completed” toast. Editing loads the task into the form (using a hidden ID field) so the next submit acts as an update rather than a new add. Deleting or “clear completed” removes tasks and immediately re-renders. Live search and category dropdown each listen for input/change events to re-invoke `render()` in real time.

#**Progress, Validation & Notifications**
A small progress bar calculates the ratio of completed tasks to total tasks and adjusts its width accordingly. Form submission is guarded by a simple validation that prevents empty titles (with an alert message). Toast notifications appear for three scenarios: adding a new high-priority task, updating any task, and completing a high-priority task. Each toast automatically disappears after a few seconds.

#**Styling & Responsiveness**
The CSS is mobile-first. Controls stack vertically on narrow screens and snap into a two-row layout on desktop. Task cards arrange via CSS Grid into a responsive grid. A dark/light theme toggle flips custom properties, with the user’s choice saved in `localStorage` so it persists across reloads. Subtle animations (fade-ins, button lifts, bounce for toasts) and polished UI elements—pill-shaped control bars, rounded inputs, hover effects—make the experience both functional and visually engaging.

