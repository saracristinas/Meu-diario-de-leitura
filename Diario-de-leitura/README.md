# 📚 Meu Diário de Leitura

Uma aplicação Angular moderna para organizar, acompanhar e descobrir livros.
O sistema implementa **CRUD de leituras**, **metas personalizadas**, **consumo de API externa**, **Reactive Forms** com validações e um **tema global customizável** com variáveis SCSS.

Deploy em produção: [https://meu-diario-de-leitura.vercel.app](https://meu-diario-de-leitura.vercel.app)

---

## 🗂️ Sumário

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Como Executar](#como-executar)
4. [Funcionalidades por Parte](#funcionalidades-por-parte)

	 * [Parte I](#parte-i)
	 * [Parte II](#parte-ii)
	 * [Parte-iii](#parte-III)
5. [Como Usar a Plataforma](#como-usar-a-plataforma)
6. [Onde encontrar no código](#onde-encontrar-no-código)
7. [Licença](#licença)

---

## 📖 Sobre o Projeto

O **Meu Diário de Leitura** é uma plataforma que permite:

* Registrar livros já lidos, em andamento ou planejados.
* Gerenciar progresso de leitura com estatísticas e gráficos.
* Definir metas mensais/anuais.
* Explorar recomendações de livros via API pública.
* Organizar dados localmente com persistência em **LocalStorage**.

A aplicação foi projetada com **Angular 17+ (standalone components)**, seguindo boas práticas de **modularização**, **usabilidade**, **responsividade** e **arquitetura limpa**.

---

## 🛠️ Tecnologias Utilizadas

* **Angular 17+** – Standalone Components, Router, HttpClient.
* **TypeScript** – Tipagem estática.
* **SCSS** – Tema global com variáveis (`styles.scss`).
* **Angular Signals** – `signal`, `computed`, `effect` para gerenciamento de estado.
* **RxJS + HttpClient** – Consumo de API externa (Open Library).
* **Reactive Forms** – Validações avançadas e feedback visual.
* **LocalStorage** – Persistência no navegador.
* **Vercel** – Deploy e hospedagem.

---

## ▶️ Como Executar

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/diario-de-leitura.git
cd diario-de-leitura

# Instale dependências
npm install

# Rode localmente
ng serve

# Acesse em:
http://localhost:4200
```

---

## ⚡ Funcionalidades por Parte

### ✅ Parte I

**Requisito:** Criar uma aplicação Angular com tema livre e layout.

* Layout com **Header**, **Main** e **Footer**:

	* `src/app/component/header/`
	* `src/app/component/footer/`
	* `src/app/page/home/`

* Rotas (mínimo de 3):

	* `/` → Home (`home.component.*`)
	* `/livros` → Estante virtual (`livros.component.*`)
	* `/sobre` → Informações do projeto (`sobre.component.*`)

* Estilização:

	* Global: `src/styles.scss`
	* Cada página: `.scss` em sua respectiva pasta.

---

### ✅ Parte II

**Requisito:** Ampliar funcionalidades com formulários, cores, interpolação e decorators.

* Novas rotas:

	* `/desempenho` → Estatísticas e metas (`desempenho.component.*`)
	* `/contato` → Formulário de contato (`contato.component.*`)
	* `/usuarios` → Recomendações de livros (API Open Library).

* **Formulários**:

	* Template-driven → CRUD de livros.
	* Reactive Form → Contato (validações de obrigatoriedade, e-mail, feedback visual).

* **Tema global**:

	* `styles.scss` define tokens de cor (background, surface, primary, border etc).
	* Todas as páginas usam `var(--color-*)`.

* **Interpolação**:

	* Ex.: `{{ livrosCadastrados }}` em `home.component.html` exibe contadores animados.

* **Fluxo de dados**:

	* `@Input()` → `mensagem-destaque.component.ts` recebe texto do pai.
	* `@Output()` → Evento `(fechar)` emitido ao clicar no botão.
	* `[(ngModel)]` → Bidirecional em campos de busca e formulário de livros.

---

### ✅ Parte III

**Requisito:** Adicionar Signals, API, Reactive Forms.

* **Signals + LocalStorage (CRUD de livros)**:

	* `livros.component.ts` usa `signal`, `computed` e `effect` para gerenciar estado.
	* Livros cadastrados ficam persistidos no LocalStorage.

* **Consumo de API**:

	* `usuarios.component.ts` → Busca dinâmica na **Open Library API**.
	* RxJs + HttpClient para lidar com Observables e respostas assíncronas.

* **Reactive Forms + Validações**:

	* `contato.component.ts` → formulário com:

		* Nome obrigatório.
		* E-mail com regex de validação.
		* Mensagem com mínimo de caracteres.
	* Feedback visual e bloqueio do botão `Enviar` até o formulário ser válido.

---

## 💡 Como Usar a Plataforma

1. **Home** → visão geral, contadores e benefícios do app.
2. **Livros** → cadastre, exclua, edite seus livros e acompanhe seu progresso.
3. **Desempenho** → veja metas anuais/mensais e gráficos.
4. **Recomendações** → pesquise livros pela Open Library.
5. **Contato** → envie dúvidas/sugestões (com validações reativas).
6. **Sobre** → missão e visão do projeto.

---

## 📂 Onde encontrar no código

* Rotas → `src/app/app.routes.ts`
* Tema de cores → `src/styles.scss`
* CRUD de livros → `src/app/page/livros/livros.component.ts`
* API de livros → `src/app/page/usuarios/usuarios.component.ts`
* Formulário de contato → `src/app/page/contato/contato.component.ts`
* Header/Footer → `src/app/component/header/`, `src/app/component/footer/`

---

## 📜 Licença

Este projeto está sob a licença MIT – sinta-se livre para usar e adaptar.
