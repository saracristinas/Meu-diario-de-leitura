import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mensagem-destaque',
  standalone: true,
  template: `
    <div class="mensagem-destaque">
      <p>{{ mensagem }}</p>
      <button (click)="fecharMensagem()">Fechar</button>
    </div>
  `,
  styleUrls: ['./mensagem-destaque.component.scss']
})
export class MensagemDestaqueComponent {
  @Input() mensagem: string = '';
  @Output() fechar = new EventEmitter<void>();

  fecharMensagem() {
    this.fechar.emit();
  }
}
