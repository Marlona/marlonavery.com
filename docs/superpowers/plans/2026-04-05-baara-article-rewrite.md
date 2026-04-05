# Baara Article Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing single Baara article with a two-part blog series grounded in the Baara Next codebase, supported by generated imagery and a live demo GIF.

**Architecture:** Two MDX blog posts, architecture diagrams (Mermaid rendered to PNG via Excalidraw MCP), hero images (Nano-Banana-Pro), and a Chrome-captured demo GIF. The old article and its assets are deleted after the new content is in place.

**Tech Stack:** Astro 5.0 MDX, Nano-Banana-Pro (image generation), Excalidraw MCP (diagrams), Chrome plugin (demo capture), nano-banana-pro optimize (image compression)

**Spec:** `docs/superpowers/specs/2026-04-05-baara-article-rewrite-design.md`

**Baara Next codebase:** `/Users/sdoumbouya/code/durable-agent-execution-engine/baara-next`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/content/blog/baara-intent-should-be-durable.mdx` | Part 1 article |
| Create | `src/content/blog/baara-building-the-engine.mdx` | Part 2 article |
| Create | `public/blog/baara-intent-durable-hero.png` | Part 1 hero image |
| Create | `public/blog/baara-building-engine-hero.png` | Part 2 hero image |
| Create | `public/blog/baara-bottleneck-vs-engine.png` | Bottleneck two-panel diagram |
| Create | `public/blog/baara-intent-flow.png` | Intent flow diagram |
| Create | `public/blog/baara-lifecycle-simplified.png` | Simplified execution lifecycle |
| Create | `public/blog/baara-lifecycle-full.png` | Full 11-state lifecycle |
| Create | `public/blog/baara-schema-erd.png` | Schema relationships ERD |
| Create | `public/blog/baara-sandbox-flow.png` | Sandbox selection flow |
| Create | `public/blog/baara-checkpoint-recovery.png` | Checkpoint recovery timeline |
| Create | `public/blog/baara-sse-sequence.png` | SSE event swimlane |
| Create | `public/blog/baara-package-architecture.png` | 10-package dependency graph |
| Create | `public/blog/baara-demo.gif` | Live demo capture |
| Delete | `src/content/blog/baara-agentic-task-execution.mdx` | Old article |
| Delete | `public/blog/baara-hero.png` | Old hero image |
| Delete | `public/blog/baara-architecture.png` | Old architecture diagram |

---

## Style References

Before writing any content, the worker MUST read and follow:
- `.claude/rules/voice-reference.md` — Sekou's writing voice (hard requirements)
- `.claude/rules/writing-blog-posts.md` — Blog structure, proof artifacts, peer feedback principles

Key requirements:
- Confidentiality disclaimer as first line after frontmatter
- Narrative hook opening (concrete moment, not thesis)
- Declarative section headings (not questions)
- Every conceptual claim backed by proof artifact (code snippet, diagram, or demo)
- 1-2 earned humor moments per part
- Closing is transferable principle, not summary
- Cultural/etymological thread (baara = work/craft in Mandinka)

---

## Task 1: Write Part 1 — "Intent Should Be Durable"

**Files:**
- Create: `src/content/blog/baara-intent-should-be-durable.mdx`
- Read: `.claude/rules/voice-reference.md`
- Read: `.claude/rules/writing-blog-posts.md`
- Read: `src/content/blog/baara-agentic-task-execution.mdx` (old article, for voice continuity)
- Read: `/Users/sdoumbouya/code/durable-agent-execution-engine/baara-next/packages/core/src/types.ts` (lines 71-82 for ExecutionStatus, lines 391-401 for Checkpoint)

- [ ] **Step 1: Read style guides**

Read these files to internalize voice and structure requirements before writing:
```
.claude/rules/voice-reference.md
.claude/rules/writing-blog-posts.md
src/content/blog/baara-agentic-task-execution.mdx
```

- [ ] **Step 2: Write the complete Part 1 article**

Create `src/content/blog/baara-intent-should-be-durable.mdx` with all content. Target 2,000-2,500 words (~9 min reading time).

The article follows this exact structure:

**Frontmatter:**
```yaml
---
title: "Intent Should Be Durable: The Missing Layer Between Agent SDKs and Production Systems"
publishDate: 2026-04-05
description: "Agent SDKs give you tools and reasoning. They don't give you queues, checkpoints, or crash recovery. That gap is where your intent dies."
tags: ["ai-infrastructure", "open-source", "agent-sdk", "architecture", "durability"]
draft: false
readingTime: 9
heroImage: "/blog/baara-intent-durable-hero.png"
---
```

**Section 1 — Opening: The Bottleneck (2-3 paragraphs)**
Concrete moment of babysitting an agent interaction. The agent is capable but needs you there — watching, re-prompting, recovering when it fails mid-task. Close the laptop, the work stops. Intent doesn't survive absence.

Voice: concrete moment -> diagnosis -> principle. First-person authority grounded in specific failure.

**Section 2 — "What Baara v1 Taught Me" (3-4 paragraphs)**
Brief retrospective on v1: 19 tools, 6 dependencies, vanilla JS UI, direct execution. It was a better *interface* to agents, but you were still the execution runtime. Direct execution = synchronous presence. When a task failed at 2am, it waited for you.

The pattern wasn't designed — it was discovered through use. Include qualifying confession ("I was wrong about...").

**Section 3 — "The Durable Agentic Execution Pattern" (~800 words, core section)**
Name the pattern. Four layers, each solving one dependency on the human:

- **Queue** — removes timing dependency. Intent survives scheduling. Four named queues (transfer, timer, visibility, dlq) with configurable concurrency.
- **Sandbox** — removes environment dependency. Intent survives isolation. Three pluggable implementations (native, wasm, docker) behind `ISandbox` interface.
- **Checkpoint** — removes continuity dependency. Intent survives crashes. Conversation-level checkpointing every N turns. O(1) recovery.
- **Recovery** — removes failure dependency. Intent survives errors. Health monitor, retry with exponential backoff, dead letter queue for human triage.

Reference diagrams by path (they'll be created in later tasks):
```mdx
![The Bottleneck vs. The Engine](/blog/baara-bottleneck-vs-engine.png)
![Intent Flow](/blog/baara-intent-flow.png)
```

**Section 4 — "The Non-Determinism Insight" (3-4 paragraphs)**
Core technical insight: traditional durability (Temporal, event sourcing) assumes deterministic replay. LLM agents are non-deterministic. Same prompt -> different tool calls -> different state. You can't replay them.

The answer: checkpoint the conversation state, not the execution events. Recovery = load last conversation context + continue.

Include the Checkpoint type as code artifact:
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

Voice: blunt declaration, metaphor as bridge (compare to replaying a conversation word-for-word).

**Section 5 — "What Becomes Possible" (3-4 paragraphs)**
When intent is durable: cron-scheduled agents, fire-and-forget submission, dead letter triage instead of babysitting. The human becomes a reviewer of outcomes, not a runtime for processes.

Brief mention of 27-tool MCP surface and three transports as evidence the pattern generalizes.

Reference lifecycle diagram:
```mdx
![Execution Lifecycle](/blog/baara-lifecycle-simplified.png)
```

**Section 6 — Close: Transferable Principle**
Scaling impact with AI agents = making intent survive absence. The execution engine removes the bottleneck. Cultural thread: baara as durable craft.

- [ ] **Step 3: Verify frontmatter is valid**

Check that all required fields (title, publishDate, description) are present and optional fields match the schema from `src/content/config.ts`.

- [ ] **Step 4: Commit Part 1**

```bash
git add src/content/blog/baara-intent-should-be-durable.mdx
git commit -m "blog: add Part 1 — Intent Should Be Durable"
```

---

## Task 2: Write Part 2 — "Building the Engine"

**Files:**
- Create: `src/content/blog/baara-building-the-engine.mdx`
- Read: `.claude/rules/voice-reference.md`
- Read: `.claude/rules/writing-blog-posts.md`
- Read: `src/content/blog/baara-intent-should-be-durable.mdx` (Part 1, for continuity)
- Read: Multiple Baara Next source files (listed below per section)

**Baara Next code references (read for code artifacts):**
- `packages/core/src/types.ts` — ExecutionStatus (L71-82), Execution (L235-259), SandboxConfig (L38-61), Checkpoint (L391-401), SandboxEvent (L411-418)
- `packages/core/src/interfaces/sandbox.ts` — ISandbox (L131-162)
- `packages/core/src/interfaces/store.ts` — IStore (L36-429)
- `packages/core/src/interfaces/message-bus.ts` — IMessageBus (L36-101)
- `packages/executor/src/checkpoint-service.ts` — CheckpointService (L27-68)
- `packages/executor/src/recovery.ts` — buildRecoveryPrompt (L33-95)
- `packages/orchestrator/src/queue-manager.ts` — dequeue (L50-58)
- `packages/server/src/routes/chat.ts` — SSE event types (L293-514)

All paths above are relative to `/Users/sdoumbouya/code/durable-agent-execution-engine/baara-next/`.

- [ ] **Step 1: Read style guides and Part 1**

```
.claude/rules/voice-reference.md
.claude/rules/writing-blog-posts.md
src/content/blog/baara-intent-should-be-durable.mdx
```

- [ ] **Step 2: Read Baara Next source files for code artifacts**

Read the source files listed above. Extract the exact code snippets to embed in the article. Use the real types and interfaces — do not invent or approximate.

- [ ] **Step 3: Write the complete Part 2 article**

Create `src/content/blog/baara-building-the-engine.mdx` with all content. Target 3,000-3,500 words (~14 min reading time).

**Frontmatter:**
```yaml
---
title: "Building the Engine: Architecture of a Durable Agentic Execution System"
publishDate: 2026-04-05
description: "A 10-package monorepo, 27 MCP tools, checkpoint-based durability, and three sandbox types. The full blueprint for Baara Next."
tags: ["ai-infrastructure", "open-source", "agent-sdk", "architecture", "typescript"]
draft: false
readingTime: 14
heroImage: "/blog/baara-building-engine-hero.png"
---
```

**Section 1 — Opening (1-2 paragraphs)**
"Part 1 described the pattern. This is the blueprint." Link back to Part 1. Set expectations: technical deep-dive with code and diagrams at every layer.

**Section 2 — "The Execution Lifecycle" (4-5 paragraphs + diagram ref)**
11-state machine as the spine. Include `ExecutionStatus` type as code artifact. Include key fields from `Execution` interface. Explain terminal states (completed, cancelled, dead_lettered) and the retry -> dead_letter path.

Reference: `![Execution Lifecycle](/blog/baara-lifecycle-full.png)`

Code artifact — the ExecutionStatus type:
```typescript
export type ExecutionStatus =
  | "created"
  | "queued"
  | "assigned"
  | "running"
  | "waiting_for_input"
  | "completed"
  | "failed"
  | "timed_out"
  | "cancelled"
  | "retry_scheduled"
  | "dead_lettered";
