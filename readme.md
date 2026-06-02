# Sistema de Gestão de Academia – Full Stack

Sistema web desenvolvido para gerenciamento completo de academias, permitindo o controle de alunos, planos, personal trainers, treinos e frequência.

## Tecnologias Utilizadas

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* PostgreSQL
* Maven

### Frontend

* React
* React Router DOM
* Axios
* CSS

## Funcionalidades

### Alunos

* Cadastro de alunos
* Edição de dados
* Exclusão de registros
* Alteração de status (Ativo, Inativo e Suspenso)
* Busca por nome

### Planos

* Cadastro de planos
* Edição e exclusão
* Ativação e desativação
* Controle de valor e duração

### Personal Trainers

* Cadastro de profissionais
* Controle de disponibilidade
* Busca por especialidade

### Treinos

* Criação de fichas de treino
* Associação com alunos
* Associação opcional com personal trainer
* Controle de duração e descrição

### Frequência

* Registro de entrada
* Registro de saída
* Histórico de frequência
* Controle de check-in/check-out

## Estrutura do Projeto

```text
backend/
├── controller
├── service
├── repository
├── model
└── resources

frontend/
├── src
├── public
└── components
```

## Banco de Dados

O sistema utiliza PostgreSQL para armazenamento das informações.

Crie o banco:

```sql
CREATE DATABASE academia_db;
```

Configure as credenciais em:

```text
backend/src/main/resources/application.properties
```

## Como Executar

### Backend

```bash
cd backend
mvn spring-boot:run
```

A aplicação ficará disponível em:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm start
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Equipe

* Heron Marley Persaud dos Santos
* Júlia Nunes Vilela
* Nicolas Gomes Ruiz

## Curso

Tecnologia em Desenvolvimento de Software Multiplataforma

FATEC Praia Grande – SP

2026
