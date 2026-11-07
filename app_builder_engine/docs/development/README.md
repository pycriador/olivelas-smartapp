# Guia de Desenvolvimento & Contribuição

## 🚀 Como Iniciar o Ambiente

### Pré-requisitos
- Python 3.13+
- Gerenciador de pacotes pip / uv / poetry

---

## 🏃 Executando a Aplicação Localmente

```bash
cd app_builder_engine
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

A documentação interativa Swagger estará disponível em:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## 🧪 Executando os Testes Automatizados

```bash
cd app_builder_engine
python3 -m pytest tests -v
```

---

## 📐 Padrões de Código & Linter

- **Formatação e Linter:** Ruff (`ruff check .` e `ruff format .`)
- **Tipagem Estrita:** Pydantic v2 + type hints nativos do Python 3.13 (`list[T]`, `X | None`, `def fn[T](...)`).
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
