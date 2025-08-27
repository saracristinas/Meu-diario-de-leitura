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
  recomendacaoAjuste: string = '';
  horasPorMes: number = 0;

  // parâmetros
  paginasPorHora: number = 30;
  paginasPorLivro: number = 250;

  explicacaoDetalhada: string = '';
  tooltipMsg: string = '';
  hoveredIndex: number | null = null;

  // NOVO: modo de exibição
  roundBars: boolean = false;

  livros: Livro[] = [
    { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', totalPaginas: 320, paginasLidas: 120, status: 'Lendo' },
    { titulo: 'Dom Casmurro', autor: 'Machado de Assis', totalPaginas: 256, paginasLidas: 45, status: 'Lendo' },
    { titulo: '1984', autor: 'George Orwell', totalPaginas: 328, paginasLidas: 328, status: 'Lido' },
    { titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', totalPaginas: 96, paginasLidas: 96, status: 'Lido' }
  ];

  metaAnual: number = 30;
  metaMensal: number = 3;

  leituraPorMes: number[] = Array(12).fill(0);
  meses: string[] = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  maxEscalaGrafico: number = 1;
  capacidadeMensalBooks: number = 0;
  livrosPossiveisAnoForGraph: number = 0;
  metaMensalAlvo: number = 0;

  get totalPaginasLidas(): number {
    return this.livros.reduce((acc, livro) => acc + Math.min(livro.paginasLidas, livro.totalPaginas), 0);
  }

  get livrosLidos(): number {
    return this.livros.filter(l => l.status === 'Lido').length;
  }

  get progressoMeta(): number {
    if (!this.metaAnual) return 0;
    return Math.min(100, Math.round((this.livrosLidos / this.metaAnual) * 100));
  }

  // Valor “visual” respeita o toggle (inteiro x decimal)
  valorVisual(v: number): number {
    return this.roundBars ? Math.round(v) : Number(v.toFixed(2));
  }

  onSalvarMetas(event: Event, anual: string, mensal: string, horasMes: string) {
    event.preventDefault();
    this.recomendacaoAjuste = '';
    this.explicacaoDetalhada = '';

    this.metaAnual   = Number(anual)   || this.metaAnual;
    this.metaMensal  = Number(mensal)  || 0;
    this.horasPorMes = Number(horasMes) || 0;

    // 1) coerência
    if (this.metaMensal && this.metaMensal * 12 > this.metaAnual) {
      this.recomendacaoAjuste =
        `Sua meta mensal de ${this.metaMensal} livros/mês resulta em ${this.metaMensal * 12} livros/ano, ` +
        `o que ultrapassa sua meta anual de ${this.metaAnual}. Ajuste uma das metas para manter a consistência.`;
      return;
    }

    // 2) capacidade pelo tempo
    this.capacidadeMensalBooks = this.horasPorMes
      ? (this.horasPorMes * this.paginasPorHora) / this.paginasPorLivro
      : Number.POSITIVE_INFINITY;

    this.livrosPossiveisAnoForGraph = Number.isFinite(this.capacidadeMensalBooks)
      ? Math.floor(this.capacidadeMensalBooks * 12)
      : this.metaAnual;

    // 3) distribuição e escala
    this.recalcularDistribuicao();

    // 4) explicação e recomendação
    this.atualizarExplicacaoERecomendacao();
  }

  // NOVO: chamada ao mover o slider de páginas/hora
  onSimularTempo() {
    this.capacidadeMensalBooks = this.horasPorMes
      ? (this.horasPorMes * this.paginasPorHora) / this.paginasPorLivro
      : Number.POSITIVE_INFINITY;

    this.livrosPossiveisAnoForGraph = Number.isFinite(this.capacidadeMensalBooks)
      ? Math.floor(this.capacidadeMensalBooks * 12)
      : this.metaAnual;

    this.recalcularDistribuicao();
    this.atualizarExplicacaoERecomendacao();
  }

  onToggleRoundBars() {
    this.recalcularEscala();
  }

  private atualizarExplicacaoERecomendacao() {
    const capMesTxt = Number.isFinite(this.capacidadeMensalBooks)
      ? `${this.capacidadeMensalBooks.toFixed(1)} livro(s)/mês`
      : `sem limite por horas`;

    this.explicacaoDetalhada =
      `Distribuição baseada em: meta anual ${this.metaAnual}, ` +
      `${this.metaMensal ? `meta mensal ${this.metaMensal} e ` : ''}` +
      `capacidade de tempo ${capMesTxt}. ` +
      `Meta mensal efetiva no gráfico: ${this.metaMensalAlvo.toFixed(1)} livro(s)/mês.`;

    // recomendação se tempo < meta anual
    this.recomendacaoAjuste = '';
    if (Number.isFinite(this.capacidadeMensalBooks) && this.metaAnual > this.livrosPossiveisAnoForGraph) {
      const horasNecessarias = Math.ceil((this.metaAnual * this.paginasPorLivro) / (this.paginasPorHora * 12));
      this.recomendacaoAjuste =
        `Sua meta anual de ${this.metaAnual} está acima do possível com ${this.horasPorMes}h/mês. ` +
        `Pelo tempo informado, seria ≈ ${this.livrosPossiveisAnoForGraph} livro(s)/ano. ` +
        `Para atingir ${this.metaAnual}, seriam necessários ~${horasNecessarias}h/mês.`;
    }
  }

  private recalcularDistribuicao(): void {
    // alvo anual efetivo (limitado por horas, se houver)
    const alvoAnual = Number.isFinite(this.capacidadeMensalBooks)
      ? Math.min(this.metaAnual, this.livrosPossiveisAnoForGraph)
      : this.metaAnual;

    // alvo mensal base
    const mensalBase = this.metaMensal || Math.ceil(alvoAnual / 12);

    // capacidade mensal efetiva
    const capMensal = Number.isFinite(this.capacidadeMensalBooks)
      ? this.capacidadeMensalBooks
      : Number.POSITIVE_INFINITY;

    // alvo mensal efetivo
    this.metaMensalAlvo = Math.min(mensalBase, capMensal);

    // 1) preenche meses (sem arredondar) respeitando teto mensal e total anual
    const dist: number[] = Array(12).fill(0);
    let restante = alvoAnual;

    for (let i = 0; i < 12; i++) {
      if (restante <= 0) break;
      const valor = Math.min(this.metaMensalAlvo, restante);
      dist[i] = valor;
      restante -= valor;
    }

    // 2) aplica 2 casas e corrige soma no último mês
    const distRounded = dist.map(v => Number(v.toFixed(2)));
    const somaArred = Number(distRounded.reduce((a, b) => a + b, 0).toFixed(2));
    const alvoArred = Number(alvoAnual.toFixed(2));
    const delta = Number((alvoArred - somaArred).toFixed(2));

    if (Math.abs(delta) >= 0.01) {
      const last = distRounded.length - 1;
      const candidato = Number((distRounded[last] + delta).toFixed(2));
      const teto = Number(this.metaMensalAlvo.toFixed(2));
      distRounded[last] = Math.max(0, Math.min(candidato, teto));
    }

    this.leituraPorMes = distRounded;

    // 3) recalcula escala com base no modo visual
    this.recalcularEscala();
  }

  private recalcularEscala(): void {
    const vis = this.leituraPorMes.map(v => this.valorVisual(v));
    const maxValor = Math.max(1, ...vis);
    const alvoVisual = Math.max(this.metaMensalAlvo || 0, maxValor);
    this.maxEscalaGrafico = Math.max(1, Number(alvoVisual.toFixed(1)));
  }

  onBarMouseEnter(index: number, valor: number) {
    this.hoveredIndex = index;
    this.tooltipMsg = `≈ ${valor} livro${valor !== 1 ? 's' : ''} neste mês`;
  }

  onBarMouseLeave() {
    this.hoveredIndex = null;
    this.tooltipMsg = '';
  }
}