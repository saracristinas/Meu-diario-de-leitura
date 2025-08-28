import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent {
  contatoForm: FormGroup;
  enviado: boolean = false;
  showSuccess: boolean = false;

  constructor(private fb: FormBuilder) {
    this.contatoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mensagem: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.contatoForm.valid) {
      this.enviado = true;
      this.showSuccess = true;
      // Aqui posso integrar com o back end
      this.contatoForm.reset();
      setTimeout(() => {
        this.showSuccess = false;
      }, 3500);
    }
  }
}
