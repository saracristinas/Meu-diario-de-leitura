import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MensagemDestaqueComponent } from '../../component/mensagem-destaque/mensagem-destaque.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, MensagemDestaqueComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  livrosCadastrados = 0;
  livrosLidos = 0;
  metaAno = 12;

  mensagemDestaque = 'Bem-vindo! Aproveite para registrar suas leituras e acompanhar seu progresso.';
  mostrarMensagem = true;



  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const livrosLS = localStorage.getItem('livros');
      let livros: any[] = [];
      if (livrosLS) {
        livros = JSON.parse(livrosLS);
      }
      const total = livros.length;
      const lidos = livros.filter(l => l.status === 'Lido').length;
      this.animateCounter('livrosCadastrados', total, 900);
      this.animateCounter('livrosLidos', lidos, 1200);
      this.animateCounter('metaAno', this.metaAno, 1500);
    } else {
      // SSR: já mostra o valor final
      this.livrosCadastrados = 0;
      this.livrosLidos = 0;
      this.metaAno = 12;
    }
  }

  animateCounter(prop: 'livrosCadastrados' | 'livrosLidos' | 'metaAno', target: number, duration: number) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const step = () => {
      current += increment;
      if (current < target) {
        this[prop] = Math.floor(current);
        window.requestAnimationFrame(step);
      } else {
        this[prop] = target;
      }
    };
    step();
  }

  fecharMensagem() {
    this.mostrarMensagem = false;
  }
}
