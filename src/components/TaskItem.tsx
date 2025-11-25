import { Task } from '../App'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
        task.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md'
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
      />
      <span
        className={`flex-1 ${
          task.completed
            ? 'line-through text-gray-500'
            : 'text-gray-800'
        }`}
      >
        {task.text}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
      >
        Delete
      </button>
    </div>
  )
}

export default TaskItem

