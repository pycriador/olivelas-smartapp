#!/usr/bin/env node
/**
 * Loft App Builder Engine — AI Agent Integration Workflow (Node.js)
 * -----------------------------------------------------------------
 * Comprehensive end-to-end integration script demonstrating how an autonomous AI Agent
 * connects via REST API, obtains & manages JWT tokens, inspects building blocks,
 * composes an AI Blueprint, creates a project with database configuration,
 * validates architectural constraints, and registers SemVer snapshots.
 *
 * Compatible with Node.js 18+ (Native Fetch, ESM).
 */

const BASE_URL = (process.env.APP_BUILDER_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const API_V1 = `${BASE_URL}/api/v1`;

class AIAgentClientNode {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
    this.apiV1 = `${baseUrl}/api/v1`;
    this.accessToken = null;
    this.refreshToken = null;
    this.userClaims = null;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Loft-AIAgent-Node/1.0',
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  async checkHealth() {
    const res = await fetch(`${this.baseUrl}/health`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`Health check failed: ${res.status} ${res.statusText}`);
    return await res.json();
  }

  async authenticate(usernameOrEmail, password) {
    const user = usernameOrEmail || process.env.LOFT_ADMIN_USER || 'willian.jesus@loft.com.br';
    const pass = password || process.env.LOFT_ADMIN_PASSWORD || process.env.DEFAULT_ADMIN_PASSWORD || 'admin_dev_pass';

    const res = await fetch(`${this.apiV1}/iam/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username_or_email: user, password: pass }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Authentication failed (${res.status}): ${errText}`);
    }

    const json = await res.json();
    const data = json.data || {};
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.userClaims = data.user;
    return data;
  }

  async refreshAccessToken() {
    if (!this.refreshToken) throw new Error('No refresh token available.');
    const res = await fetch(`${this.apiV1}/iam/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken }),
    });
    if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
    const json = await res.json();
    const data = json.data || {};
    this.accessToken = data.access_token;
    if (data.refresh_token) this.refreshToken = data.refresh_token;
    return data;
  }

  async getCurrentUser() {
    const res = await fetch(`${this.apiV1}/iam/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch current user: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async discoverCatalog() {
    const [compsRes, rulesRes, archsRes] = await Promise.all([
      fetch(`${this.apiV1}/components`, { headers: this.getHeaders() }).then(r => r.json()),
      fetch(`${this.apiV1}/rules`, { headers: this.getHeaders() }).then(r => r.json()),
      fetch(`${this.apiV1}/architectures`, { headers: this.getHeaders() }).then(r => r.json()),
    ]);
    return {
      componentsCount: compsRes.data?.length || 0,
      rulesCount: rulesRes.data?.length || 0,
      architecturesCount: archsRes.data?.length || 0,
    };
  }

  async composeBlueprint(name, description, requirements) {
    const res = await fetch(`${this.apiV1}/ai/blueprints/compose`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        application: { name, description },
        requirements,
        generate_ai_rationale: true,
      }),
    });
    if (!res.ok) throw new Error(`Blueprint composition failed: ${res.status}`);
    return await res.json();
  }

  async createProject(name, description, tags = ['ai-agent', 'database-enabled']) {
    const res = await fetch(`${this.apiV1}/projects`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name,
        description,
        domain: 'Real Estate Core',
        architecture: 'Modular Monolith',
        architecture_id: 'arch-modular-monolith',
        tags,
      }),
    });
    if (!res.ok) throw new Error(`Project creation failed: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async configureProjectDatabase(projectId, dbConfig) {
    const res = await fetch(`${this.apiV1}/projects/${projectId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        requirements: [
          `Database Type: ${dbConfig.engine || 'postgresql'}`,
          `Connection Host: ${dbConfig.host || 'db.loft.internal'}`,
          `Connection Port: ${dbConfig.port || 5432}`,
          `Database Name: ${dbConfig.databaseName || 'loft_realestate_db'}`,
          `Connection Pooling: ${dbConfig.poolSize || 20} connections`,
          `SSL Mode: ${dbConfig.sslMode || 'require'}`,
          `Migrations Engine: ${dbConfig.migrations || 'alembic'}`,
        ],
        tags: [
          'ai-agent',
          `db:${dbConfig.engine || 'postgresql'}`,
          'pool:configured',
          'env:production',
        ],
      }),
    });
    if (!res.ok) throw new Error(`Project database configuration failed: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async validateArchitecture(architectureId, componentIds, ruleIds) {
    const res = await fetch(`${this.apiV1}/blueprints/validate-config`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        architecture_id: architectureId,
        component_ids: componentIds,
        rule_ids: ruleIds,
      }),
    });
    if (!res.ok) throw new Error(`Validation failed: ${res.status}`);
    return await res.json();
  }

  async createVersionSnapshot(projectId, version, changelog) {
    const res = await fetch(`${this.apiV1}/projects/${projectId}/versions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ version, changelog }),
    });
    if (!res.ok) throw new Error(`Version snapshot creation failed: ${res.status}`);
    const json = await res.json();
    return json.data;
  }
}

