# desafio-ozmap

## Requisitos

| Ferramenta | Versão |
| ---------- | ------ |
| Node       | v18    |
| NPM        | v9     |
| Git        | v2     |
| MongoDB    | v7     |

## Instalação

Clone o repositório

```
git clone git@github.com:inolopesm/desafio-ozmap.git
```

Instale as dependências

```
npm install
```

## Configuração

Crie o arquivo de configuração com base no de exemplo

```
cp .env.example .env
```

Preencha as informações de acordo com seu ambiente

## Inicialização

Para rodar o projeto em modo de desenvolvimento:

```
npm run dev
```

Para rodar o projeto em modo de produção:

```
npm run build && npm run start
```

> O projeto também foi *dockerizado*, sendo o **`Dockerfile` para produção** e o **`docker-compose.yml` para desenvolvimento**
