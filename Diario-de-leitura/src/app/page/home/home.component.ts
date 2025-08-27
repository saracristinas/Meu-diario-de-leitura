import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  livrosCadastrados = 0;
  livrosLidos = 0;
  metaAno = 0;

  private targetLivrosCadastrados = 120;
  private targetLivrosLidos = 45;
  private targetMetaAno = 12;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateCounter('livrosCadastrados', this.targetLivrosCadastrados, 900);
      this.animateCounter('livrosLidos', this.targetLivrosLidos, 1200);
      this.animateCounter('metaAno', this.targetMetaAno, 1500);
    } else {
      // SSR: já mostra o valor final
      this.livrosCadastrados = this.targetLivrosCadastrados;
      this.livrosLidos = this.targetLivrosLidos;
      this.metaAno = this.targetMetaAno;
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
}
