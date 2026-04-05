# Baara Article Rewrite — Design Spec

## Overview

A two-part blog series replacing the existing single Baara article (`src/content/blog/baara-agentic-task-execution.mdx`). Grounded in the Baara Next codebase (`baara-next/`), supported by generated imagery (Nano-Banana-Pro) and a live demo GIF (Chrome plugin capture).

## Central Thesis

**"The execution engine pattern — queue, sandbox, checkpoint, recover — is the missing layer between agent SDKs and production agent systems. When you make agent execution durable, intent scales. You stop being the bottleneck between what you want done and the agents doing it."**

## Target Audience

- **Primary A:** Fellow builders — engineers using or evaluating the Claude Agent SDK, interested in architectural decisions and patterns for durable agent systems
- **Primary B:** Technical leadership — evaluating the "agentic execution" pattern as a category, wanting to understand what changes when systems are built around AI agents

## Communication Strategy

Blend of two progressions:
1. **Bottleneck to freedom** — Start with the pain of synchronous agent interaction, show how each architectural layer removes a dependency on the human being present
2. **Inside out** — Start at the core abstraction (execution lifecycle), expand outward through each layer, showing how the full system composes into durable intent

Part 1 leans on progression (1). Part 2 leans on progression (2).

---

## Part 1: "Intent Should Be Durable"

**File:** `src/content/blog/baara-intent-should-be-durable.mdx`
**Length:** 8-10 minutes (~2,000-2,500 words)
**Audience tilt:** Leadership + builders (pattern-level)

### Frontmatter

```yaml
title: "Intent Should Be Durable: The Missing Layer Between Agent SDKs and Production Systems"
publishDate: 2026-04-05
description: "Agent SDKs give you tools and reasoning. They don't give you queues, checkpoints, or crash recovery. That gap is where your intent dies."
tags: ["ai-infrastructure", "open-source", "agent-sdk", "architecture", "durability"]
draft: false
readingTime: 9
heroImage: "/blog/baara-intent-durable-hero.png"
```

### Section Plan

#### 1. Opening: The Bottleneck (2-3 paragraphs)

Start with a concrete moment of babysitting an agent interaction. The agent is capable, but it needs you there — watching, re-prompting, recovering when it fails mid-task. You close the laptop, the work stops. Your intent didn't survive your absence.

Voice: concrete moment -> diagnosis -> principle. First-person authority grounded in the specific failure.

#### 2. What Baara v1 Taught Me (3-4 paragraphs)

Brief retrospective on the first version. 19 tools, 6 dependencies, vanilla JS UI, direct execution. It was a better interface to agents, but you were still the execution runtime. Direct execution meant synchronous presence. When a task failed at 2am, it waited for you.

Link to the v1->v2 evolution without dwelling on it. This section exists to establish that the pattern wasn't designed — it was discovered through use.

Voice: qualifying confession ("I was wrong about..."), tradeoff-first thinking.

#### 3. The Pattern: Durable Agentic Execution (core section, ~800 words)

Name the pattern. Four layers, each solving one dependency on the human:

**Queue** — removes timing dependency. Intent survives scheduling. You express what you want done and when. The system handles sequencing, priority, and concurrency. Four named queues (transfer, timer, visibility, dlq) with configurable concurrency.

**Sandbox** — removes environment dependency. Intent survives isolation. Three pluggable implementations (native, wasm, docker) behind a single `ISandbox` interface. The agent doesn't know or care which sandbox it runs in.