async function run() {
  console.log('='.repeat(80));
  console.log(' 🤖 LOFT APP BUILDER ENGINE — WORKFLOW DE INTEGRAÇÃO DE AGENTE DE IA (NODE.JS)');
  console.log('='.repeat(80));

  const client = new AIAgentClientNode();

  // Step 1: Health check
  console.log('\n[Etapa 1/7] 🔍 Verificando Health Check da Plataforma...');
  const health = await client.checkHealth();
  console.log(`   ✅ Plataforma Ativa: ${health.app} v${health.version} (${health.status})`);

  // Step 2: Authentication
  console.log('\n[Etapa 2/7] 🔐 Autenticando Agente de IA via IAM e Extraindo Token JWT...');
  const authData = await client.authenticate();
  const tokenPreview = client.accessToken ? `${client.accessToken.substring(0, 30)}...` : 'N/A';
  console.log(`   ✅ Autenticação bem-sucedida!`);
  console.log(`   🔑 JWT Bearer Token: ${tokenPreview}`);
  console.log(`   👤 Usuário Ativo: ${authData.user?.name} (${authData.user?.role})`);
  console.log(`   ⏱️  Expiração do Token: ${authData.expires_in} segundos`);

  // Step 2b: Token introspection
  const me = await client.getCurrentUser();
  console.log(`   🛡️  Permissões RBAC Carregadas: ${me.permissions?.length || 0} permissões`);

  // Step 3: Catalog discovery
  console.log('\n[Etapa 3/7] 📚 Explorando Catálogo de Blocos Construtivos e Golden Rules...');
  const catalog = await client.discoverCatalog();
  console.log(`   • Componentes de Engenharia: ${catalog.componentsCount}`);
  console.log(`   • Regras Arquiteturais:       ${catalog.rulesCount}`);
  console.log(`   • Padrões de Arquitetura:     ${catalog.architecturesCount}`);

  // Step 4: AI Blueprint composition
  console.log('\n[Etapa 4/7] 🧠 Solicitando Composição de Blueprint via AI Engine...');
  const requirements = [
    'Autenticação segura via JWT e RBAC',
    'Conexão com Banco de Dados PostgreSQL de alta performance',
    'Pool de conexões assíncrono com SQLAlchemy e Alembic migrations',
    'Tabela de propostas imobiliárias com filtros e paginação',
    'Golden Rules de segurança e envelope de API padronizado',
  ];
  const blueprint = await client.composeBlueprint(
    'Loft Portal Imobiliário Node.js Client',
    'Aplicação corporativa criada via Node.js AI Agent Client',
    requirements
  );
  console.log(`   ✅ Blueprint Composto: ID ${blueprint.blueprint_id}`);
  console.log(`   🏛️  Arquitetura Mapeada: ${blueprint.architecture}`);
  console.log(`   📦 Módulos: ${blueprint.identified_modules?.length || 0}`);
  console.log(`   🎨 Componentes UI: ${blueprint.identified_components?.length || 0}`);
  console.log(`   🛡️  Regras Canônicas: ${blueprint.identified_rules?.length || 0}`);

  // Step 5: Project creation & Database Configuration
  console.log('\n[Etapa 5/7] 🏗️  Criando Projeto e Configurando Conexão de Banco de Dados...');
  const project = await client.createProject(
    'Portal Imobiliário Node AI',
    'Projeto imobiliário com banco PostgreSQL orquestrado via Node.js',
    ['ai-agent', 'database:postgresql', 'node-sdk']
  );
  const projectId = project.id;
  console.log(`   ✅ Projeto Criado com Sucesso! ID: ${projectId}`);

  const dbConfig = {
    engine: 'postgresql',
    host: 'db.loft.internal',
    port: 5432,
    databaseName: 'loft_realestate_db',
    poolSize: 30,
    sslMode: 'require',
    migrations: 'alembic',
  };
  await client.configureProjectDatabase(projectId, dbConfig);
  console.log(`   ✅ Conexão com Banco de Dados Configurada no Projeto:`);
  console.log(`      • Engine: ${dbConfig.engine.toUpperCase()} (Host: ${dbConfig.host}:${dbConfig.port})`);
  console.log(`      • Database Name: ${dbConfig.databaseName}`);
  console.log(`      • Pool Size: ${dbConfig.poolSize} conexões simultâneas`);
  console.log(`      • Migrações: ${dbConfig.migrations}`);

  // Step 6: Architecture validation
  console.log('\n[Etapa 6/7] 🔍 Executando Validação de Regras Arquiteturais e Dependências...');
  const validation = await client.validateArchitecture(
    project.architecture_id || 'arch-modular-monolith',
    (blueprint.identified_components || []).slice(0, 5),
    (blueprint.identified_rules || []).slice(0, 5)
  );
  const isOk = validation.data?.status === 'ready' || validation.data?.can_publish;
  console.log(`   • Status da Validação: ${isOk ? '✅ APROVADO' : '⚠️ ALERTAS DETECTADOS'}`);

  // Step 7: SemVer release snapshot
  console.log('\n[Etapa 7/7] 🏷️  Gerando Snapshot de Versão (SemVer v1.0.0)...');
  const snapshot = await client.createVersionSnapshot(
    projectId,
    '1.0.0',
    'Release inicial via Node.js AI Agent com banco PostgreSQL'
  );
  console.log(`   ✅ Snapshot Criado: v${snapshot.version} por ${snapshot.created_by}`);
  console.log(`   📅 Timestamp: ${snapshot.created_at}`);

  console.log('\n' + '='.repeat(80));
  console.log(' 🎉 PIPELINE NODE.JS DO AGENTE DE IA CONCLUÍDO COM SUCESSO!');
  console.log('='.repeat(80));
}

run().catch((err) => {
  console.error('❌ Erro durante a execução do workflow:', err);
  process.exit(1);
});
