from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import ApplicationError, application_error_handler
from app.api.v1.proposals_router import router as proposals_router
from app.api.v1.chat_router import router as chat_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Starting stateless chatbot and landing page backend service (Zero SQL Database).")
    yield

app = FastAPI(
    title="Olivelas AI Copilot Support",
    description="API stateless desenvolvida e orquestrada via Olivelas App Builder Engine.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(ApplicationError, application_error_handler)

# Routers
app.include_router(proposals_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "Olivelas AI Copilot Support", "version": "1.0.0", "mode": "stateless-landing-page"}
