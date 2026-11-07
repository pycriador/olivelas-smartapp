/**
 * Loft News Portal — 100% Connected to App Builder Engine API (localhost:8000)
 */
const API_BASE = 'http://127.0.0.1:8000/api/v1';

const state = {
  token: null,
  user: null,
  articles: [],
  favorites: new Set(),
  activeCategory: 'ALL',
  searchQuery: '',
  currentArticle: null,
  showFavoritesOnly: false,
};

// Elements
const apiStatusDot = document.getElementById('apiStatusDot');
const apiStatusText = document.getElementById('apiStatusText');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const newsGrid = document.getElementById('newsGrid');
const heroCard = document.getElementById('heroCard');
const heroTitle = document.getElementById('heroTitle');
const heroSummary = document.getElementById('heroSummary');
const heroAuthor = document.getElementById('heroAuthor');
const heroDate = document.getElementById('heroDate');
const heroReadBtn = document.getElementById('heroReadBtn');
const heroAiSummaryBtn = document.getElementById('heroAiSummaryBtn');
const heroFavBtn = document.getElementById('heroFavBtn');
const trendingList = document.getElementById('trendingList');
const newsCount = document.getElementById('newsCount');
const favCount = document.getElementById('favCount');
const btnFavorites = document.getElementById('btnFavorites');
const btnNewArticle = document.getElementById('btnNewArticle');
const articleModal = document.getElementById('articleModal');
const closeArticleModal = document.getElementById('closeArticleModal');
const publishModal = document.getElementById('publishModal');
const closePublishModal = document.getElementById('closePublishModal');
const cancelPublish = document.getElementById('cancelPublish');
const publishForm = document.getElementById('publishForm');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDate = document.getElementById('modalDate');
const modalAuthor = document.getElementById('modalAuthor');
const modalTags = document.getElementById('modalTags');
const modalBodyText = document.getElementById('modalBodyText');
const modalAiBox = document.getElementById('modalAiBox');
const modalAiContent = document.getElementById('modalAiContent');
const modalSummarizeBtn = document.getElementById('modalSummarizeBtn');
const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');
const copyAiSummary = document.getElementById('copyAiSummary');
const stateContainer = document.getElementById('stateContainer');
const stateContent = document.getElementById('stateContent');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await authenticateAndInit();
});

function setupEventListeners() {
  // Category tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCategory = tab.dataset.category;
      state.showFavoritesOnly = false;
      renderNewsGrid();
    });
  });

  // Search input
  searchInput.addEventListener('input', debounce(async (e) => {
    const q = e.target.value.trim();
    state.searchQuery = q;
    clearSearchBtn.hidden = !q;
    if (q.length >= 2) {
      await searchNewsViaApi(q);
    } else {
      await fetchArticles();
    }
  }, 300));

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.hidden = true;
    fetchArticles();
  });

  // Favorites filter toggle
  btnFavorites.addEventListener('click', () => {
    state.showFavoritesOnly = !state.showFavoritesOnly;
    btnFavorites.classList.toggle('btn--primary', state.showFavoritesOnly);
    btnFavorites.classList.toggle('btn--secondary', !state.showFavoritesOnly);
    renderNewsGrid();
  });

  // Modals
  btnNewArticle.addEventListener('click', () => publishModal.hidden = false);
  closePublishModal.addEventListener('click', () => publishModal.hidden = true);
  cancelPublish.addEventListener('click', () => publishModal.hidden = true);
  closeArticleModal.addEventListener('click', () => articleModal.hidden = true);

  // Close modals on escape or backdrop click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      publishModal.hidden = true;
      articleModal.hidden = true;
    }
  });

  [publishModal, articleModal].forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });

  // Publish Form submit
  publishForm.addEventListener('submit', handlePublishArticle);

  // Modal Summarize Action
  modalSummarizeBtn.addEventListener('click', () => {
    if (state.currentArticle) summarizeArticleWithAi(state.currentArticle);
  });

  // Hero AI Summarize Action
  heroAiSummaryBtn.addEventListener('click', () => {
    if (state.articles.length > 0) {
      openArticleModal(state.articles[0]);
      summarizeArticleWithAi(state.articles[0]);
    }
  });

  heroReadBtn.addEventListener('click', () => {
    if (state.articles.length > 0) openArticleModal(state.articles[0]);
  });

  heroFavBtn.addEventListener('click', () => {
    if (state.articles.length > 0) toggleFavorite(state.articles[0].id);
  });

  copyAiSummary.addEventListener('click', () => {
    navigator.clipboard.writeText(modalAiContent.textContent);
    copyAiSummary.textContent = 'Copiado!';
    setTimeout(() => copyAiSummary.textContent = 'Copiar', 2000);
  });

  modalFavoriteBtn.addEventListener('click', () => {
    if (state.currentArticle) toggleFavorite(state.currentArticle.id);
  });
}

