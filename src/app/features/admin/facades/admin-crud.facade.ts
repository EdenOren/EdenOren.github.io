import { Signal, WritableSignal, computed, signal } from '@angular/core';

export abstract class AdminCrudFacade<T extends { id: string }> {
  readonly isFormOpen: WritableSignal<boolean> = signal(false);
  readonly editingId: WritableSignal<string | null> = signal(null);
  readonly isEditing: Signal<boolean> = computed(() => this.editingId() !== null);

  abstract readonly items: WritableSignal<T[]>;
  abstract readonly isFormValid: Signal<boolean>;
  abstract openAdd(): void;
  abstract openEdit(item: T): void;
  abstract save(): void;

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  remove(id: string): void {
    this.items.update(list => list.filter(item => item.id !== id));
  }

  protected beginAdd(): void {
    this.editingId.set(null);
    this.isFormOpen.set(true);
  }

  protected beginEdit(id: string): void {
    this.editingId.set(id);
    this.isFormOpen.set(true);
  }

  protected applyChange(item: T): void {
    if (this.isEditing()) {
      this.items.update(list => list.map(i => (i.id === item.id ? item : i)));
    } else {
      this.items.update(list => [...list, item]);
    }
    this.closeForm();
  }
}