**Checkpoint** — removes continuity dependency. Intent survives crashes. Conversation-level checkpointing every N turns. Not event replay (agents are non-deterministic — you can't replay them). O(1) recovery: load the latest checkpoint, inject context, continue from turn N+1.

**Recovery** — removes failure dependency. Intent survives errors. Health monitor detects stuck executions. Retry with exponential backoff. Dead letter queue for human triage. The human becomes a reviewer of failures, not a babysitter of execution.

**Diagram: "The Bottleneck vs. The Engine"** — Two-panel diagram:
- Left: human in the center, arrows to/from every agent (synchronous, blocking)
- Right: human expresses intent once, intent flows through queue->sandbox->checkpoint->recovery, human only re-enters at triage

**Diagram: "Intent Flow"** — Linear flow showing intent moving through the four layers, with annotations showing what each layer makes durable.

#### 4. The Non-Determinism Insight (3-4 paragraphs)

The core technical insight that drove the architecture. Traditional durability frameworks (Temporal, event sourcing) assume deterministic replay. LLM agents are non-deterministic by nature — same prompt, different response. You can't replay an agent conversation and expect the same tool calls.

This single fact changes everything about how you build durable execution for agents. The answer: checkpoint the conversation state, not the execution events. Recovery means loading the last known conversation context and asking the agent to continue, not replaying from the beginning.

Code artifact: The `Checkpoint` type definition showing what gets captured.

```typescript
interface Checkpoint {
  id: string;
  executionId: string;
  turnCount: number;
  conversationHistory: ConversationMessage[];
  pendingToolCalls: string[];
  agentState: Record<string, unknown>;
  timestamp: string;
}
```

Voice: blunt declaration ("Let me be blunt about something"), metaphor as bridge (compare to trying to replay a conversation you had yesterday word-for-word).

#### 5. What Becomes Possible (3-4 paragraphs)

When intent is durable, the interaction model changes:
- Cron-scheduled agents that run overnight and report results in the morning
- Fire-and-forget task submission from CLI or chat
- Dead letter triage instead of babysitting — you review failures, not executions
- The human becomes a reviewer of outcomes, not a runtime for processes

Brief mention of the 27-tool MCP surface and three transports (stdio, HTTP, in-process) as evidence that the pattern generalizes across interfaces.

**Diagram: "Execution Lifecycle" (simplified)** — The 11-state machine rendered as a flow, but with annotations focused on which states are "human needed" vs "engine handles it." Show that most of the lifecycle runs without human involvement.

#### 6. Close: Transferable Principle

End with the principle: scaling your impact with AI agents isn't about having more agents or better prompts. It's about making your intent survive your absence. The execution engine is how you stop being the bottleneck.

Voice: closing pattern (transferable principle, not summary). Cultural depth if natural (baara as durable craft).

---

## Part 2: "Building the Engine"

**File:** `src/content/blog/baara-building-the-engine.mdx`
**Length:** 12-15 minutes (~3,000-3,500 words)
**Audience tilt:** Builders (architecture deep-dive)

### Frontmatter

```yaml
title: "Building the Engine: Architecture of a Durable Agentic Execution System"
publishDate: 2026-04-05
description: "A 10-package monorepo, 27 MCP tools, checkpoint-based durability, and three sandbox types. The full blueprint for Baara Next."
tags: ["ai-infrastructure", "open-source", "agent-sdk", "architecture", "typescript"]
draft: false
readingTime: 14
heroImage: "/blog/baara-building-engine-hero.png"
```

### Section Plan

#### 1. Opening (1-2 paragraphs)

"Part 1 described the pattern. This is the blueprint." Brief setup: what this post covers, link back to Part 1 for the "why." Set expectations: this is a technical deep-dive with code and diagrams at every layer.

#### 2. The Execution Lifecycle (4-5 paragraphs + diagram)

The 11-state machine is the spine of the system. Everything else exists to move executions through these states.

```
created -> queued -> assigned -> running -> completed
                                   |
                            waiting_for_input
                                   |
                             failed / timed_out
                                   |
                            retry_scheduled -> queued (retry)
                                   |
                            dead_lettered (exhausted)
```

Terminal states: completed, cancelled, dead_lettered.

Code artifact: `ExecutionStatus` type and the `Execution` interface (key fields only).

**Diagram: Full 11-state lifecycle** with transition labels showing what triggers each transition.

#### 3. The Store: SQLite as Single Source of Truth (3-4 paragraphs + diagram)

All state lives in SQLite via `bun:sqlite`. Synchronous reads (no async overhead for in-process queries). The `IStore` interface is the contract everything talks to — no SQL outside the store package.

Key tables: tasks, executions, execution_events, task_messages, threads, thread_messages, queues, input_requests.

Design decision: append-only `execution_events` for audit trail. `task_messages` as durable command queue (inbound commands to running executions, outbound checkpoints).

Code artifact: Key `IStore` method signatures showing the breadth of the contract.

**Diagram: Schema relationships** — simplified ERD showing how tasks -> executions -> events -> checkpoints relate.

#### 4. The Orchestrator: Coordination Without Coupling (4-5 paragraphs)

OrchestratorService is the coordinator. It doesn't execute — it manages state transitions, schedules work, and monitors health.

Sub-components:
- **QueueManager** — Four named queues with configurable concurrency. Dequeue is atomic: read + status transition in one operation. Priority tiers within each queue.
- **Scheduler** — Croner-based cron scheduling. Creates executions on schedule, enqueues them.
- **HealthMonitor** — Detects stuck executions (running with no heartbeat). Triggers recovery or dead-lettering.
- **Retry logic** — Exponential backoff. Configurable max retries (clamped 0-10). After exhaustion: dead letter queue.

Code artifact: The dequeue flow — how an execution moves from queued -> assigned -> delivered to agent.

#### 5. The Sandbox Model: Pluggable Isolation (4-5 paragraphs + diagram)

`ISandbox` is the interface. Three implementations share it. What varies: the isolation layer around the same Claude Code SDK execution.

- **Native** — No isolation. Direct in-process SDK execution. Fast, no overhead, accepts the crash-the-host tradeoff for personal use.
- **Wasm** — Extism WebAssembly plugin. Memory limits, CPU limits, optional network isolation. Real isolation without containers.
- **Docker** — Container-based. Full isolation. Stubbed, not implemented (honest limitation).

Code artifact: The `SandboxConfig` discriminated union showing how config varies per type.

**Diagram: Sandbox selection flow** — how `SandboxRegistry` picks the right sandbox based on task config.

#### 6. Checkpoint-Based Durability: The Core Innovation (5-6 paragraphs + diagram)

This is the hard part. Spend the most time here.

Why not replay: LLM agents are non-deterministic. Same prompt -> different tool calls -> different state. Event sourcing breaks. Temporal-style replay breaks.

The answer: checkpoint the conversation, not the events. `CheckpointService` writes every 5 turns (configurable), plus on HITL pause, clean completion, and explicit request. Stored in `task_messages` table (outbound direction).

Recovery flow:
1. HealthMonitor detects execution stuck in "running" with no heartbeat
2. Load latest checkpoint: `messageBus.readLatestCheckpoint(executionId)` — O(1) single row
3. Build recovery params: loaded checkpoint + recovery system prompt
4. Create new execution attempt with checkpoint injected
5. Agent receives conversation history + recovery context, continues from turn N+1

What is NOT recovered: in-flight tool results after last checkpoint. Agent must handle idempotency. This is the tradeoff — you lose at most 5 turns of work, not all of it.

Code artifact: `CheckpointService` checkpoint write logic and the recovery prompt builder.

**Diagram: Checkpoint recovery flow** — timeline showing normal execution, crash point, checkpoint load, and resumed execution.

#### 7. The MCP Surface: 27 Tools, Three Transports (3-4 paragraphs)

All 27 tools available uniformly across:
- **stdio** — Claude Code integration (MCP server mode)
- **HTTP** — `/mcp` endpoint for external clients
- **in-process** — Chat handler calls tools directly

Tool categories: Task management (6), Execution management (9), Queue management (4), Human-in-the-loop (2), Templates (2), Projects (2), Claude Code integration (2).

The key insight: the same tool implementations serve all three transports. No duplication, no divergence.

#### 8. The Chat System: SSE Streaming and Threads (3-4 paragraphs + diagram)

`POST /api/chat` returns `Content-Type: text/event-stream`. Real-time agent interaction with all 27 MCP tools available in-process.

Thread model: a thread is a persistent conversation container. A session is the SDK session file. First turn creates both; subsequent turns resume via `sessionId` and `threadId`.

Permission modes: auto (all tools execute), ask (each tool emits permission_request, blocks until client responds), locked (pre-approved tools only).

SSE event sequence showing the full lifecycle of a chat turn: system -> text_delta -> tool_use -> tool_result -> result -> done.

**Diagram: SSE event sequence** — swimlane showing client, server, and agent interactions during a chat turn.

#### 9. The Web UI (2-3 paragraphs + demo GIF)

Three-zone layout: ThreadList (sidebar), ChatWindow (center), ControlPanel (right — tasks, executions, queues tabs).

React 18 + Vite + Tailwind CSS 4. Zustand stores for chat state and thread state. Real-time execution monitoring through the control panel.

**This is where the demo GIF lives.** The GIF shows: creating a task via chat, the agent executing it, checking execution logs in the control panel, viewing the queue status.

#### 10. What I'd Do Differently (3-4 paragraphs)

Honest limitations section (credibility marker):
- Docker sandbox is stubbed, not implemented — real container isolation adds significant complexity
- HITL at scale is unresolved — the current model works for one human, not a team
- Wasm sandbox is promising but Extism integration has rough edges
- The 5-turn checkpoint interval is a guess — need production data to tune it
- Thread model doesn't support branching conversations (yet)

Voice: qualifying confession, tradeoff transparency.

#### 11. Close: The Pattern Is the Product

The specific implementation (TypeScript, Bun, SQLite) is one instantiation. What matters is the shape: queue, sandbox, checkpoint, recover. Any team building production agent systems will need these layers. Baara Next is a reference for how they compose.

End with the cultural thread: baara as durable craft. Work that survives.

---

## Visual Assets

### Generated Images (Nano-Banana-Pro)

| Image | Purpose | Size Target |
|-------|---------|-------------|
| Part 1 hero | Conceptual — intent flowing through an engine, abstract/geometric | 1280x720, web preset |
| Part 2 hero | Technical — blueprint/schematic aesthetic, monorepo architecture feel | 1280x720, web preset |
| Bottleneck illustration | Two-panel: human-as-bottleneck vs. durable-intent-flow | 1200x600, web preset |

### Architecture Diagrams (Mermaid/Excalidraw)

| Diagram | Part | Content |
|---------|------|---------|
| The Bottleneck vs. The Engine | 1 | Two-panel comparison |
| Intent Flow | 1 | Linear: intent -> queue -> sandbox -> checkpoint -> recovery |
| Execution Lifecycle (simplified) | 1 | 11-state machine with "human needed" annotations |
| Execution Lifecycle (full) | 2 | 11-state machine with all transitions labeled |
| Schema Relationships | 2 | Simplified ERD |
| Sandbox Selection Flow | 2 | Registry -> sandbox type selection |
| Checkpoint Recovery Flow | 2 | Timeline: execution -> crash -> checkpoint load -> resume |
| SSE Event Sequence | 2 | Swimlane: client/server/agent during chat turn |
| 10-Package Architecture | 2 | Package dependency graph |

### Demo GIF (Chrome Plugin Capture)

**Interactions to capture:**
1. Open Baara Next web UI (localhost:3000)
2. Create a task via chat ("create a task to check system status every hour")
3. Watch the agent use tools (create_task tool call visible in chat)
4. Switch to ControlPanel -> Executions tab, show execution status
5. Switch to ControlPanel -> Queues tab, show queue depths
6. Open execution logs (click into an execution detail)

**Target:** 15-30 second GIF, web-optimized size.

---

## File Changes

| Action | File | Notes |
|--------|------|-------|
| Replace | `src/content/blog/baara-agentic-task-execution.mdx` | Becomes Part 1 (new filename) |
| Create | `src/content/blog/baara-intent-should-be-durable.mdx` | Part 1 |
| Create | `src/content/blog/baara-building-the-engine.mdx` | Part 2 |
| Create | `public/blog/baara-intent-durable-hero.png` | Part 1 hero image |
| Create | `public/blog/baara-building-engine-hero.png` | Part 2 hero image |
| Create | `public/blog/baara-bottleneck-diagram.png` | Bottleneck illustration |
| Create | `public/blog/baara-*.png` | Architecture diagrams (multiple) |
| Create | `public/blog/baara-demo.gif` | Demo GIF |
| Delete | `public/blog/baara-hero.png` | Old hero image (replaced) |
| Delete | `public/blog/baara-architecture.png` | Old architecture diagram (replaced) |

---

## Style Requirements

Per `.claude/rules/`:
- Both posts open with confidentiality disclaimer
- Voice follows voice-reference.md throughout
- Blog post structure per writing-blog-posts.md
- Every conceptual claim backed by proof artifact (code, diagram, or demo)
- Honest limitations section in Part 2
- Section headings are declarative statements, not questions
- 1-2 earned humor moments per part
- Cultural/etymological thread (baara) woven through both parts
- Closing is transferable principle, not summary

## Implementation Order

1. Write Part 1 article content
2. Write Part 2 article content
3. Generate hero images (Nano-Banana-Pro)
4. Generate bottleneck illustration (Nano-Banana-Pro)
5. Create architecture diagrams (Mermaid rendered to PNG, or Excalidraw)
6. Capture demo GIF (Chrome plugin)
7. Optimize all images for web (nano-banana-pro optimize preset)
8. Delete old article and assets
9. Build verification (`npm run build`)
