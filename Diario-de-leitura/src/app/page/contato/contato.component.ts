import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent {
  nome: string = '';
  email: string = '';
  mensagem: string = '';
  enviado: boolean = false;

  onSubmit(form: any) {
    if (form.valid) {
      this.enviado = true;
      // Aqui posso integrar com o back end
      form.resetForm();
    }
  }
}
