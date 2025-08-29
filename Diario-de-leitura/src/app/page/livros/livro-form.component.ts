import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addLivro } from './livro-signals';
import { Livro } from './livro.model';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #form="ngForm" autocomplete="off">
      <input name="titulo" [(ngModel)]="titulo" required placeholder="Título" />
      <input name="autor" [(ngModel)]="autor" required placeholder="Autor" />
      <select name="status" [(ngModel)]="status">
        <option value="Lendo">Lendo</option>
        <option value="Lido">Lido</option>
        <option value="Pausado">Pausado</option>
        <option value="Não iniciado">Não iniciado</option>
      </select>
      <input type="file" (change)="onFileChange($event)" multiple accept=".pdf,.jpg,.jpeg,.png" />
      <button type="submit" [disabled]="form.invalid">Adicionar</button>
    </form>
  `
})
export class LivroFormComponent {

  titulo = '';
  autor = '';
  status: Livro['status'] = 'Lendo';
  arquivos: { nome: string; tipo: string; conteudo: string }[] = [];

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    this.arquivos = await Promise.all(
      files.map(file =>
        new Promise<{ nome: string; tipo: string; conteudo: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ nome: file.name, tipo: file.type, conteudo: reader.result as string });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      )
    );
  }

  onSubmit() {
    addLivro({
      id: crypto.randomUUID(),
      titulo: this.titulo,
      autor: this.autor,
      status: this.status,
      arquivos: this.arquivos
    });
    this.titulo = '';
    this.autor = '';
    this.status = 'Lendo';
    this.arquivos = [];
  }
}
