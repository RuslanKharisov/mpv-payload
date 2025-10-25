/**
 * Возвращает все дочерние (включая вложенные) ID для заданного корневого ID.
 * Использует BFS (очередь) для избежания переполнения стека при глубокой вложенности.
 */
export const getAllDescendantIds = (rootId: number, tree: Record<number, number[]>): number[] => {
  const result: number[] = []
  const queue: number[] = [rootId]

  for (let i = 0; i < queue.length; ) {
    const currentId = queue[i++]
    const children = tree[currentId] || []
    result.push(...children)
    queue.push(...children)
  }

  return result
}