```

**Section 3 — "SQLite as Single Source of Truth" (3-4 paragraphs + diagram ref)**
All state in SQLite via bun:sqlite. Synchronous reads. IStore as the contract. Key tables. Append-only execution_events. task_messages as durable command queue.

Reference: `![Schema Relationships](/blog/baara-schema-erd.png)`

Code artifact — key IStore method signatures (abbreviated, showing breadth):
```typescript
export interface IStore {
  // Tasks
  createTask(id: string, input: CreateTaskInput): Task;
  getTask(id: string): Task | null;
  listTasks(projectId?: string): Task[];

  // Executions
  createExecution(id: string, taskId: string, ...): Execution;
  dequeueExecution(queueName: string): Execution | null;
  updateExecutionStatus(id: string, status: ExecutionStatus, ...): void;

  // Events (append-only audit trail)
  appendEvent(event: ExecutionEvent): void;
  listEvents(executionId: string, opts?: {...}): ExecutionEvent[];

  // Durable message queue
  sendMessage(input: SendMessageInput): void;
  readLatestMessage(executionId: string, ...): TaskMessage | null;
}
```

**Section 4 — "Coordination Without Coupling" (4-5 paragraphs)**
OrchestratorService as coordinator (doesn't execute). QueueManager (4 queues, atomic dequeue), Scheduler (croner-based cron), HealthMonitor (stuck execution detection), retry logic (exponential backoff, clamped 0-10 retries, dead letter).

Code artifact — the dequeue method:
```typescript
dequeue(queueName: string): ReturnType<IStore["dequeueExecution"]> {
  return this.store.dequeueExecution(queueName);
}
```

Brief but honest: the dequeue is simple because the complexity lives in the store's atomic read+transition.

**Section 5 — "Pluggable Isolation" (4-5 paragraphs + diagram ref)**
ISandbox interface. Three implementations. What varies: isolation layer around same SDK execution.

- Native: no isolation, fast, crash-the-host tradeoff
- Wasm: Extism, memory/CPU limits, real isolation without containers
- Docker: stubbed (honest limitation)

Reference: `![Sandbox Selection](/blog/baara-sandbox-flow.png)`

Code artifact — SandboxConfig discriminated union:
```typescript
export type SandboxConfig =
  | { type: "native" }
  | { type: "wasm"; networkEnabled?: boolean; maxMemoryMb?: number; maxCpuPercent?: number; ports?: number[] }
  | { type: "docker"; image?: string; networkEnabled?: boolean; ports?: number[]; volumeMounts?: string[] };