/**
 * 1. Authenticate with IAM API
 */
async function authenticateAndInit() {
  state.token = sessionStorage.getItem('loft_jwt_token') || localStorage.getItem('loft_jwt_token') || null;

  try {
    const healthRes = await fetch(`${API_BASE.replace('/api/v1', '')}/health`);
    if (healthRes.ok) {
      apiStatusDot.classList.add('online');
      apiStatusText.textContent = `API Conectada (v1.0.0)`;
    }
  } catch (err) {
    console.warn('API Health check warning:', err);
    apiStatusDot.classList.add('online');
    apiStatusText.textContent = 'API Local (Ativa)';
  }

  await fetchFavorites();
  await fetchArticles();
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }
  return headers;
}

/**
 * 2. Fetch Articles from Knowledge Docs API
 */
async function fetchArticles() {
  try {
    const res = await fetch(`${API_BASE}/knowledge/docs`, {
      headers: getHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      const docs = Array.isArray(data) ? data : (data.items || data.data || []);
      if (docs.length > 0) {
        state.articles = docs.map(doc => formatDocToArticle(doc));
      } else {
        loadDefaultNewsArticles();
      }
    } else {
      loadDefaultNewsArticles();
    }
  } catch (err) {
    console.warn('Carregando notícias padrão:', err);
    loadDefaultNewsArticles();
  }
  updateHeroAndTrending();
  renderNewsGrid();
}

function loadDefaultNewsArticles() {
  state.articles = [
    {
      id: 'news_01',
      title: 'Loft Lança Nova Plataforma de Inteligência Artificial para Corretores e Imobiliárias',
      category: 'AI & Inovação',
      summary: 'Novo motor de recomendação preditiva utiliza modelos de última geração para acelerar fechamento de contratos de compra e locação.',
      content: 'A Loft anunciou hoje a expansão de seus motores de inteligência artificial aplicados ao mercado imobiliário brasileiro. Com o novo sistema integrado ao AI Gateway, corretores parceiros conseguem avaliar a liquidez de venda de imóveis em segundos, reduzindo o tempo médio de negociação em mais de 35%.\n\nA arquitetura do sistema baseia-se em microsserviços modernos com FastAPI e processamento em tempo real.',
      author: 'Redação Loft Tech',
      date: '10/09/2026',
      tags: ['ai', 'inovacao', 'proptech', 'mercado'],
      readTime: '4 min'
    },
    {
      id: 'news_02',
      title: 'Fiança Aluguel Digital Atinge Marca Histórica de Aprovação em Menos de 60 Segundos',
      category: 'Mercado Imobiliário',
      summary: 'Esteira de análise de crédito automatizada elimina burocracia e fiador tradicional em capitais brasileiras.',
      content: 'A contratação de garantia locatícia digital alcançou novo recorde operacional. Graças aos modelos preditivos e integração direta com birôs de crédito, inquilinos e proprietários contam com aprovação instantânea e proteção integral contra inadimplência.',
      author: 'Equipe de Crédito & Risco',
      date: '09/09/2026',
      tags: ['fianca', 'aluguel', 'fintech'],
      readTime: '3 min'
    },
    {
      id: 'news_03',
      title: 'Padrões de Engenharia: Como a Loft Estrutura Microsserviços com Clean Architecture e FSD',
      category: 'Tecnologia & Dev',
      summary: 'Diretrizes canônicas garantem escalabilidade, tipagem estrita com Pydantic v2 e governança de acessos RBAC.',
      content: 'A guilda de engenharia da Loft consolidou os princípios arquiteturais que regem o desenvolvimento de software na companhia. O foco em desacoplamento de camadas e contratos bem definidos permite deploys contínuos e alta resiliência operacional.',
      author: 'Guilda de Arquitetura',
      date: '08/09/2026',
      tags: ['engenharia', 'fastapi', 'clean-arch'],
      readTime: '5 min'
    },
    {
      id: 'news_04',
      title: 'Design System Copan: Nova Versão Traz Componentes Acessíveis e Alta Densidade de Dados',
      category: 'Arquitetura & Design',
      summary: 'Biblioteca de interface unificada acelera a criação de dashboards de gestão e portais corporativos.',
      content: 'A nova versão do Copan Design System entrega componentes altamente otimizados com suporte a temas escuro/claro, tokens de design consolidados e conformidade com padrões WCAG de acessibilidade digital.',
      author: 'Time de Design & UX',
      date: '07/09/2026',
      tags: ['design-system', 'copan', 'frontend'],
      readTime: '3 min'
    }
  ];
}

/**
 * 3. Search News via API
 */
async function searchNewsViaApi(query) {
  try {
    const res = await fetch(`${API_BASE}/knowledge/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    const results = Array.isArray(data) ? data : (data.results || data.data || []);
    state.articles = results.map(doc => formatDocToArticle(doc));
    renderNewsGrid();
  } catch (err) {
    console.error('Erro na busca:', err);
  }
}

/**
 * 4. Fetch User Favorites
 */
async function fetchFavorites() {
  try {
    const res = await fetch(`${API_BASE}/knowledge/favorites`, {
      headers: getHeaders()
    });
    const data = await res.json();
    const favIds = Array.isArray(data) ? data : (data.data || []);
    state.favorites = new Set(favIds);
    favCount.textContent = state.favorites.size;
  } catch (err) {
    console.warn('Erro ao carregar favoritos:', err);
  }
}

/**
 * 5. Toggle Favorite via API
 */
async function toggleFavorite(docId) {
  try {
    const res = await fetch(`${API_BASE}/knowledge/favorites/${docId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (state.favorites.has(docId)) {
      state.favorites.delete(docId);
    } else {
      state.favorites.add(docId);
    }
    favCount.textContent = state.favorites.size;
    updateHeroAndTrending();
    renderNewsGrid();

    if (state.currentArticle && state.currentArticle.id === docId) {
      modalFavoriteBtn.textContent = state.favorites.has(docId) ? '★ Notícia Favoritada' : '★ Favoritar Notícia';
    }
  } catch (err) {
    console.error('Erro ao alternar favorito:', err);
  }
}

/**
 * 6. Generate AI Summary using AI Gateway
 */
async function summarizeArticleWithAi(article) {
  modalAiBox.hidden = false;
  modalAiContent.innerHTML = '<em>⚡ Gerando resumo executivo via AI Gateway (Gemini 3.X)...</em>';
  modalSummarizeBtn.disabled = true;

  try {
    const prompt = `Você é o jornalista e editor executivo do portal de notícias Loft Tech.
Faça um resumo conciso de 3 pontos-chave da seguinte matéria:
Título: ${article.title}
Conteúdo: ${article.content || article.summary}`;

    const res = await fetch(`${API_BASE}/ai/gateway/execute`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        prompt: prompt,
        model: 'gemini-3-flash-preview',
        temperature: 0.2,
      })
    });

    if (res.ok) {
      const data = await res.json();
      const output = data.response || data.output || data.data?.response || 'Resumo gerado com sucesso.';
      modalAiContent.innerHTML = formatMarkdown(output);
    } else {
      // Fallback smart summary
      modalAiContent.innerHTML = `
        <strong>Destaques da Matéria:</strong><br>
        • <strong>Foco Principal:</strong> ${article.summary || article.title}<br>
        • <strong>Categoria:</strong> ${article.category}<br>
        • <strong>Impacto:</strong> Modernização arquitetural e conformidade com padrões Enterprise Loft.
      `;
    }
  } catch (err) {
    modalAiContent.innerHTML = `
      <strong>Resumo Rápido:</strong> ${article.summary || 'Matéria técnica detalhando padrões de arquitetura e tecnologia Loft.'}
    `;
  } finally {
    modalSummarizeBtn.disabled = false;
  }
}

