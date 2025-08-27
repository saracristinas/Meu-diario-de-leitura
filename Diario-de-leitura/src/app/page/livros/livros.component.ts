import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


export interface Livro {
  titulo: string;
  autor: string;
  totalPaginas: number;
  paginasLidas: number;
  status: 'Não iniciado' | 'Lendo' | 'Pausado' | 'Lido';
}
@Component({
  selector: 'app-livros',
  imports: [CommonModule, FormsModule],
  templateUrl: './livros.component.html',
  styleUrl: './livros.component.scss'
})
export class LivrosComponent {
  statusFiltro: 'Não iniciado' | 'Lendo' | 'Pausado' | 'Lido' | 'Todos' = 'Todos';

  get livrosFiltrados(): Livro[] {
    if (this.statusFiltro === 'Todos') return this.livros;
    return this.livros.filter((livro: Livro) => livro.status === this.statusFiltro);
  }
  livros: Livro[] = [
    { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', totalPaginas: 320, paginasLidas: 120, status: 'Lendo' },
    { titulo: 'Dom Casmurro', autor: 'Machado de Assis', totalPaginas: 256, paginasLidas: 45, status: 'Pausado' },
    { titulo: '1984', autor: 'George Orwell', totalPaginas: 328, paginasLidas: 328, status: 'Lido' },
    { titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', totalPaginas: 96, paginasLidas: 0, status: 'Não iniciado' }
  ];

  alterarStatus(livro: Livro, novoStatus: Livro['status']) {
    livro.status = novoStatus;
    if (novoStatus === 'Lido') {
      livro.paginasLidas = livro.totalPaginas;
    }
    if (novoStatus === 'Não iniciado') {
      livro.paginasLidas = 0;
    }
  }

  podeIniciar(livro: Livro) {
    return livro.status === 'Não iniciado';
  }
  podeLer(livro: Livro) {
    return livro.status === 'Pausado';
  }
  podePausar(livro: Livro) {
    return livro.status === 'Lendo';
  }
  podeFinalizar(livro: Livro) {
    return livro.status === 'Lendo' || livro.status === 'Pausado';
  }


  atualizarPaginasLidas(livro: Livro, valor: string | number | null) {
    let paginas = Number(valor);
    if (isNaN(paginas) || paginas < 0) return;
    if (paginas > livro.totalPaginas) paginas = livro.totalPaginas;
    livro.paginasLidas = paginas;
    if (livro.paginasLidas === livro.totalPaginas) {
      livro.status = 'Lido';
    } else if (livro.paginasLidas > 0) {
      livro.status = 'Lendo';
    } else {
      livro.status = 'Não iniciado';
    }
  }

  busca: string = '';
  resultadoBusca: Livro[] | null = null;

  get totalPaginasLidas(): number {
    return this.livros.reduce((acc, livro) => acc + Math.min(livro.paginasLidas, livro.totalPaginas), 0);
  }

  buscarLivro(event: Event) {
    event.preventDefault();
    const termo = this.busca.trim().toLowerCase();
    if (!termo) {
      this.resultadoBusca = null;
      return;
    }
    this.resultadoBusca = this.livros.filter(livro =>
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo)
    );
  }
  
}
