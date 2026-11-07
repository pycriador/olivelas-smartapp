# 🛠️ Scripts de Automação & Geração de Aplicações

> Scripts executáveis para interagir com o **Olivelas App Builder Engine** e criar aplicações completas de forma 100% automática.

---

## 📋 Lista de Scripts Disponíveis

### 1. `generate_app.py` (Script Principal)
Gera qualquer aplicação sob demanda, com suporte a modo interativo e argumentos via linha de comando.

```bash
# Modo Interativo (faz perguntas guiadas no terminal)
python3 scripts/generate_app.py

# Modo 100% Automático via CLI flags
python3 scripts/generate_app.py \
  --name "Olivelas Fiança Aluguel" \
  --description "Esteira de garantia locatícia e esteira de risco de crédito" \
  --features "Autenticação JWT" "Tabela de Propostas" "Score de Risco" "App Switcher Copan" \
  --output-dir "generated_apps/loft-fianca-aluguel" \
  --non-interactive
```

---

### 2. `quickstart_fianca_app.py`
Gerador em 1 comando para a aplicação canônica **Olivelas Fiança Aluguel**:

```bash
python3 scripts/quickstart_fianca_app.py
```

---

### 3. `quickstart_crm_app.py`
Gerador em 1 comando para a aplicação **Olivelas CRM & Customer 360**:

```bash
python3 scripts/quickstart_crm_app.py
```

---

### 4. `demo_api_client.py`
Demonstração completa de todas as operações disponíveis no SDK `api_client`:

```bash
python3 scripts/demo_api_client.py
```

---

### 5. `ai_agent_workflow.py` (Workflow de Integração para Agentes de IA em Python)
Demonstração completa em Python para Agentes Autônomos de IA conectando via API, autenticando via JWT Bearer, compondo blueprints, criando projetos e configurando bancos de dados:

```bash
python3 scripts/ai_agent_workflow.py
```

---

### 6. `ai_agent_workflow.mjs` (Workflow de Integração para Agentes de IA em Node.js)
Demonstração completa em Node.js (ESM / native fetch) para Agentes Autônomos de IA:

```bash
node scripts/ai_agent_workflow.mjs
```

---

### 7. `ai_agent_workflow.sh` (Workflow de Integração para Agentes de IA via cURL & Bash)
Demonstração completa em Shell Script / cURL + jq:

```bash
bash scripts/ai_agent_workflow.sh
```

---

### 8. `verify_app_builder_api.py`
Suíte de testes de integração automatizada para validar o cliente contra a API:

```bash
python3 scripts/verify_app_builder_api.py
```

