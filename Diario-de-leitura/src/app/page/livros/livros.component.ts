import { Component, signal, effect, computed } from '@angular/core';
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

  modalAberto = false;
  modalEdicaoAberto = false;
  modalExclusaoAberto = false;
  livroEditando: any = null;
  livroExcluindo: any = null;
  novoLivro = {
    titulo: '',
    autor: '',
    editora: '',
    sinopse: '',
    paginas: null as number | null,
    trechos: ''
  };

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.novoLivro = { titulo: '', autor: '', editora: '', sinopse: '', paginas: null, trechos: '' };
  }

  abrirModalEdicao(livro: any) {
    this.livroEditando = { ...livro };
    this.modalEdicaoAberto = true;
  }

  fecharModalEdicao() {
    this.modalEdicaoAberto = false;
    this.livroEditando = null;
  }

  salvarEdicaoLivro() {
    if (!this.livroEditando) return;
    const livros = this.livrosSignal();
    const idx = livros.findIndex((l: Livro) => l.titulo === this.livroEditando.titulo && l.autor === this.livroEditando.autor);
    if (idx > -1) {
      const atualizados = [...livros];
      atualizados[idx] = { ...this.livroEditando };
      this.livrosSignal.set(atualizados);
    }
    this.fecharModalEdicao();
  }

  abrirModalExclusao(livro: any) {
    this.livroExcluindo = livro;
    this.modalExclusaoAberto = true;
  }

  fecharModalExclusao() {
    this.modalExclusaoAberto = false;
    this.livroExcluindo = null;
  }

  confirmarExclusaoLivro() {
    if (!this.livroExcluindo) return;
    this.livrosSignal.set(this.livrosSignal().filter((l: Livro) => l !== this.livroExcluindo));
    this.fecharModalExclusao();
  }

  adicionarLivro() {
    const livro = {
      titulo: this.novoLivro.titulo,
      autor: this.novoLivro.autor,
      editora: this.novoLivro.editora,
      sinopse: this.novoLivro.sinopse,
      totalPaginas: this.novoLivro.paginas || 0,
      paginasLidas: 0,
      status: 'Não iniciado',
      trechos: this.novoLivro.trechos
    };
    this.livrosSignal.set([...this.livrosSignal(), livro as Livro]);
    this.fecharModal();
  }

  livrosFiltrados = computed(() => {
    const livros = this.livrosSignal();
    if (this.statusFiltro === 'Todos') return livros;
    return livros.filter((livro: Livro) => livro.status === this.statusFiltro);
  });
  livrosSignal = signal<Livro[]>([]);

  constructor() {
    const livrosPadrao: Livro[] = [
      { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', totalPaginas: 320, paginasLidas: 120, status: 'Lendo' as const },
      { titulo: 'Dom Casmurro', autor: 'Machado de Assis', totalPaginas: 256, paginasLidas: 45, status: 'Pausado' as const },
      { titulo: '1984', autor: 'George Orwell', totalPaginas: 328, paginasLidas: 328, status: 'Lido' as const },
      { titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', totalPaginas: 96, paginasLidas: 0, status: 'Não iniciado' as const }
    ];
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    if (isBrowser) {
      const livrosLS = localStorage.getItem('livros');
      if (livrosLS) {
        this.livrosSignal.set(JSON.parse(livrosLS));
      } else {
        this.livrosSignal.set(livrosPadrao);
      }
      effect(() => {
        localStorage.setItem('livros', JSON.stringify(this.livrosSignal()));
      });
    } else {
      this.livrosSignal.set(livrosPadrao);
    }
  }

  paginasTemp: { [titulo: string]: number } = {};

  alterarStatus(livro: Livro, novoStatus: Livro['status']) {
    const livros = this.livrosSignal();
    const idx = livros.indexOf(livro);
    if (idx > -1) {
      const atualizado = { ...livros[idx], status: novoStatus };
      if (novoStatus === 'Lido') atualizado.paginasLidas = atualizado.totalPaginas;
      if (novoStatus === 'Não iniciado') atualizado.paginasLidas = 0;
      const novos = [...livros];
      novos[idx] = atualizado;
      this.livrosSignal.set(novos);
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
    const livros = this.livrosSignal();
    const idx = livros.indexOf(livro);
    if (idx > -1) {
      let atualizado = { ...livros[idx] };
      if (paginas > atualizado.totalPaginas) paginas = atualizado.totalPaginas;
      atualizado.paginasLidas = paginas;
      this.paginasTemp[atualizado.titulo] = paginas;
      if (atualizado.paginasLidas === atualizado.totalPaginas) {
        atualizado.status = 'Lido';
      } else if (atualizado.paginasLidas > 0) {
        atualizado.status = 'Lendo';
      } else {
        atualizado.status = 'Não iniciado';
      }
      const novos = [...livros];
      novos[idx] = atualizado;
      this.livrosSignal.set(novos);
    }
  }

  busca: string = '';
  resultadoBusca: Livro[] | null = null;

  totalPaginasLidas = computed(() => {
    return this.livrosSignal().reduce((acc: number, livro: Livro) => acc + Math.min(livro.paginasLidas, livro.totalPaginas), 0);
  });

  buscarLivro(event: Event) {
    // Resetar campos temporários ao buscar
    this.livrosSignal().forEach((livro: Livro) => {
      this.paginasTemp[livro.titulo] = livro.paginasLidas;
    });
    event.preventDefault();
    const termo = this.busca.trim().toLowerCase();
    if (!termo) {
      this.resultadoBusca = null;
      return;
    }
    this.resultadoBusca = this.livrosSignal().filter((livro: Livro) =>
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo)
    );
  }
  
}
