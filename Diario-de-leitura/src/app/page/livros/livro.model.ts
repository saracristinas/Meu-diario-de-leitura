export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  status: 'Lendo' | 'Lido' | 'Pausado' | 'Não iniciado';
  arquivos?: { nome: string; tipo: string; conteudo: string }[];
}
