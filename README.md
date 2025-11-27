<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# App Punch Clock - Sistema de Controle de Ponto

Um sistema moderno de controle de ponto desenvolvido com **Laravel**, **React** e **Inertia.js**, oferecendo gerenciamento de registros de entrada/saída para funcionários e administradores.

## 📋 Características

- ✅ Autenticação de usuários (funcionários e administradores)
- ✅ Dashboard personalizado por usuário/admin
- ✅ Registro de ponto (entrada/saída)
- ✅ Gestão de usuários (CRUD)
- ✅ Perfil de usuário com edição e alteração de senha
- ✅ Filtros por data e busca avançada
- ✅ Interface responsiva com tema dark mode
- ✅ Componentes shadcn/ui
- ✅ Instalação via Docker

## 🚀 Quick Start com Docker

### Pré-requisitos

- Docker e Docker Compose instalados
- Git

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/Bruno-Gilberto/app-punch-clock.git
cd app-punch-clock
```

2. **Inicie os containers Docker:**
```bash
docker-compose up -d
```

3. **Acesse a página de instalação:**
- Abra seu navegador em `http://localhost:8000`
- Siga o wizard de instalação
- A aplicação será configurada automaticamente (migrações + seeders)

> **Nota:** O frontend já é buildado no docker e vem pronto para uso em `public/`. A instância Docker já contém todas as dependências Node necessárias.

## 📊 Instalação Manual (Sem Docker)

### Pré-requisitos

- PHP >= 8.3
- Node.js >= 20
- Composer
- MySQL 8.0+

### Passos

1. **Clone e configure:**
```bash
git clone https://github.com/Bruno-Gilberto/app-punch-clock.git
cd app-punch-clock
```
2. **Instale dependências:**
```bash
composer install
```

3. **Acesse a página de instalação:**
- Abra `http://localhost:8000`
- Siga o wizard para completar a instalação

## 🔐 Dados de Acesso para Testes

Após completar a instalação, use as seguintes credenciais:

### Administrador

| Campo | Valor |
|-------|-------|
| Email | `admin@example.com` |
| Senha | `password` |
| Acesso | `http://localhost:8000/admin` |

### Usuários (Funcionários)

| Nome | Email | Senha |
|------|-------|-------|
| João Silva | `joao.silva@example.com` | `password` |
| Maria Santos | `maria.santos@example.com` | `password` |
| Pedro Oliveira | `pedro.oliveira@example.com` | `password` |
| Ana Costa | `ana.costa@example.com` | `password` |
| Carlos Ferreira | `carlos.ferreira@example.com` | `password` |
| Fernanda Lima | `fernanda.lima@example.com` | `password` |
| Gabriel Martins | `gabriel.martins@example.com` | `password` |
| Isadora Pereira | `isadora.pereira@example.com` | `password` |
| Lucas Gomes | `lucas.gomes@example.com` | `password` |
| Raquel Cardoso | `raquel.cardoso@example.com` | `password` |

## 🏗️ Arquitetura da Aplicação

### Backend (Laravel)

```
app/
├── Http/
│   └── Controllers/
│       ├── Admin/          # Controllers de administrador
│       │   ├── Dashboard.php
│       │   ├── UserController.php
│       │   └── LoginController.php
│       ├── User/           # Controllers de funcionário
│       │   ├── Dashboard.php
│       │   ├── ClockLogsController.php
│       │   └── LoginController.php
│       └── Installer/      # Controller de instalação
│           └── InstallerController.php
├── Models/
│   ├── User.php            # Modelo de funcionário
│   ├── Admin.php           # Modelo de administrador
│   └── PunchClockLogs.php  # Modelo de registros de ponto
└── Http/Middleware/        # Middlewares de autenticação
```

### Frontend (React + Inertia.js)

```
public/
├── build/                  # Build otimizado para produção
│   ├── assets/             # CSS/JS compilados
│   └── manifest.json       # Manifest de assets
resources/js/
├── Pages/
│   ├── Admin/              # Páginas de administrador
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── profile.jsx
│   │   └── RegisterList.jsx
│   ├── User/               # Páginas de funcionário
│   │   ├── Dashboard.jsx
│   │   └── Auth.jsx
│   └── Installer/          # Páginas de instalação
├── Components/
│   ├── layouts/
│   │   └── Layout.jsx
│   └── ui/                 # Componentes shadcn/ui
├── lib/
│   ├── api.js              # Funções de API
│   └── utils.js            # Utilidades
└── hooks/
    └── authUser.jsx        # Hook de autenticação
```

### Banco de Dados

