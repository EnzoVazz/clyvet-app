# 🐾 Clyvet - Infraestrutura Digital Veterinária  
### Challenge FIAP 2026

O **Clyvet** é um protótipo funcional de aplicativo mobile desenvolvido para o ecossistema **Clyvo Vet**, com o objetivo de transformar a jornada da saúde animal através da descentralização de dados e integração entre tutores e médicos veterinários em uma única plataforma contínua.

---

## 👥 Equipe (Squad)

| Nome | RM |
|------|------|
| Enzo Vaz | 561702 |
| Lucas Ryuji Fukuda | 562152 |
| Pietro Donella Salomão | 561722 |

---

## 🚀 Funcionalidades

O aplicativo possui uma arquitetura centralizada de validação e roteamento inteligente.

Dependendo da credencial utilizada no login (**CPF** ou **CRMV**), o sistema direciona o usuário para diferentes fluxos de navegação:

### 👤 Tutor (Acesso via CPF)
- Cadastro de novos pets
- Gestão do perfil do tutor
- Visualização de informações do animal

### 🩺 Veterinário (Acesso via CRMV)
- Busca cruzada de prontuários através do CPF do tutor
- Inserção de diagnósticos médicos
- Atualização do histórico clínico do animal

### 🔒 Segurança
- Sistema de validação local
- Bloqueio de login para documentos não cadastrados na base
- Persistência segura de dados locais

---

## 🛠 Tecnologias Utilizadas

- **React Native**
- **Expo**
- **Expo Router**
- **AsyncStorage**

### 📌 Estrutura de Navegação
O projeto utiliza **Expo Router** com gerenciamento em pilha contendo 5 rotas principais:

1. Tela Inicial
2. Cadastro
3. Painel do Tutor
4. Painel do Veterinário
5. Meu Perfil

### 💾 Persistência de Dados
O **AsyncStorage** é utilizado como simulação de banco de dados relacional local, permitindo operações completas de:

- Create
- Read
- Update
- Delete (CRUD)

---

## 📱 Como Executar o Projeto

### Clone o repositório

```bash
git clone https://github.com/EnzoVazz/clyvet-app.git
```

### Acesse a pasta do projeto

```bash
cd clyvet-mobile
```

### Instale as dependências

```bash
npm install
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

---

## 📌 Objetivo do Projeto

Este projeto foi desenvolvido como parte do **Challenge FIAP 2026**, propondo uma solução digital para integração e continuidade do cuidado veterinário, promovendo:

- Centralização inteligente de informações
- Facilidade de acesso aos prontuários
- Melhor comunicação entre tutores e veterinários
- Simulação de um ecossistema veterinário digital moderno

---
