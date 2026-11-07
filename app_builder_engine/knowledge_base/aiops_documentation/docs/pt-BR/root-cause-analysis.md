# Análise de Causa Raiz

> Language: pt-BR | [English](../en/root-cause-analysis.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar causas e gaps após um incidente — sem colapsar tudo em um único slogan.

Métodos de RCA (5 Whys, fishbone, fault trees, etc.) são **opcionais**. Escolha um método que caiba no incidente, ou use narrativa estruturada. Prefira clareza a cerimônia.

## Distinções

| Term | Meaning |
| --- | --- |
| **Root cause** | Uma causa que, se adequadamente tratada, teria prevenido esta classe de incidente (pode haver mais de uma) |
| **Contributing factor** | Condição que aumentou probabilidade ou impacto, mas não foi suficiente sozinha |
| **Trigger** | O evento que precipitou a falha (deploy, pico de tráfego, outage de dependência, poison message) |
| **Detection gap** | Por que demorou demais para notar (sinal ausente, threshold ruim, sem ownership) |
| **Recovery gap** | Por que demorou demais para mitigar ou restaurar (runbook ausente, rollback inseguro, gap de skill/acesso) |

Não rotule um trigger como a única root cause quando condições mais profundas habilitaram o outage. Não invente uma única root cause quando a evidência sustenta um conjunto de fatores.

## Disciplina de evidência

Fundamente a RCA na [timeline do incidente](incident-timeline.md):

- FACT e CONFIRMED sustentam causas;
- HYPOTHESIS permanece rotulada até comprovada;
- UNKNOWN permanece UNKNOWN.

Classifique certainty: Confirmed / Inferred / Unknown / Proposed ([standards.md](standards.md)).

## Estrutura sugerida

| Section | Content |
| --- | --- |
| Summary | O que quebrou, impacto, duração |
| Trigger | O que iniciou |
| Root cause(s) | Com evidência |
| Contributing factors | Com evidência |
| Detection gap | Se houver |
| Recovery gap | Se houver |
| What went well | Opcional, mas útil |
| Corrective actions | Link [corrective-actions.md](corrective-actions.md) |

## Métodos (opcionais)

| Method | When it may help |
| --- | --- |
| 5 Whys | Cadeia causal linear |
| Causal graph / factor map | Múltiplos fatores interagindo |
| Fault tree | Lógica de falha conhecida |
| Timeline-only analysis | Incidentes pequenos |

Declare qual método foi usado, ou “narrative / timeline-based”.

## Anti-padrões

- “Erro humano” como root cause sem fatores sistêmicos (treinamento, UX, salvaguardas).
- Parar no trigger (“deploy ruim”) sem perguntar por que a config ruim passou.
- RCA que nunca produz [corrective actions](corrective-actions.md).

## Documentos relacionados

- [incident-timeline.md](incident-timeline.md)
- [post-incident-review.md](post-incident-review.md)
- [corrective-actions.md](corrective-actions.md)
- [failure-modes.md](failure-modes.md)
- [incident-management.md](incident-management.md)
