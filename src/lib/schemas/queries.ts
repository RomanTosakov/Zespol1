export const TASK_QUERY = '*, project_members(*), sprints(*), comments:tasks_comments(*)'

export const SPRINT_QUERY = `*, tasks(${TASK_QUERY})`