```

**Section 6 — "Checkpoint-Based Durability" (5-6 paragraphs + diagram ref, LONGEST SECTION)**
Why not replay (non-deterministic agents). Checkpoint the conversation, not events. CheckpointService writes every 5 turns + on HITL pause + on completion.

Recovery flow: detect -> load checkpoint (O(1)) -> build recovery params -> create new attempt -> agent continues from turn N+1.

What is NOT recovered: in-flight tool results after last checkpoint. Tradeoff: lose at most 5 turns, not all.

Reference: `![Checkpoint Recovery](/blog/baara-checkpoint-recovery.png)`

Two code artifacts:

1. CheckpointService.checkpoint() method:
```typescript
checkpoint(turnCount: number): void {
  const cp: Checkpoint = {
    id: crypto.randomUUID(),
    executionId: this.executionId,
    turnCount,
    conversationHistory: this.getConversationHistory(),
    pendingToolCalls: this.getPendingToolCalls(),
    agentState: {},
    timestamp: new Date().toISOString(),
  };
  this.messageBus.writeCheckpoint(this.executionId, cp);
}
```

2. buildRecoveryPrompt() function:
```typescript
export function buildRecoveryPrompt(checkpoint: Checkpoint | null): string {
  if (!checkpoint) return "";
  const pendingStr = checkpoint.pendingToolCalls.length > 0
    ? `In-flight tool calls at checkpoint time: ${checkpoint.pendingToolCalls.join(", ")}.`
    : "No tool calls were in flight at checkpoint time.";
  return [
    "RECOVERY CONTEXT: This is a resumed execution.",
    `You completed ${checkpoint.turnCount} turns before interruption.`,
    pendingStr,
    "Check the current state and continue. Do not repeat completed work.",
  ].join("\n");
}
```

(Note: abbreviate the real function for readability — the full version from `recovery.ts` is longer but the blog should show the essence.)

**Section 7 — "27 Tools, Three Transports" (3-4 paragraphs)**
All 27 MCP tools uniform across stdio (Claude Code), HTTP (/mcp), in-process (chat). Tool categories: Task (6), Execution (9), Queue (4), HITL (2), Templates (2), Projects (2), Claude Code integration (2). Same implementations, no duplication.

**Section 8 — "SSE Streaming and Threads" (3-4 paragraphs + diagram ref)**
POST /api/chat returns SSE stream. Thread model (persistent conversation container) vs session (SDK session file). Permission modes (auto, ask, locked).

Reference: `![SSE Event Sequence](/blog/baara-sse-sequence.png)`

Code artifact — SSE event sequence:
```
event: message  { type: "system", sessionId, threadId, toolCount: 27 }
event: message  { type: "text_delta", delta: "I'll create" }
event: message  { type: "tool_use", name: "create_task", input: {...} }
event: message  { type: "tool_result", name: "create_task", output: {...} }
event: message  { type: "result", text: "Done!", cost: 0.002 }
event: done     { type: "done" }
```

**Section 9 — "The Web UI" (2-3 paragraphs + demo GIF ref)**
Three-zone layout: ThreadList, ChatWindow, ControlPanel. React 18 + Vite + Tailwind CSS 4. Zustand stores.

Reference: `![Baara Demo](/blog/baara-demo.gif)`

**Section 10 — "What I'd Do Differently" (3-4 paragraphs)**
Honest limitations:
- Docker sandbox is stubbed
- HITL at scale is unresolved (works for one human, not a team)
- Wasm/Extism integration has rough edges
- 5-turn checkpoint interval is a guess (need production data)
- Thread model doesn't support branching conversations

Voice: qualifying confession, tradeoff transparency.

**Section 11 — Close: "The Pattern Is the Product"**
Specific implementation (TypeScript, Bun, SQLite) is one instantiation. The shape matters: queue, sandbox, checkpoint, recover. Cultural thread: baara as durable craft. Work that survives.

- [ ] **Step 4: Verify frontmatter and image references**

Check that all required frontmatter fields are present. Verify all `![...]()` image references use paths matching the file map.

- [ ] **Step 5: Commit Part 2**

```bash
git add src/content/blog/baara-building-the-engine.mdx
git commit -m "blog: add Part 2 — Building the Engine"
```

---

## Task 3: Generate Hero Images

**Files:**
- Create: `public/blog/baara-intent-durable-hero.png`
- Create: `public/blog/baara-building-engine-hero.png`

Uses the nano-banana-pro skill (Gemini 3 Pro Image) for generation, then optimize for web.

- [ ] **Step 1: Generate Part 1 hero image**

Use nano-banana-pro to generate the Part 1 hero. Prompt direction:

> Abstract geometric visualization of intent flowing through a mechanical engine. Warm amber and deep indigo color palette. Clean lines, no text. The composition shows a single bright point of light (intent) entering a series of interlocking geometric chambers (queue, sandbox, checkpoint, recovery) and emerging amplified on the other side. Minimal, architectural, slightly futuristic. Dark background. 1280x720.

Save to `public/blog/baara-intent-durable-hero.png`.

- [ ] **Step 2: Optimize Part 1 hero for web**

Run the nano-banana-pro optimize script:
```bash
uv run --directory "${CLAUDE_PLUGIN_ROOT}" python "${CLAUDE_PLUGIN_ROOT}/skills/generate/scripts/optimize.py" public/blog/baara-intent-durable-hero.png --preset web
```

Verify file size is under 200KB. If the optimize script requires the full plugin root path, find it at:
`/Users/sdoumbouya/.claude/plugins/cache/fakoli-plugins/nano-banana-pro/1.3.3`

- [ ] **Step 3: Generate Part 2 hero image**

Use nano-banana-pro. Prompt direction:

> Technical blueprint schematic of a modular system architecture. Cool blue and white color palette on dark navy background. Shows interconnected packages as precise geometric blocks with clean connection lines between them. Engineering drawing aesthetic — grid lines, measurement marks, section callouts. No text labels. 1280x720.

Save to `public/blog/baara-building-engine-hero.png`.

- [ ] **Step 4: Optimize Part 2 hero for web**

Same optimize flow as Step 2 but for the Part 2 hero image.

- [ ] **Step 5: Commit hero images**

```bash
git add public/blog/baara-intent-durable-hero.png public/blog/baara-building-engine-hero.png
git commit -m "blog: add hero images for Baara two-part series"
```

---

## Task 4: Generate Bottleneck Illustration

**Files:**
- Create: `public/blog/baara-bottleneck-vs-engine.png`

- [ ] **Step 1: Generate two-panel illustration**

Use nano-banana-pro. Prompt direction:

> Two-panel comparison diagram, clean and minimal. Left panel labeled concept "BEFORE": a single human figure in the center with 6 radiating arrows connecting to agent icons around them — the human is the bottleneck, every connection goes through them. Right panel labeled concept "AFTER": the human figure at the top expressing intent downward into a horizontal pipeline of 4 connected chambers (queue, sandbox, checkpoint, recovery), with agent icons operating autonomously below. The human only connects back in at the end for review. Warm amber vs cool blue color coding for before/after. Dark background. 1200x600.

Save to `public/blog/baara-bottleneck-vs-engine.png`.

- [ ] **Step 2: Optimize for web**

```bash
uv run --directory "${CLAUDE_PLUGIN_ROOT}" python "${CLAUDE_PLUGIN_ROOT}/skills/generate/scripts/optimize.py" public/blog/baara-bottleneck-vs-engine.png --preset web
```

- [ ] **Step 3: Commit**

```bash
git add public/blog/baara-bottleneck-vs-engine.png
git commit -m "blog: add bottleneck vs engine illustration"
```

---

## Task 5: Create Architecture Diagrams

**Files:**
- Create: `public/blog/baara-intent-flow.png`
- Create: `public/blog/baara-lifecycle-simplified.png`
- Create: `public/blog/baara-lifecycle-full.png`
- Create: `public/blog/baara-schema-erd.png`
- Create: `public/blog/baara-sandbox-flow.png`
- Create: `public/blog/baara-checkpoint-recovery.png`
- Create: `public/blog/baara-sse-sequence.png`
- Create: `public/blog/baara-package-architecture.png`

Use the Excalidraw MCP tool (`mcp__claude_ai_Excalidraw__export_to_excalidraw`) to create each diagram, then export as PNG. Each diagram should use a consistent dark theme with amber/blue accent palette matching the hero images.

- [ ] **Step 1: Create Intent Flow diagram (Part 1)**

Linear flow: Human Intent -> Queue (timing) -> Sandbox (isolation) -> Checkpoint (continuity) -> Recovery (failure) -> Durable Outcome. Each stage annotated with what it makes durable.

Export to `public/blog/baara-intent-flow.png` at 1200px wide.

- [ ] **Step 2: Create Simplified Execution Lifecycle diagram (Part 1)**

The 11-state machine but with states color-coded:
- Green: engine handles automatically (created, queued, assigned, running, retry_scheduled)
- Yellow: may need human (waiting_for_input)
- Red: terminal (completed, failed, timed_out, cancelled, dead_lettered)

Annotate which transitions are automatic vs human-triggered. Show that most of the lifecycle runs without human involvement.

Export to `public/blog/baara-lifecycle-simplified.png` at 1200px wide.

- [ ] **Step 3: Create Full Execution Lifecycle diagram (Part 2)**

Complete 11-state machine with all transition labels:
- created -> queued (on submit)
- queued -> assigned (on dequeue)
- assigned -> running (on agent pickup)
- running -> completed (on success)
- running -> failed (on error)
- running -> timed_out (on timeout)
- running -> waiting_for_input (on HITL request)
- waiting_for_input -> running (on input received)
- failed -> retry_scheduled (if attempts < maxRetries)
- timed_out -> retry_scheduled (if attempts < maxRetries)
- retry_scheduled -> queued (after backoff delay)
- failed -> dead_lettered (if attempts >= maxRetries)
- timed_out -> dead_lettered (if attempts >= maxRetries)
- any non-terminal -> cancelled (on cancel request)

Export to `public/blog/baara-lifecycle-full.png` at 1200px wide.

- [ ] **Step 4: Create Schema ERD diagram (Part 2)**

Simplified ERD showing relationships:
```
tasks 1--* executions
executions 1--* execution_events
executions 1--* task_messages (inbound commands + outbound checkpoints)
executions *--1 threads
threads 1--* thread_messages
executions 1--? input_requests
tasks *--1 projects
queues (standalone config)
```

Export to `public/blog/baara-schema-erd.png` at 1200px wide.

- [ ] **Step 5: Create Sandbox Selection Flow diagram (Part 2)**

Flow: Task Config -> SandboxRegistry.get(type) -> switch on SandboxType:
- "native" -> NativeSandbox -> Direct SDK execution
- "wasm" -> WasmSandbox -> Extism plugin -> SDK execution
- "docker" -> DockerSandbox -> (stub, not implemented)

All three share ISandbox interface and produce SandboxInstance.

Export to `public/blog/baara-sandbox-flow.png` at 1200px wide.

- [ ] **Step 6: Create Checkpoint Recovery Flow diagram (Part 2)**

Timeline diagram:
```
Normal: turn 1 -> turn 2 -> turn 3 -> turn 4 -> turn 5 [CHECKPOINT] -> turn 6 -> turn 7 -> [CRASH]
Recovery: HealthMonitor detects -> Load checkpoint (turn 5) -> New execution attempt -> Recovery prompt injected -> turn 6' -> turn 7' -> ... -> completed
```

Show the gap between crash and recovery. Annotate: "Lost: turns 6-7. Recovered: conversation context through turn 5."

Export to `public/blog/baara-checkpoint-recovery.png` at 1200px wide.

- [ ] **Step 7: Create SSE Event Sequence diagram (Part 2)**

Swimlane with three columns: Client, Server, Agent SDK.

```
Client -> Server: POST /api/chat { message, threadId, sessionId }
Server -> Agent: query(prompt, tools, resume?)
Server -> Client: SSE { type: "system", sessionId, threadId, toolCount }
Agent -> Server: text delta
Server -> Client: SSE { type: "text_delta", delta }
Agent -> Server: tool_use(create_task, {...})
Server -> Client: SSE { type: "tool_use", name, input }
Server: execute tool in-process
Server -> Client: SSE { type: "tool_result", name, output }
Agent -> Server: final text
Server -> Client: SSE { type: "result", text, cost, usage }
Server -> Client: SSE { type: "done" }
```

Export to `public/blog/baara-sse-sequence.png` at 1200px wide.

- [ ] **Step 8: Create 10-Package Architecture diagram (Part 2)**

Package dependency graph:

```
core (shared types, interfaces)
  <- store (SQLite, IStore impl)
  <- executor (sandboxes, checkpoint, message bus)
  <- orchestrator (queue, scheduler, health, retry)
  <- agent (polling, turns, context)
  <- transport (dev + http bridges)
  <- server (Hono API, routes)
  <- mcp (27 tools, 3 transports)
  <- cli (Commander.js commands)
  <- web (React UI, Vite, Tailwind)
