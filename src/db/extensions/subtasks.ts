import { onDelete } from '../hooks'

// Excluir a tarefa remove as subtarefas junto.
onDelete(async ({ db }, task) => {
  await db.subtasks.where('taskId').equals(task.id).delete()
})
