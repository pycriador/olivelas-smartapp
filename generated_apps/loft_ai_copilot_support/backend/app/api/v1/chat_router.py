from fastapi import APIRouter
from app.schemas.domain_schemas import ApiResponse, ChatMessageRequest, ChatMessageResponse

router = APIRouter(prefix="/chat", tags=["Chatbot & AI Copilot"])

KNOWLEDGE_BASE = [
    {
        "keywords": ["fiança", "fianca", "garantia", "aluguel", "locação", "locacao"],
        "reply": "A Fiança Aluguel Loft substitui fiador e caução com aprovação 100% digital em até 15 minutos. Cobre inadimplência de aluguel, condomínio, IPTU e danos ao imóvel com segurança jurídica integral.",
        "intent": "fianca_aluguel",
        "actions": ["Simular taxa de fiança", "Ver documentos necessários", "Falar com consultor"]
    },
    {
        "keywords": ["documento", "documentos", "comprovante", "requisito", "requisitos"],
        "reply": "Para análise de crédito instantânea, são necessários apenas: Documento oficial com foto (RG ou CNH), CPF, e Comprovante de Renda recente (Holerite, Extrato Bancário ou IRPF).",
        "intent": "documentacao_requisitos",
        "actions": ["Enviar documentos", "Consultar status de aprovação", "Dúvidas sobre renda conjunta"]
    },
    {
        "keywords": ["api", "integrar", "integracao", "integração", "desenvolvedor", "webhook", "endpoint"],
        "reply": "A Loft disponibiliza API REST e Webhooks para imobiliárias e parceiros emitirem garantias diretamente em seus CRMs ou ERPs com autenticação JWT e contratos OpenAPI 3.1.",
        "intent": "api_developer",
        "actions": ["Acessar Swagger API", "Gerar API Key", "Ver documentação técnica"]
    },
    {
        "keywords": ["prazo", "tempo", "demora", "taxa", "custo", "preco", "preço", "valor"],
        "reply": "Nossa taxa média varia de 8% a 10% do valor do aluguel anual, com parcelamento em até 12x no cartão de crédito ou boleto. A resposta de aprovação do crédito ocorre em média em menos de 15 minutos.",
        "intent": "taxas_e_prazos",
        "actions": ["Calcular orçamento", "Ver opções de pagamento", "Contratar online"]
    }
]

@router.post("/message", response_model=ApiResponse[ChatMessageResponse])
def send_chat_message(payload: ChatMessageRequest):
    msg_lower = payload.message.lower()
    matched = None
    for item in KNOWLEDGE_BASE:
        if any(kw in msg_lower for kw in item["keywords"]):
            matched = item
            break

    if matched:
        reply_text = matched["reply"]
        intent = matched["intent"]
        actions = matched["actions"]
    else:
        reply_text = f"Olá! Sou o Assistente Inteligente Loft Copan. Recebi sua mensagem: '{payload.message}'. Posso te ajudar com contratação de Fiança Aluguel, análise de crédito, envio de propostas ou integração com nossa API."
        intent = "general_support"
        actions = ["Como funciona a Fiança?", "Quais documentos preciso?", "Falar com suporte humano"]

    return ApiResponse(
        data=ChatMessageResponse(
            reply=reply_text,
            sender="assistant",
            intent=intent,
            confidence=0.98,
            suggested_actions=actions
        )
    )
