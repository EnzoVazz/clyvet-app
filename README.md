# 🐾 Clyvet - Infraestrutura Digital Veterinária  
### Challenge FIAP 2026

O **Clyvet** é o aplicativo mobile do ecossistema **Clyvo Vet**, com o objetivo de transformar a jornada da saúde animal através da integração real entre tutores, veterinários e a base de dados da clínica, com autenticação segura e dados sempre sincronizados com o backend.

---

## 👥 Equipe (Squad)

| Nome | RM |
|------|------|
| Enzo Vaz | 561702 |
| Lucas Ryuji Fukuda | 562152 |
| Pietro Donella Salomão | 561722 |

---

## 🚀 Funcionalidades

O aplicativo agora conta com autenticação real via **Firebase** e todos os dados exibidos vêm diretamente da **ClyVet API** (Spring Boot), publicada no Render — nada é mais simulado localmente.

Dependendo do tipo de conta criada no cadastro (**Tutor** ou **Veterinário**), o app protege as rotas e libera fluxos diferentes automaticamente.

### 👤 Tutor
- Cadastro, edição e exclusão dos próprios pets (CRUD completo via API)
- Visualização de informações e alertas clínicos de cada animal
- Gestão do perfil pessoal

### 🩺 Veterinário
- Consulta de prontuários médicos de qualquer pet cadastrado
- Inserção e atualização de diagnósticos, vinculando o registro ao pet atendido
- Exclusão de registros do histórico clínico

### 🔒 Segurança
- Autenticação real via **Firebase Authentication** (e-mail e senha)
- Sessão persistida — o usuário não precisa logar novamente ao reabrir o app
- Rotas protegidas por perfil: telas de Tutor e Veterinário só são acessíveis a quem está autenticado e tem o perfil correspondente

---

## 🛠 Tecnologias Utilizadas

- **React Native**
- **Expo** + **Expo Router**
- **TypeScript**
- **Firebase Authentication**
- **TanStack Query** (`useQuery` / `useMutation`) para toda a comunicação com a API
- **Axios**
- **AsyncStorage** (apenas para cache local do perfil do usuário)

### 📌 Estrutura de Navegação
O projeto utiliza **Expo Router** com rotas organizadas em dois grupos, protegidas de acordo com o estado de autenticação:

**Grupo `(auth)`** — acesso público:
1. Login
2. Cadastro

**Grupo `(app)`** — acesso autenticado:
3. Início
4. Meus Pets (listagem)
5. Formulário de Pet (criar/editar)
6. Prontuários (exclusivo Veterinário)
7. Formulário de Prontuário (exclusivo Veterinário)
8. Meu Perfil

### 💾 Persistência de Dados
Todos os dados de pets e prontuários são armazenados e consultados diretamente na **ClyVet API**, que persiste em banco Oracle na nuvem. O CRUD completo (Create, Read, Update, Delete) é feito via requisições HTTP reais, com estado de carregamento e atualização automática da tela após cada operação. O **AsyncStorage** hoje só guarda o perfil do usuário logado localmente, para não precisar buscar isso na API a cada abertura do app.

---

## 📱 Como Executar o Projeto

### Clone o repositório

```bash
git clone https://github.com/EnzoVazz/clyvet-app.git
```

### Acesse a pasta do projeto

```bash
cd clyvet-app
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis de ambiente

Copie o `.env.example` para `.env` e preencha com as credenciais do projeto Firebase:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_API_URL=https://clyvet-api.onrender.com
```

### Execute a aplicação

```bash
npx expo start
```

---

## ▶️ Execução

Após iniciar o projeto:

- Escaneie o QR Code utilizando o aplicativo **Expo Go**
- Ou execute em um emulador Android/iOS

> ⚠️ O backend está hospedado no plano gratuito do Render — a primeira requisição após um tempo sem uso pode levar de 30 a 50 segundos para responder.

---

## 🔗 Backend

O app consome a [ClyVet API](https://github.com/EnzoVazz/clyvet-api) (Java/Spring Boot), publicada em `https://clyvet-api.onrender.com`, responsável por toda a persistência de Pets, Tutores, Veterinários e Prontuários.

---
## 🎥 Vídeo de Demonstração

[Assista ao vídeo aqui](https://youtu.be/ZJGM62yaydo)

---
## 📌 Objetivo do Projeto

Este projeto foi desenvolvido como parte do **Challenge FIAP 2026**, propondo uma solução digital para integração e continuidade do cuidado veterinário, promovendo:

- Centralização real das informações em um backend único
- Facilidade de acesso aos prontuários, com autenticação segura
- Melhor comunicação entre tutores e veterinários
- Um ecossistema veterinário digital moderno, funcional de ponta a ponta
