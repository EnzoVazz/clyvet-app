# Clyvet — Sprint 3 (Mobile Application Development)

Aplicativo React Native/Expo da squad **Clyvet**, para o Challenge FIAP 2026 com a Clyvo Vet. Nesta sprint o app deixa de ser protótipo local e passa a resolver o fluxo principal com **autenticação real**, **navegação por rotas** e **CRUD na API via TanStack Query**.

## Problema e solução

Tutores e veterinários ainda trabalham com informações espalhadas, o que quebra a continuidade do cuidado do pet. O Clyvet centraliza o cadastro dos animais e o prontuário clínico em um aplicativo mobile, com dados persistidos em API HTTP.

## Equipe

| Nome | RM |
|------|------|
| Enzo Vaz | 561702 |
| Lucas Ryuji Fukuda | 562152 |
| Pietro Donella Salomão | 561722 |

## O que a Sprint 3 entrega

- 8 telas distintas com **Expo Router** (rotas explícitas)
- Login e cadastro com **Firebase Authentication**
- Sessão persistente e **rotas protegidas** (`Stack.Protected`)
- Tutor acessa só os próprios pets; **prontuários ficam na área do veterinário**
- Logout imediato, bloqueando as telas internas
- Integração HTTP com **TanStack Query** (`useQuery` / `useMutation`)
- Dois CRUDs completos na interface: **Pets** e **Prontuários**
- Loading, erro, lista vazia e atualização automática da UI após mutações
- Código separado em telas, hooks, serviços e componentes

## Telas

1. Login
2. Cadastro
3. Home
4. Lista de pets
5. Formulário de pet (criar/editar)
6. Lista de prontuários (veterinário)
7. Formulário de prontuário (veterinário)
8. Perfil, logout e exclusão de conta

## Arquitetura

```
app/                  telas (Expo Router)
src/components/       UI reutilizável
src/contexts/         sessão Firebase
src/hooks/            TanStack Query (fora das telas)
src/services/         chamadas HTTP (axios)
src/config/           Firebase e QueryClient
src/types/            contratos da API
```

As telas não chamam axios. Elas usam hooks; os hooks usam serviços.

## Tecnologias

- Expo SDK 54 / React Native / Expo Router
- TanStack Query v5
- Axios
- Firebase Authentication (JS SDK)
- API Java da squad (`https://clyvet-api.onrender.com`)

## Como executar

O professor **não precisa** subir json-server. O app fala com a API Java no Render.

### 1. Instalar dependências

```bash
npm install
copy .env.example .env
```

No macOS/Linux use `cp .env.example .env`.

### 2. Configurar o Firebase (obrigatório)

1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto (ex.: `clyvet-mobile`)
3. Ative **Authentication > Sign-in method > E-mail/senha**
4. Em Project settings, registre um app **Web** e copie as chaves
5. Cole no `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_API_URL=https://clyvet-api.onrender.com
```

Reinicie o Expo depois de salvar o `.env`.

### 3. Subir o aplicativo

```bash
npx expo start
```

Abra no Expo Go ou no emulador. A primeira chamada pode demorar (cold start do Render).

### Perfis no app

- **Tutor:** vê e gerencia somente os pets vinculados à conta dele
- **Veterinário:** vê todos os pets da API e gerencia prontuários

Login do app é Firebase. Pets e prontuários vêm da API Java.

## Vídeo da Sprint 3

Publique no YouTube (máx. 5 min, com narração) e cole o link abaixo.

**Link do vídeo:** _inserir URL do YouTube_

O vídeo precisa mostrar, no smartphone ou emulador:

1. Navegação entre as telas
2. Cadastro, login, reabertura do app (sessão persistente) e logout
3. CRUD de pets (criar, listar, editar, excluir) com loading
4. CRUD de prontuários refletindo na lista sem reiniciar o app

## Observação sobre a API Java

O backend é o projeto `clyvet-api`, publicado em `https://clyvet-api.onrender.com`.

O site Thymeleaf (`/login`, `/home`) continua com Spring Security. As rotas `/api/**` foram liberadas para o aplicativo mobile, com:

- `GET /api/pets` e `GET /api/pets/tutor/{id}`
- `GET /api/prontuarios`
- `GET /api/tutores`

Depois de alterar o Java, é obrigatório **commitar e fazer um novo deploy no Render**. Sem esse deploy, o app ainda recebe a página HTML de login.
