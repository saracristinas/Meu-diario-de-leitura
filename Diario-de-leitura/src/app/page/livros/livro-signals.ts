import { signal, computed, effect } from '@angular/core';
import { Livro } from './livro.model';

const STORAGE_KEY = 'livros';

function loadLivros(): Livro[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export const livrosSignal = signal<Livro[]>(loadLivros());

// Persistência automática
 effect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(livrosSignal()));
});

export const livrosCount = computed(() => livrosSignal().length);
export const livrosLidos = computed(() => livrosSignal().filter(l => l.status === 'Lido').length);

export function addLivro(livro: Livro) {
  livrosSignal.update(livros => [...livros, livro]);
}

export function updateLivro(id: string, changes: Partial<Livro>) {
  livrosSignal.update(livros => livros.map(l => l.id === id ? { ...l, ...changes } : l));
}

export function deleteLivro(id: string) {
  livrosSignal.update(livros => livros.filter(l => l.id !== id));
}
