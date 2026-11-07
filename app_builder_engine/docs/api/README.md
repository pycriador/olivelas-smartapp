# Referência de APIs (App Builder Engine)

Todas as rotas são prefixadas com `/api/v1` e seguem os contratos do padrão OpenAPI 3.1.

---

## 📌 Principais Endpoints

### 1. Project Builder (`/api/v1/builder`)
- **`POST /api/v1/builder/generate-plan`**: Transforma os requisitos de negócio em um Technical Blueprint completo para consumo de agentes de IA.

### 2. Knowledge Management (`/api/v1/knowledge`)
- **`GET /api/v1/knowledge/docs`**: Lista todos os documentos SDD indexados.
- **`GET /api/v1/knowledge/docs/{doc_id}`**: Retorna o conteúdo integral e metadados de uma especificação.
- **`GET /api/v1/knowledge/search?q={termo}`**: Busca semântica e por palavras-chave com snippets contextuais.

### 3. Component Catalog (`/api/v1/components`)
- **`GET /api/v1/components`**: Lista componentes de Frontend e Backend com filtros de camada e categoria.
- **`GET /api/v1/components/{id}`**: Especificação detalhada, props/interfaces TypeScript, imports permitidos e proibidos.

### 4. Rules Engine (`/api/v1/rules`)
- **`GET /api/v1/rules`**: Lista de regras arquiteturais, de segurança e de IA.
- **`POST /api/v1/rules/validate`**: Validação de código e detecção de violações arquiteturais.

### 5. Architecture Catalog (`/api/v1/architectures`)
- **`GET /api/v1/architectures`**: Lista padrões de arquitetura suportados.
- **`GET /api/v1/architectures/{id}`**: Detalhes, árvore de diretórios e fluxo de dados.

### 6. Template Engine (`/api/v1/templates`)
- **`GET /api/v1/templates`**: Catálogo de templates de código.
- **`POST /api/v1/templates/render`**: Renderiza código parametrizado.

### 7. AI Gateway (`/api/v1/ai`)
- **`POST /api/v1/ai/execute`**: Execução de prompts assistidos via AI-BAS.
