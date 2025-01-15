export const TASK_QUERY = '*, project_members(*), sprints(*), comments:tasks_comments(*), files:task_files(*)'

export const SPRINT_QUERY = `*, tasks(${TASK_QUERY})`