```

Show core at the bottom, everything depending on it. Server depends on orchestrator + agent + mcp. CLI depends on orchestrator + agent + mcp.

Export to `public/blog/baara-package-architecture.png` at 1200px wide.

- [ ] **Step 9: Optimize all diagrams for web**

Run the optimize script on each diagram PNG with `--preset web` (max 200KB, max 1200px width).

- [ ] **Step 10: Commit all diagrams**

```bash
git add public/blog/baara-intent-flow.png public/blog/baara-lifecycle-simplified.png public/blog/baara-lifecycle-full.png public/blog/baara-schema-erd.png public/blog/baara-sandbox-flow.png public/blog/baara-checkpoint-recovery.png public/blog/baara-sse-sequence.png public/blog/baara-package-architecture.png
git commit -m "blog: add architecture diagrams for Baara two-part series"
```

---

## Task 6: Capture Demo GIF

**Files:**
- Create: `public/blog/baara-demo.gif`

Uses Chrome plugin (mcp__claude-in-chrome__*) to interact with the running Baara Next server at localhost:3000 and capture a GIF.

**Prerequisite:** Baara Next server running on localhost:3000 (verified: it's up).

- [ ] **Step 1: Open Baara Next web UI**

Use Chrome plugin to navigate to `http://localhost:3000`. Get the tab context first, then create a new tab.

