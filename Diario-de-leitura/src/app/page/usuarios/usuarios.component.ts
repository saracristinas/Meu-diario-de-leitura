import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <main class="usuarios" role="main">
      <h1>Recomendações de Livros (API)</h1>
      <form (ngSubmit)="buscar()" class="busca-form">
        <input type="search" [(ngModel)]="termo" name="termo" placeholder="Buscar por título, autor ou gênero..." class="busca-input" />
        <button type="submit">Buscar</button>
      </form>
      <ul *ngIf="livros$ | async as livros; else carregando">
        <li *ngFor="let livro of livros">
          <strong>{{ livro.title }}</strong><br>
          <small *ngIf="livro.author_name">Autor: {{ livro.author_name.join(', ') }}</small>
        </li>
      </ul>
      <ng-template #carregando>Carregando livros...</ng-template>
    </main>
  `,
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  livros$: Observable<any[]> = of([]);
  termo: string = 'recomendation';

  constructor(private http: HttpClient) {
    this.buscar();
  }

  buscar() {
    const query = encodeURIComponent(this.termo.trim() || 'recomendation');
    this.livros$ = this.http.get<any>(`https://openlibrary.org/search.json?q=${query}`)
      .pipe(
        map(res => res.docs.slice(0, 10)),
        catchError(() => of([]))
      );
  }
}
