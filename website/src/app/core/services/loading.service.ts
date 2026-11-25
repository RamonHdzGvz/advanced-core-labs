import { Injectable, signal } from '@angular/core';

export interface LoadingTask {
  readonly id: number;
  readonly message: string;
  readonly completed: boolean;
}

export interface LoadingProgress {
  readonly current: number;
  readonly total: number;
}

export interface LoadingBatchOperation<T> {
  readonly message: string;
  readonly run: () => T | Promise<T>;
}

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private nextId = 0;
  private completedTasks = 0;
  private totalTasks = 0;
  private readonly taskList = signal<readonly LoadingTask[]>([]);
  private readonly progressState = signal<LoadingProgress | null>(null);

  readonly tasks = this.taskList.asReadonly();
  readonly progress = this.progressState.asReadonly();

  begin(message = 'Cargando…'): number {
    if (this.taskList().length === 0) {
      this.completedTasks = 0;
      this.totalTasks = 0;
    }

    const id = ++this.nextId;
    this.totalTasks++;
    this.taskList.update((tasks) => [...tasks, { id, message, completed: false }]);
    this.updateProgress();
    return id;
  }

  end(id: number): void {
    const tasks = this.taskList();
    if (!tasks.some((task) => task.id === id)) return;

    this.completedTasks++;
    const remainingTasks = tasks.filter((task) => task.id !== id);
    this.taskList.set(remainingTasks);
    if (remainingTasks.length === 0) {
      this.completedTasks = 0;
      this.totalTasks = 0;
      this.progressState.set(null);
      return;
    }
    this.updateProgress();
  }

  async run<T>(operation: () => T | Promise<T>, message = 'Cargando…'): Promise<T> {
    const id = this.begin(message);
    try {
      return await operation();
    } finally {
      this.end(id);
    }
  }

  async runBatch<T>(
    operations: readonly LoadingBatchOperation<T>[],
    mode: 'concurrent' | 'sequential',
    completionDelayMs = 0,
  ): Promise<readonly T[]> {
    if (operations.length === 0) return [];
    return mode === 'concurrent'
      ? this.runConcurrentBatch(operations, completionDelayMs)
      : this.runSequentialBatch(operations);
  }

  private async runConcurrentBatch<T>(
    operations: readonly LoadingBatchOperation<T>[],
    completionDelayMs: number,
  ): Promise<readonly T[]> {
    const tasks = operations.map((operation) => ({
      id: ++this.nextId,
      message: operation.message,
      completed: false,
    }));
    let completed = 0;
    this.taskList.update((current) => [...current, ...tasks]);
    this.progressState.set({ current: completed, total: operations.length });

    const results = await Promise.allSettled(
      operations.map(async (operation, index) => {
        const result = await operation.run();
        completed++;
        const completedId = tasks[index].id;
        this.taskList.update((current) =>
          current.map((task) => (task.id === completedId ? { ...task, completed: true } : task)),
        );
        this.progressState.set({ current: completed, total: operations.length });
        return result;
      }),
    );

    if (completionDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, completionDelayMs));
    }
    this.removeTasks(tasks.map((task) => task.id));
    const failure = results.find((result) => result.status === 'rejected');
    if (failure?.status === 'rejected') throw failure.reason;
    return results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
  }

  private async runSequentialBatch<T>(
    operations: readonly LoadingBatchOperation<T>[],
  ): Promise<readonly T[]> {
    const id = ++this.nextId;
    const results: T[] = [];
    this.taskList.update((tasks) => [
      ...tasks,
      { id, message: operations[0].message, completed: false },
    ]);

    try {
      for (const [index, operation] of operations.entries()) {
        this.taskList.update((tasks) =>
          tasks.map((task) =>
            task.id === id ? { ...task, message: operation.message, completed: false } : task,
          ),
        );
        this.progressState.set({ current: index + 1, total: operations.length });
        results.push(await operation.run());
      }
      return results;
    } finally {
      this.removeTasks([id]);
    }
  }

  private removeTasks(ids: readonly number[]): void {
    const idSet = new Set(ids);
    this.taskList.update((tasks) => tasks.filter((task) => !idSet.has(task.id)));
    this.progressState.set(null);
  }

  private updateProgress(): void {
    this.progressState.set(
      this.totalTasks > 1
        ? { current: Math.min(this.completedTasks + 1, this.totalTasks), total: this.totalTasks }
        : null,
    );
  }
}