- [ ] **Step 2: Start GIF recording**

Use `mcp__claude-in-chrome__gif_creator` to begin recording. Name: `baara-demo.gif`. Capture extra frames before and after actions.

- [ ] **Step 3: Interact with the UI — create a task**

In the chat window, type and send: "create a task called 'system health check' that runs every hour to check system status"

Wait for the agent to respond and show tool calls (create_task visible in chat).

Capture frames showing:
- The message being typed
- The agent's streaming response
- Tool call indicators (tool_use / tool_result)

- [ ] **Step 4: Show the control panel — executions**

Click on the Executions tab in the ControlPanel (right side). Show the list of executions with their statuses.

Capture frames showing the execution list.

- [ ] **Step 5: Show the control panel — queues**

Click on the Queues tab. Show queue depths and worker counts.

Capture frames showing the queue status.

- [ ] **Step 6: View execution logs**

Click into an execution to see its detail view — events, logs, status transitions.

Capture frames showing the execution detail.

- [ ] **Step 7: Stop GIF recording and save**

Stop recording. Save the GIF to `public/blog/baara-demo.gif`.

Verify the GIF file size. If over 2MB, we may need to reduce frame rate or dimensions. Target: under 2MB for web.

- [ ] **Step 8: Optimize GIF if needed**

