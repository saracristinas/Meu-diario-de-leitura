import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type Livro = {
  titulo: string;
  autor: string;
  totalPaginas: number;
  paginasLidas: number;
  status: 'Lendo' | 'Lido';
};

@Component({
  selector: 'app-desempenho',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desempenho.component.html',
  styleUrls: ['./desempenho.component.scss']
})
export class DesempenhoComponent {
  currentYear = new Date().getFullYear();
  recomendacaoAjuste: string = '';
  horasPorMes: number = 0;

  // parâmetros
  paginasPorHora: number = 30;
  paginasPorLivro: number = 250;

  explicacaoDetalhada: string = '';
  tooltipMsg: string = '';
  hoveredIndex: number | null = null;

  livros: Livro[] = [
    { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', totalPaginas: 320, paginasLidas: 120, status: 'Lendo' },
    { titulo: 'Dom Casmurro', autor: 'Machado de Assis', totalPaginas: 256, paginasLidas: 45, status: 'Lendo' },
    { titulo: '1984', autor: 'George Orwell', totalPaginas: 328, paginasLidas: 328, status: 'Lido' },
    { titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', totalPaginas: 96, paginasLidas: 96, status: 'Lido' }
  ];

  metaAnualLivros: number = 0;
  metaAnualPaginas: number = 0;

  // Progresso
  get livrosLidosAno(): number {
    return this.livros.filter(l => l.status === 'Lido').length;
  }
  get paginasLidasAno(): number {
    return this.livros.reduce((acc, l) => acc + (l.status === 'Lido' ? l.totalPaginas : 0), 0);
  }

  get totalPaginasLidas(): number {
    return this.livros.reduce((acc, livro) => acc + Math.min(livro.paginasLidas, livro.totalPaginas), 0);
  }

  get livrosLidos(): number {
    return this.livros.filter(l => l.status === 'Lido').length;
  }

  get progressoLivros(): number {
    if (!this.metaAnualLivros) return 0;
    return Math.min(100, Math.round((this.livrosLidosAno / this.metaAnualLivros) * 100));
  }
  get progressoPaginas(): number {
    if (!this.metaAnualPaginas) return 0;
    return Math.min(100, Math.round((this.paginasLidasAno / this.metaAnualPaginas) * 100));
  }

  onSalvarMetas(event: Event, livros: string, paginas: string) {
    event.preventDefault();
    this.metaAnualLivros = Number(livros) > 0 ? Number(livros) : 0;
    this.metaAnualPaginas = Number(paginas) > 0 ? Number(paginas) : 0;
  }

}