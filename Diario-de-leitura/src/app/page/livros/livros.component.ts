// Removed duplicate declarations outside the class
// ...existing code...
import { Component, signal, effect, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  totalPaginas: number;
  paginasLidas: number;
  status: 'Não iniciado' | 'Lendo' | 'Pausado' | 'Lido';
  genero?: string;
  dataAdicionado?: string;
  ultimaAtualizacao?: string;
  editora?: string;
  sinopse?: string;
  trechos?: string;
  arquivos?: { nome: string; tipo: string; conteudo: string }[];
}

@Component({
  selector: 'app-livros',
  imports: [CommonModule, FormsModule],
  templateUrl: './livros.component.html',
  styleUrl: './livros.component.scss'
})
export class LivrosComponent {
  arquivosEditando: { nome: string; tipo: string; conteudo: string }[] = [];

  async onEditFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    this.arquivosEditando = await Promise.all(
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
  livrosFiltrados = computed(() => {
    const livros = this.livrosSignal();
    if (this.statusFiltro === 'Todos') return livros;
    return livros.filter((livro: Livro) => livro.status === this.statusFiltro);
  });

  abrirModalDetalhes(livro: Livro) {
    this.livroDetalhes = { ...livro };
    this.modalDetalhesAberto = true;
  }

  fecharModalDetalhes() {
    this.modalDetalhesAberto = false;
    this.livroDetalhes = null;
  }
  livrosSignal = signal<Livro[]>([]);

  constructor() {
    const livrosPadrao: Livro[] = [];
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
    modalDetalhesAberto = false;
    livroDetalhes: Livro | null = null;
    statusFiltro: 'Não iniciado' | 'Lendo' | 'Pausado' | 'Lido' | 'Todos' = 'Todos';
    modalAberto = false;
    modalEdicaoAberto = false;
    modalExclusaoAberto = false;
    livroEditando: any = null;
    livroExcluindo: any = null;
    novoLivro = {
      id: '',
      titulo: '',
      autor: '',
      editora: '',
      sinopse: '',
      paginas: null as number | null,
      trechos: '',
      genero: ''
    };
    arquivosSelecionados: { nome: string; tipo: string; conteudo: string }[] = [];

    getCapa(livro: any): string | null {
      if (!livro.arquivos || !Array.isArray(livro.arquivos)) return null;
      const img = livro.arquivos.find((a: any) => a.tipo && a.tipo.startsWith('image/'));
      return img ? img.conteudo : null;
    }

    async onFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files) return;
      const files = Array.from(input.files);
      this.arquivosSelecionados = await Promise.all(
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

    abrirModal() {
      this.modalAberto = true;
    }

    fecharModal() {
      this.modalAberto = false;
      this.novoLivro = { id: '', titulo: '', autor: '', editora: '', sinopse: '', paginas: null, trechos: '', genero: '' };
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
      const idx = livros.findIndex((l: Livro) => l.id === this.livroEditando.id);
      if (idx > -1) {
        const atualizados = [...livros];
        const arquivos = this.arquivosEditando.length > 0 ? this.arquivosEditando : this.livroEditando.arquivos || [];
        atualizados[idx] = { ...this.livroEditando, arquivos, ultimaAtualizacao: new Date().toISOString() };
        this.livrosSignal.set(atualizados);
      }
      this.arquivosEditando = [];
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
      const agora = new Date().toISOString();
      const livro = {
        id: crypto.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).substring(2, 12)),
        titulo: this.novoLivro.titulo,
        autor: this.novoLivro.autor,
        editora: this.novoLivro.editora,
        sinopse: this.novoLivro.sinopse,
        totalPaginas: this.novoLivro.paginas || 0,
        paginasLidas: 0,
        status: 'Não iniciado',
        trechos: this.novoLivro.trechos,
        genero: this.novoLivro.genero || '',
        dataAdicionado: agora,
        ultimaAtualizacao: agora,
        arquivos: this.arquivosSelecionados
      };
      this.livrosSignal.set([...this.livrosSignal(), livro as Livro]);
      this.fecharModal();
      this.arquivosSelecionados = [];
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
      atualizado.ultimaAtualizacao = new Date().toISOString();
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