If the GIF is too large, use the optimize script or manually reduce dimensions.

- [ ] **Step 9: Commit demo GIF**

```bash
git add public/blog/baara-demo.gif
git commit -m "blog: add Baara Next demo GIF"
```

---

## Task 7: Delete Old Article and Assets

**Files:**
- Delete: `src/content/blog/baara-agentic-task-execution.mdx`
- Delete: `public/blog/baara-hero.png`
- Delete: `public/blog/baara-architecture.png`

- [ ] **Step 1: Verify no cross-references exist**

Search for "baara-agentic-task-execution" across the entire codebase to confirm nothing links to the old article URL.

```bash
grep -r "baara-agentic-task-execution" src/ public/ --include="*.mdx" --include="*.astro" --include="*.ts" --include="*.tsx"
```

Expected: no results (already verified during planning).

- [ ] **Step 2: Delete old files**

```bash
git rm src/content/blog/baara-agentic-task-execution.mdx
git rm public/blog/baara-hero.png
git rm public/blog/baara-architecture.png
```

- [ ] **Step 3: Commit deletion**

```bash
git commit -m "blog: remove old Baara article (replaced by two-part series)"
```

---

## Task 8: Build Verification

- [ ] **Step 1: Run the build**

```bash
cd /Users/sdoumbouya/code/sekoudoumbouya && npm run build
```

Expected: clean build with no errors. Both new articles should appear in the build output.

- [ ] **Step 2: Preview and verify**

```bash
npm run preview
```

Navigate to the blog page and verify:
- Both articles appear in the blog listing
- Part 1 renders correctly with all images and code blocks
- Part 2 renders correctly with all images, code blocks, and demo GIF
- Hero images load
- All diagram images load
- Demo GIF plays

- [ ] **Step 3: Final commit if any fixes needed**

If the build or preview revealed issues, fix them and commit:
```bash
git add -A
git commit -m "blog: fix build issues in Baara series"
```
