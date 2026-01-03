$(document).ready(function () {
  const STORAGE_KEY = "todoAppTasks";
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function renderTasks(filter = "all") {
  const $list = $("#taskList");
  $list.empty();

  tasks.forEach((task) => {
    if (filter === "pending" && task.status === "completed") return;
    if (filter === "completed" && task.status === "pending") return;

    const $item = $(`
      <li class="task-item ${task.status === 'completed' ? 'completed' : ''}">
        <span>
          <input type="checkbox" class="form-check-input me-2 highlight-checkbox" ${task.status === "completed" ? "checked" : ""}>
          <span class="task-text">${task.text}</span>
          <small class="ms-2 priority-${task.priority}">[${task.priority}]</small>
        </span>
        <button class="btn btn-sm btn-outline-danger delete-btn">🗑</button>
      </li>
    `);

    $item.find("input[type=checkbox]").on("change", function () {
      task.status = this.checked ? "completed" : "pending";
      saveTasks();
      renderTasks(filter);
    });

    $item.find(".delete-btn").on("click", function () {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks(filter);
    });

    $list.append($item);
  });
}


  $("#taskForm").on("submit", function (e) {
    e.preventDefault();
    const text = $("#taskInput").val().trim();
    const priority = $("#priorityInput").val();

    if (text !== "") {
      tasks.push({
      id: Date.now(),
      text,
      priority,
      status: "pending"
    });

      saveTasks();
      renderTasks($(".filter-btn.active").data("filter"));
      this.reset();
    }
  });
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    const filter = $(this).data("filter");
    renderTasks(filter);
  });
  renderTasks(); // Initial load
});