```
users_admin (Administradores)
├── id
├── name
├── email
├── password (hash)
├── tax_id (CPF)
├── birth_date
├── occupation
├── zipcode, street, neighborhood, city, state
└── timestamps (created_at, updated_at)

users (Funcionários)
├── id
├── admin_id (FK)
├── name, email, password (hash)
├── tax_id (CPF), birth_date
├── occupation
├── zipcode, street, neighborhood, city, state
└── timestamps

punch_clock_logs (Registros de Ponto)
├── id
├── user_id (FK)
├── time (timestamp)
├── type (in/out)
└── timestamps
```

## 📖 Rotas Disponíveis

### Instalação (Sem autenticação)
- `GET /install` - Página inicial de instalação 
- `GET /install/info` - Configuração de banco de dados
- `POST /install` - Envio de configurações
- `POST /install/migrate` - Execução de migrações e seeders
- `GET /install/congratulations` - Página de conclusão

### Autenticação
- `GET /admin` - Login de administrador
- `POST /admin/login` - Envio de login admin
- `GET /` - Login de funcionário
- `POST /user/login` - Envio de login funcionário
- `POST /admin/logout` - Logout de admin
- `POST /user/logout` - Logout de funcionário

### Área do Administrador (Autenticado)
- `GET /admin/dashboard` - Dashboard do admin
- `GET /admin/profile` - Perfil do administrador
- `PUT /admin/profile/{admin}` - Atualizar perfil
- `PUT /admin/profile/change-password/{admin}` - Alterar senha
- `GET /admin/users` - Listar usuários
- `POST /admin/users` - Criar usuário
- `PUT /admin/users/{user}` - Atualizar usuário
- `DELETE /admin/users/{user}` - Deletar usuário
- `GET /admin/registers/list` - Listar registros de ponto

### Área do Funcionário (Autenticado)
- `GET /user/dashboard` - Dashboard do funcionário
- `POST /user/punch-clock` - Registrar ponto (entrada/saída)
- `GET /user/profile` - Perfil do funcionário
- `PUT /user/profile/{user}` - Atualizar perfil
- `PUT /user/profile/change-password/{user}` - Alterar senha

## 🔧 Variáveis de Ambiente

Edite o arquivo `.env` para configurar:

```env
APP_NAME="App Punch Clock"
APP_ENV=local
APP_DEBUG=true
APP_INSTALLED=true
APP_URL=http://localhost:8000
APP_TIMEZONE=America/Sao_Paulo

DB_CONNECTION=mysql
DB_HOST=mysql          # Use "mysql" no Docker, "127.0.0.1" localmente
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=2a[r{T+ewq

MAIL_FROM_ADDRESS=noreply@example.com
```

## 🐳 Serviços Docker Disponíveis

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| Aplicação | `http://localhost:8000` | - |
| phpMyAdmin | `http://localhost:8080` | root / `2a[r{T+ewq` |
| MySQL | `localhost:3306` | laravel / `2a[r{T+ewq` |

## 📝 Comandos Úteis

### Docker

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs da aplicação
docker-compose logs app-punch
```

## 🎨 Tecnologias Utilizadas

### Backend
- **Laravel 11** - Framework PHP moderno
- **Inertia.js** - Ponte entre Laravel e React
- **MySQL 8.0** - Banco de dados relacional

### Frontend
- **React 18** - Biblioteca de UI
- **Tailwind CSS v4** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI de alta qualidade
- **Lucide React** - Ícones SVG
- **Vite** - Build tool ultra-rápido

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **phpMyAdmin** - Interface web para MySQL

## 🚨 Troubleshooting

### Problema: Banco de dados não está conectando
```bash
# Verifique o status dos containers
docker-compose ps

# Verifique os logs do MySQL
docker-compose logs mysql

# Reinicie os containers
docker-compose down
docker-compose up -d
```

### Problema: Porta 8000 já está em uso
```bash
# Altere a porta no docker-compose.yml
# Ou mate o processo que está usando a porta (Windows):
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Problema: Erro de permissão em arquivos
```bash
# Dentro do container:
docker-compose exec app-punch chown -R www-data:www-data /var/www/html
docker-compose exec app-punch chmod -R 775 storage bootstrap/cache
```

### Problema: Aplicação não encontra migrations
```bash
# Reinicie o wizard de instalação acessando http://localhost:8000
# Ou execute manualmente:
docker-compose exec app-punch php artisan migrate:fresh --seed
```

## 📚 Documentação Adicional

- [Documentação Laravel](https://laravel.com/docs)
- [Documentação React](https://react.dev)
- [Documentação Inertia.js](https://inertiajs.com)
- [Documentação shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

**Bruno Gilberto**

- GitHub: [@Bruno-Gilberto](https://github.com/Bruno-Gilberto)
- Email: brunogilberto.nunes@gmail.com

## 📞 Suporte

Para relatórios de bugs ou sugestões, abra uma [issue](https://github.com/Bruno-Gilberto/app-punch-clock/issues).

---

**Desenvolvido usando Laravel e React**
