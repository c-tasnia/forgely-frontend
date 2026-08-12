import { useState } from "react";
import api from "../api/axios.js";

const COLUMNS = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

const PRIORITY_STYLES = {
  high: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300",
};

const TaskCard = ({ task, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, task.id)}
    className="card cursor-grab space-y-2 p-3 active:cursor-grabbing"
  >
    <p className="text-sm font-medium">{task.title}</p>
    <div className="flex items-center justify-between">
      <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${PRIORITY_STYLES[task.priority]}`}>
        {task.priority}
      </span>
      {task.assignedTo && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
          {task.assignedTo.name?.charAt(0)}
        </span>
      )}
    </div>
    {task.checklist?.length > 0 && (
      <p className="text-xs text-slate-400">
        {task.checklist.filter((c) => c.done).length}/{task.checklist.length} checklist items
      </p>
    )}
  </div>
);

const KanbanBoard = ({ tasks, canEdit, onTaskMoved }) => {
  const [draggingId, setDraggingId] = useState(null);

  const handleDrop = async (e, status) => {
    e.preventDefault();
    if (!draggingId || !canEdit) return;
    onTaskMoved(draggingId, status); // optimistic update in parent
    try {
      await api.patch(`/tasks/${draggingId}/move`, { status });
    } catch {
      onTaskMoved(draggingId, null); // parent should re-fetch on failure; simplest is to ignore here
    }
    setDraggingId(null);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.key)}
            className="min-h-[300px] rounded-xl bg-slate-100 p-3 dark:bg-slate-800/50"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{col.label}</h3>
              <span className="text-xs text-slate-400">{colTasks.length}</span>
            </div>
            <div className="space-y-3">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} onDragStart={(e, id) => setDraggingId(id)} />
              ))}
              {colTasks.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-600">
                  Drop tasks here
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
