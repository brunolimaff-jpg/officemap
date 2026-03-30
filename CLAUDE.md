# OfficeMaP — Skills Collection

This repository contains a curated collection of **31 Claude Code skills** that auto-activate based on the user's request. The skills are located in `.claude/skills/` and are compatible with Claude Code, Cursor, and other AI coding assistants.

## How Auto-Activation Works

Each skill file has a `description` field in its YAML frontmatter. Claude Code (and compatible tools) reads this description to decide when to automatically invoke the skill — no manual `/command` needed.

```yaml
---
name: "senior-architect"
description: This skill should be used when the user asks to "design system architecture"...
---
```

## Skills Index

### Document Processing
| Skill | File | Triggers on |
|-------|------|-------------|
| PDF | `pdf.md` | Any .pdf task: extract, merge, split, OCR, create |
| Word (DOCX) | `docx.md` | .docx creation, editing, reports, memos, letters |
| PowerPoint (PPTX) | `pptx.md` | Slide decks, presentations, pitch decks |
| Excel (XLSX) | `xlsx.md` | Spreadsheets, CSV/TSV, data tables, formulas |
| Doc Co-Authoring | `doc-coauthoring.md` | Collaborative document workflows |

### Frontend & Design
| Skill | File | Triggers on |
|-------|------|-------------|
| Frontend Design | `frontend-design.md` | Web UI, components, pages, dashboards |
| Web Artifacts Builder | `web-artifacts-builder.md` | React/Tailwind/shadcn HTML artifacts |
| Canvas Design | `canvas-design.md` | Posters, visual art, static designs |
| Algorithmic Art | `algorithmic-art.md` | Generative art, p5.js, flow fields |
| Theme Factory | `theme-factory.md` | Color themes, design systems |
| Brand Guidelines | `brand-guidelines.md` | Brand styling, visual identity |

### Engineering
| Skill | File | Triggers on |
|-------|------|-------------|
| Senior Architect | `senior-architect.md` | System design, ADRs, microservices vs monolith |
| Senior Frontend | `senior-frontend.md` | React, Next.js, TypeScript frontend dev |
| Senior Backend | `senior-backend.md` | Node.js, PostgreSQL, REST/GraphQL APIs |
| Senior Fullstack | `senior-fullstack.md` | End-to-end feature development |
| Senior DevOps | `senior-devops.md` | Docker, Kubernetes, CI/CD pipelines |
| Senior SecOps | `senior-secops.md` | Security operations, threat modeling |
| Code Reviewer | `code-reviewer.md` | Pull request reviews, code quality |
| Senior QA | `senior-qa.md` | Test strategy, quality assurance |
| TDD Guide | `tdd-guide.md` | Test-driven development workflows |
| Playwright Pro | `playwright-pro.md` | Advanced Playwright E2E testing |
| Web App Testing | `webapp-testing.md` | Python Playwright testing toolkit |
| MCP Builder | `mcp-builder.md` | MCP server development (TypeScript/Python) |
| Claude API | `claude-api.md` | Building apps with the Anthropic/Claude API |

### AI / Data Science
| Skill | File | Triggers on |
|-------|------|-------------|
| Senior Data Scientist | `senior-data-scientist.md` | Data analysis, experiments, statistics |
| Senior ML Engineer | `senior-ml-engineer.md` | MLOps, model deployment, LLM integration |
| Senior Prompt Engineer | `senior-prompt-engineer.md` | Prompt optimization, RAG, agent orchestration |
| Self-Improving Agent | `self-improving-agent.md` | Agent memory, skill extraction, pattern promotion |
| Skill Creator | `skill-creator.md` | Creating and optimizing new skills |

### Operations & Communication
| Skill | File | Triggers on |
|-------|------|-------------|
| Incident Commander | `incident-commander.md` | Incident response, on-call, postmortems |
| Internal Comms | `internal-comms.md` | Internal announcements, memos, updates |

## Usage with Other AI Tools

### Cursor
Place this repo in your project. Cursor reads `CLAUDE.md` for context. Reference skills directly:
> "Use the senior-architect skill to design the auth system"

### Perplexity / Other assistants
Copy the relevant `.claude/skills/*.md` file content into your system prompt or reference it as context.

### Claude Code
Skills auto-activate. Just describe your task naturally and the matching skill triggers automatically.

## Sources
- [anthropics/skills](https://github.com/anthropics/skills) — Official Anthropic skills
- [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) — Engineering team skills
