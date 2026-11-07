---
id: REF-AIOPS-APPS-012
title: "DataForge — Guia em linguagem simples"
status: "DRAFT"
owner: "aiops"
updated: "2026-08-31"
review_date: "2026-11-30"
---

# DataForge, em linguagem simples

> Language: pt-BR | [English (EN)](../../en/aiops-apps/dataforge-guide.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

> Prefere o detalhe técnico completo (arquitetura, integrações, evidências)? Veja a [especificação técnica](dataforge.md).

## O que é

DataForge é a plataforma interna onde squads da Loft organizam **projetos de dados**: sobem arquivos, comparam e reconciliam informações, e consultam dicionários de dados. Também é onde administradores gerenciam contas de serviço usadas por integrações automatizadas.

## Para quem serve

Squads internas que precisam cruzar ou validar dados entre sistemas usam o DataForge no dia a dia para isso. Administradores usam a mesma plataforma para gerenciar acessos de serviço. É uma ferramenta de uso **corporativo interno** — não é voltada a clientes externos da Loft.

## Por que importa

Se o DataForge fica indisponível, os fluxos de projeto e reconciliação de dados das squads que dependem dele ficam bloqueados até a plataforma voltar. Não há hoje um acordo formal de nível de serviço documentado — o impacto prático é "quem estava usando para reconciliar dados naquele momento fica travado".

## Como funciona, resumidamente

Por trás de uma interface web, o DataForge tem uma parte visual (o que você vê no navegador) e uma parte de back-end que processa os dados e fala com o banco onde tudo é armazenado. Ele também se conecta a ferramentas internas da Loft para autenticação, monitoramento e segredos — nada disso precisa ser entendido para usar o produto, só para mantê-lo.

## Quer se aprofundar?

- Arquitetura, stack e integrações completas: [dataforge.md](dataforge.md)
- Como o repositório funciona por dentro: [README técnico no GitHub](https://github.com/loft-br/aiops-dataforge/blob/main/README.md)
- Catálogo de todas as aplicações do time: [../aiops-team/applications.md](../aiops-team/applications.md)
