# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

HMCTS Possessions Prototype — an early-stage prototype for the UK court possession proceedings service. No application code exists yet; the repo currently contains only the dev environment configuration.

## Development Environment

This project uses a VS Code devcontainer (Docker-in-Docker, privileged). The container provides:
- Node.js LTS (via NVM)
- Docker, Azure CLI, kubectl, helm, minikube, kubelogin
- Playwright for browser testing
- Claude Code and GitHub Copilot CLI

The app is expected to run on **port 3000**.

To start the container manually outside VS Code:
```bash
bash .devcontainer/startcontainer.sh
```

## Business Context

Domain reference documents are in `.business_context/`:
- `State model and dependencies v0.10.pdf` — state machine and dependency model for possession cases
- `Event Model Possession Service V0.1.xlsx` — event model for the possession service

Consult these when making decisions about domain logic, state transitions, or event handling.

## Claude API / Bedrock

Claude runs via AWS Bedrock (eu-west-1). Model environment variables are set in `.devcontainer/claudeinit.sh`. When building AI features, use these model IDs:
- Opus: `eu.anthropic.claude-opus-4-6-v1`
- Sonnet: `eu.anthropic.claude-sonnet-4-6`
- Haiku: `eu.anthropic.claude-haiku-4-5-20251001-v1:0`
