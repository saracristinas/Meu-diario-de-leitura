import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { LivrosComponent } from './page/livros/livros.component';
import { DesempenhoComponent } from './page/desempenho/desempenho.component';
import { SobreComponent } from './page/sobre/sobre.component';
import { ContatoComponent } from './page/contato/contato.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Início — Meu Diário de Leitura' },
  { path: 'livros', component: LivrosComponent, title: 'Livros — Meu Diário de Leitura' },
  { path: 'desempenho', component: DesempenhoComponent, title: 'Meu Desempenho — Meu Diário de Leitura' },
  { path: 'sobre', component: SobreComponent, title: 'Sobre — Meu Diário de Leitura' },
  { path: 'contato', component: ContatoComponent, title: 'Contato — Meu Diário de Leitura' },
  { path: '**', redirectTo: '' }
];