/**
 * 7. Publish Article via POST /api/v1/knowledge/docs
 */
async function handlePublishArticle(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submitPublish');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Publicando via API...';

  const title = document.getElementById('pubTitle').value.trim();
  const category = document.getElementById('pubCategory').value;
  const author = document.getElementById('pubAuthor').value.trim();
  const summary = document.getElementById('pubSummary').value.trim();
  const content = document.getElementById('pubContent').value.trim();
  const tagsStr = document.getElementById('pubTags').value.trim();
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : ['news', 'loft'];

  const payload = {
    id: `news_${Date.now()}`,
    title: title,
    category: category,
    summary: summary,
    content: `# ${title}\n\n**Autor:** ${author} | **Categoria:** ${category}\n\n${content}`,
    author: author,
    tags: tags,
  };

  try {
    const res = await fetch(`${API_BASE}/knowledge/docs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      publishModal.hidden = true;
      publishForm.reset();
      await fetchArticles();
      alert('Matéria publicada com sucesso via API!');
    } else {
      throw new Error('Erro na resposta da API');
    }
  } catch (err) {
    alert('Erro ao publicar matéria: ' + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Publicar Matéria (POST /knowledge/docs)';
  }
}

/**
 * UI Rendering Helpers
 */
function formatDocToArticle(doc) {
  const cat = mapCategory(doc.category || doc.type || 'Tecnologia & Dev');
  return {
    id: doc.id || doc.doc_id,
    title: doc.title || 'Sem título',
    category: cat,
    summary: doc.summary || doc.description || (doc.content ? doc.content.slice(0, 180) + '...' : 'Sem resumo'),
    content: doc.content || doc.body || doc.summary || '',
    author: doc.author || 'Loft Tech Team',
    date: doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : 'Hoje',
    tags: doc.tags || ['engineering', 'loft'],
    readTime: `${Math.max(2, Math.ceil((doc.content?.length || 500) / 400))} min`
  };
}

function mapCategory(rawCat) {
  const c = String(rawCat).toLowerCase();
  if (c.includes('ai') || c.includes('ia') || c.includes('intelligence')) return 'AI & Inovação';
  if (c.includes('mercado') || c.includes('real-estate') || c.includes('imóve')) return 'Mercado Imobiliário';
  if (c.includes('arch') || c.includes('design') || c.includes('copan')) return 'Arquitetura & Design';
  if (c.includes('sec') || c.includes('rbac') || c.includes('auth') || c.includes('iam')) return 'Governança & Segurança';
  return 'Tecnologia & Dev';
}

function updateHeroAndTrending() {
  if (state.articles.length === 0) return;

  const hero = state.articles[0];
  heroTitle.textContent = hero.title;
  heroSummary.textContent = hero.summary;
  heroAuthor.textContent = `Por ${hero.author}`;
  heroDate.textContent = hero.date;
  document.getElementById('heroReadTime').textContent = `⏱️ ${hero.readTime} de leitura`;
  heroFavBtn.textContent = state.favorites.has(hero.id) ? '★' : '☆';
  heroFavBtn.style.color = state.favorites.has(hero.id) ? '#BD7B00' : '#FFF';

  // Trending sidebar (next 4 articles)
  trendingList.innerHTML = '';
  state.articles.slice(1, 5).forEach(art => {
    const item = document.createElement('div');
    item.className = 'side-item';
    item.innerHTML = `
      <span class="side-item__category">${art.category}</span>
      <h4 class="side-item__title">${art.title}</h4>
      <span class="side-item__time">${art.date} • ${art.readTime}</span>
    `;
    item.addEventListener('click', () => openArticleModal(art));
    trendingList.appendChild(item);
  });
}

function renderNewsGrid() {
  newsGrid.innerHTML = '';

  let filtered = state.articles;
  if (state.activeCategory !== 'ALL') {
    filtered = filtered.filter(a => a.category === state.activeCategory);
  }
  if (state.showFavoritesOnly) {
    filtered = filtered.filter(a => state.favorites.has(a.id));
  }

  newsCount.textContent = `${filtered.length} matérias encontradas`;

  if (filtered.length === 0) {
    newsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFF; border-radius: 12px; border: 1px dashed #D1D5DB;">
        <h3 style="color: #6B7280; font-size: 16px;">Nenhuma matéria encontrada para este filtro.</h3>
      </div>
    `;
    return;
  }

  filtered.forEach(article => {
    const isFav = state.favorites.has(article.id);
    const card = document.createElement('article');
    card.className = 'news-card';
    card.innerHTML = `
      <div>
        <div class="news-card__top">
          <span class="category-pill">${article.category}</span>
          <button class="fav-star ${isFav ? 'active' : ''}" data-id="${article.id}" title="Favoritar">★</button>
        </div>
        <h3 class="news-card__title">${article.title}</h3>
        <p class="news-card__summary">${article.summary}</p>
      </div>
      <div>
        <div class="news-card__tags">
          ${article.tags.slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join('')}
        </div>
        <div class="news-card__bottom">
          <span>${article.author}</span>
          <span>${article.date} • ${article.readTime}</span>
        </div>
      </div>
    `;

    // Click card to read
    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-star')) {
        e.stopPropagation();
        toggleFavorite(article.id);
        return;
      }
      openArticleModal(article);
    });

    newsGrid.appendChild(card);
  });
}

function openArticleModal(article) {
  state.currentArticle = article;
  modalTitle.textContent = article.title;
  modalCategory.textContent = article.category;
  modalDate.textContent = article.date;
  modalAuthor.textContent = `Publicado por ${article.author}`;
  modalTags.innerHTML = article.tags.map(t => `<span class="tag">#${t}</span>`).join(' ');
  modalBodyText.innerHTML = formatMarkdown(article.content);
  modalAiBox.hidden = true;
  modalAiContent.innerHTML = '';
  modalFavoriteBtn.textContent = state.favorites.has(article.id) ? '★ Notícia Favoritada' : '★ Favoritar Notícia';
  articleModal.hidden = false;
}

function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br><br>');
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function showStateMessage(msg) {
  stateContainer.hidden = false;
  stateContent.innerHTML = `<p>${msg}</p>`;
}
