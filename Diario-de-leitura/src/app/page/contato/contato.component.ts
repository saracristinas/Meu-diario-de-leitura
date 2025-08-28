import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [FormsModule],
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
      // Aqui você pode integrar com backend ou serviço de email
      // Exemplo: this.http.post('/api/contato', { nome: this.nome, email: this.email, mensagem: this.mensagem })
      form.resetForm();
    }
  }
}
