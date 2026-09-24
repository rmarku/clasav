# Clases y Aventuras — Go migration design

Date: 2026-09-24
Status: Draft for review

## 1. Intent

Revive "Clases y Aventuras" (2014–2017 UCC thesis project) as a **hobby / portfolio
project with full feature parity**. The original stack (Sails 0.10, Node 0.10/4,
Angular 1.3, Bower/Grunt, melonJS 2.2, MongoLab) is EOL and is **reimplemented**,
not upgraded.

Decisions taken during brainstorming:

| Topic | Decision |
|---|---|
| Purpose | Nostalgia/portfolio, but all features kept |
| Existing data | None kept; start fresh from repo fixtures |
| Backend | Go (module declares `go 1.26`), hexagonal (ports & adapters) |
| Deployment | **Single binary**; runs anywhere, Docker image provided |
| Database | SQLite **or** Postgres, one adapter each, plain SQL, goose migrations |
| Portal | Server-rendered **templ + HTMX** |
| Game | **Current melonJS**, rewritten in TypeScript, Vite build |
| Multiplayer | Client-authoritative movement relayed by server (now); server-authoritative later |
| Real-time transport | **WebSocket** (behind a transport port); WebRTC rejected |
| Content | Maps, sprites, audio, minigames, catalogs and missions are **editable content**, not compiled |
| Auth | Local accounts + config-driven OIDC/OAuth2 providers; no Facebook |
| Config | **koanf**: defaults < YAML file < env vars < flags |
| Naming | English identifiers in code/schema; Spanish UI text via i18n catalog |

Success criteria: a fresh clone builds one binary that, with zero external services
(SQLite + embedded content), lets users register, create a character, join a class,
play the multiplayer world, complete missions and colosseum questions, while
teachers/admins manage institutions, classes and requests from the portal.

Non-goals: horizontal scaling, migrating old MongoDB data, Facebook login,
New Relic/Slack logging, anti-cheat for movement (deferred to the authoritative phase).

## 2. Architecture

### 2.1 Layout

```
cmd/clasav/            main: config (koanf), wiring, subcommands
internal/
  domain/              pure types + rules; stdlib only
  app/                 use cases; depend only on domain + ports
    auth, game, missions, inventory, classroom, colosseum, chat, characters
  ports/               interfaces + repotest/ (shared repository contract suite)
  adapters/
    http/              net/http mux; templ pages + HTMX partials; game JSON API
    ws/                WebSocket transport + room hub (implements RealtimeHub)
    sse/               portal notifications (implements Notifier)
    sqlite/            repositories + embedded goose migrations
    postgres/          repositories + embedded goose migrations
    content/           ContentSource: dir overlay over embed.FS; catalog loader
    oidc/              generic OIDC/OAuth2 provider from config
    bcrypt/            PasswordHasher
web/
  portal/              templ components, vendored htmx (+ sse ext), CSS
  game/                TypeScript + melonJS, Vite → dist/ (embedded)
content/               default content pack (embedded; overridable at runtime)
```

Dependency rules: `domain` imports nothing outside stdlib; `app` imports `domain`
and `ports` only; adapters import `app`/`ports`/`domain`; only `cmd` imports
adapters and wires them. Enforced with a `depguard` (golangci-lint) rule.

### 2.2 Ports

- Repositories: `Users`, `Credentials`, `Sessions`, `Institutions`, `Classes`,
  `Characters`, `Inventory`, `MissionProgress`, `Achievements`, `Talents`,
  `Colosseum`, `Chat`, `MapInstances`, plus `TxRunner` (`WithinTx(ctx, func(Repos) error)`).
- `ContentSource` (fs access + change notifications) and `Catalog` (read-only, typed
  items/sprites/npcs/missions/achievements/talents/map templates).
- `IdentityProvider` (OIDC), `PasswordHasher`, `Clock`.
- `RealtimeHub` (rooms, broadcast, send-to-character), `Transport`/`Conn`
  (WebSocket today; WebTransport/WebRTC could be added as adapters).
- `Notifier` (portal events to users).
- `MovementPolicy` — `RelayPolicy` now; `AuthoritativePolicy` later.

### 2.3 Repo transition

Work happens on branch `go-migration`, replacing the Sails app in place. Removed:
Sails `api/`, `config/`, `views/`, `tasks/`, Grunt, Bower, `newrelic.js`,
`Procfile`, `.buildpacks`, `.travis.yml`, Eclipse files. Moved into `content/`:
`assets/data/*` (maps, sprites, music, sfx, minigames), `test/fixtures/*`
(converted to catalog JSON), mission JSON. `carteleria/` source art stays.

**Security:** the old repo contains committed MongoLab and Facebook/Google OAuth
secrets (`config/connections.js`, `config/passport.js`). They must be revoked
out-of-band; they remain in git history.

## 3. Domain model and data

### 3.1 State vs content

- **Content (files, in-memory, read-only):** items, sprites, NPCs, missions,
  achievement definitions, talents, map templates (+ dependency groups). Referenced
  by stable string keys, e.g. `item:"espada_madera"`, `mission:"matematica1"`.
- **State (database):** everything users create or change.

### 3.2 Tables

| Area | Tables | Replaces |
|---|---|---|
| Identity | `users` (profile fields, `site_admin`), `credentials` (kind local/oidc, bcrypt hash or provider+subject), `sessions` | User, Passport |
| Classroom | `institutions`, `institution_members` (status: `pending_teacher`, `pending_admin`, `rejected_by_admin`, `rejected_by_teacher`, `teacher`, `admin`), `classes`, `class_members` (status: `pending`, `accepted`, `rejected`, `admin`) | Institucion(_x_user), Clase(_x_user) |
| World | `map_instances` (template key, class id nullable) | Mapa_instancia |
| Character | `characters` (owner, name, appearance, level, xp, gold, energy, energy_max, energy_updated_at, map_instance, x, y, dir, anim, last_used), `character_classes` | Personaje |
| Inventory | `inventory_entries` (character, item key, section, qty, equipped slot nullable) | Item_instancia |
| Missions | `mission_progress` (character, npc key, map_instance, order) | Misiones_x_Personaje |
| Achievements | `class_achievements` (class, achievement key, overrides), `character_achievements` | Logro_instancia |
| Talents | `character_talents` | Talento relation |
| Colosseum | `colosseum_questions` (class, text), `colosseum_options` (question, position, text, is_correct; 2–8 per question, exactly one correct), `colosseum_answers` (user, question, chosen option, correct, answered_at) | Preguntas_coli, Respuestas_coli |
| Chat | `chat_messages` (author, map_instance nullable = global, text, created_at), pruned periodically | Chat |

Modeling rules:
- 64-bit integer PKs on both engines.
- Equipment lives only on `inventory_entries.equipped`; domain enforces one item per slot
  (old per-slot FKs on Personaje are dropped).
- Online presence is runtime hub state, not a column.
- Roles derive from memberships; `site_admin` bootstraps administration.
- Energy regenerates lazily on read from `energy_updated_at` (no cron).
- Legacy colosseum fixtures (`respuesta1` = correct answer, shuffled on display) are
  converted to `content/demo/colosseum.json`; `clasav seed demo` creates a demo
  institution, class and teacher with those questions. Not run automatically.

### 3.3 Migrations

- goose, used as a library (`Provider` API).
- `adapters/sqlite/migrations/*.sql` and `adapters/postgres/migrations/*.sql`,
  embedded, **same version numbers in both** (e.g. `00001_identity.sql`).
- `--migrate=auto` (default) applies on startup; `clasav migrate up|down|status`.
- Contract suite asserts both engines report the same latest version.

### 3.4 Repository adapters

Plain SQL per adapter over `database/sql`: `modernc.org/sqlite` (pure Go, no CGO)
and `github.com/jackc/pgx/v5/stdlib`. Rows scan directly into domain types. sqlc was
considered and rejected: it would require two query sets and two generated packages
plus mapping code, while cross-engine equivalence is better proven by the shared
contract suite (`ports/repotest`), which every adapter must pass.

## 4. Content pack

```
content/
  maps/        *.tmx + tilesets
  sprites/  music/  sfx/
  minigames/   <name>/index.html (+ any JS/CSS/images)
  catalog/     items.json sprites.json npcs.json achievements.json talents.json maps.json
  missions/    *.json
```

- `--content=<dir>`: files in dir override the embedded default pack (overlay).
- `--dev`: file watcher hot-reloads catalogs and invalidates the manifest.
- Load-time validation (dangling references to items, maps, sprites, NPCs, missions,
  achievements, minigames) fails startup with precise errors; `clasav content check [dir]`
  runs the same validation offline.
- Server builds `/content/manifest.json` at runtime so the client needs no rebuild
  for new content.

### 4.1 Minigames

Served from `/content/minigames/<name>/`, run in a sandboxed `<iframe>`
(`sandbox="allow-scripts"`) over the canvas. Only contract: a `postMessage` bridge
(tiny `bridge.js` provided in the pack):

- child → parent: `ready`, `getContext`, `submitResult {payload}`, `close`
- parent → child: `context {question, character, locale}`, `resultAck {accepted, rewards}`

The game forwards results to the server API; the server decides rewards. Ported:
`coliseo`, `listaClasesDisponibles`.

## 5. Real-time and game flow

### 5.1 WebSocket protocol

Single socket per session at `/ws/game`, authenticated by session cookie; Origin
checked. Envelope: `{"t": "<type>", "seq": <int>, "d": {...}}`. Library:
`github.com/coder/websocket`.

| Client → server | Server → client |
|---|---|
| `hello {characterId}` | `welcome {character, players, serverTime}` |
| `move {x, y, dir, anim}` | `player_moved {id, x, y, dir, anim, seq}` |
| `change_map {target, x, y, anim}` | `map_changed {instance, players}`, `player_joined`, `player_left` |
| `chat {text, scope}` | `chat {author, text, scope}` |
| `ping` | `pong`, `character_updated {stats}`, `error {code, msg}` |

Protocol types are defined in Go; `go generate` emits TypeScript types for the client.

### 5.2 Hub

- One goroutine owns the room registry (map instance → conns, plus global room).
- Per-conn read loop and buffered write loop; slow consumers are disconnected.
- `move` → `MovementPolicy.Validate` → broadcast to room. Server rate-caps moves;
  client throttles (~500 ms or on direction change).
- Positions are kept in memory and persisted on map change, disconnect, and every
  ~10 s if dirty.
- Disconnect: persist, broadcast `player_left`.

### 5.3 Map change

`game.ChangeMap`: `ciudad*` templates resolve to a shared instance; others resolve
to a per-class instance, created on demand. Persist position, move conn between rooms,
reply `map_changed`.

### 5.4 Reward-bearing actions (HTTP JSON, `/api/game/...`)

- `GET mission?npc=` — current dialogue + condition status.
- `POST mission/complete` — validate conditions, apply rewards (energy, xp, gold,
  item, achievement, next mission) **in one transaction**, push `character_updated`.
- `GET inventory`, `POST items/{id}/use`, `POST items/{id}/unequip`.
- `GET colosseum/question`, `POST colosseum/answer`.
- `POST /api/client-errors` — rate-limited, logged via slog (no table).

### 5.5 Portal notifications

SSE at `/events` (HTMX `sse` extension): `new_class_request`,
`class_request_updated`, `new_institution_request`, `institution_request_updated`,
routed to the relevant teachers/admins/students.

## 6. Auth and portal

### 6.1 Auth

- Local: email + password (bcrypt).
- OIDC/OAuth2 providers declared in config (`coreos/go-oidc`, `x/oauth2`); account
  linking by verified email; linked-providers page on the account screen.
- Server-side sessions (DB), HttpOnly + SameSite=Lax cookie; shared by HTTP, WS, SSE.
- CSRF token on forms and HTMX requests (`hx-headers`).
- Authorization enforced in use cases (e.g. only a class's teacher approves its requests).

### 6.2 Portal pages (templ + HTMX)

| Area | Pages |
|---|---|
| Public | landing/login, register, press kit |
| Account | profile edit, linked providers, characters (create, pick, detail) |
| Student | my classes, request to join a class |
| Teacher | institutions, request institution, classes, create class, pending requests, student detail, class missions, achievement detail, colosseum questions CRUD |
| Admin | institutions, create institution, pending teacher requests |

Layout with nav and live SSE badges. Pico.css, vendored;
no Node build for the portal. "Play" opens `/game`.

### 6.3 Game client (`web/game`)

TypeScript + current melonJS, Vite. Modules: `net/` (WS client with reconnect/backoff,
typed protocol, HTTP API client), `scenes/` (loading, play), `entities/`
(MainPlayer, RemotePlayer with interpolation, NPC), `ui/` (HUD, inventory, chat,
minimap, dialogue), `minigames/` (iframe host + bridge). Assets loaded via the content
manifest. Pathfinding via a maintained npm package. `dist/` embedded in the binary.

## 7. Configuration

koanf, layered: struct defaults < `clasav.yaml` (optional, `--config` path) <
`CLASAV_*` env vars (`__` separates nesting: `CLASAV_DB__DSN` → `db.dsn`) < flags
(`posflag`). Unmarshalled into a typed `Config`, validated at startup (fail fast).
In `--dev`, config file changes are watched where safe (log level, content dir).

Main keys: `addr`, `base_url`, `db.dsn` (`sqlite:///data/clasav.db` or
`postgres://…`), `db.migrate` (`auto|off`), `content.dir`, `dev`,
`session.secret`, `auth.oidc.<name>.{issuer,client_id,client_secret,scopes}`,
`metrics.enabled`.

Subcommands: `serve` (default), `migrate up|down|status`, `content check`,
`user create-admin`, `seed demo`.

## 8. Errors and observability

- Domain errors: `ErrNotFound`, `ErrForbidden`, `ErrConditionNotMet`, `ErrValidation`,
  `ErrConflict`. Each driving adapter maps them (HTTP status + templ partial;
  JSON; WS `error`). Unexpected errors logged with request id, never leaked.
- `log/slog` (JSON in prod, text in dev).
- `/healthz`, `/readyz` (DB + content loaded).
- Optional Prometheus `/metrics` (`metrics.enabled`, default off).
- Graceful shutdown: stop accepting, hub persists positions and closes conns,
  drain in-flight requests.

## 9. Testing

- Domain/app: table-driven unit tests with in-memory port fakes (mission conditions and
  rewards, energy regen, equip rules, membership state machines).
- `ports/repotest` contract suite: SQLite in-memory + Postgres via testcontainers
  (skipped with a message when Docker is absent).
- HTTP/HTMX: `httptest` for status codes, redirects, key fragment elements.
- WS hub: multi-client join/move/change_map/chat/disconnect with `-race`.
- `content check` on the default pack in CI.
- Game client: Vitest for protocol, interpolation, bridge. Playwright smoke
  (login → play → walk → NPC → mission) in milestone 5.

## 10. Delivery

- `justfile`: `web`, `generate` (templ + TS protocol types), `build`, `test`, `lint`.
- GitHub Actions: lint, tests (SQLite + Postgres), game build, `content check`, binary build.
- Multi-stage Dockerfile (Node + Go build → distroless static), `/data` volume.

## 11. Milestones

Each milestone gets its own implementation plan.

1. **Skeleton** — layout, koanf config, goose migrations (both engines), local auth,
   sessions, content port + default pack + `content check`, portal login/register/account.
2. **Classroom portal** — institutions, classes, requests/approvals, SSE notifications,
   colosseum question authoring.
3. **Game core** — melonJS client, content manifest, WS hub, join/move/change_map,
   chat, remote players.
4. **Gameplay** — missions, inventory/equipment, energy, achievements, talents,
   minigame bridge + colosseum, HUD.
5. **Polish** — OIDC providers, metrics, Playwright smoke, Docker, CI, press kit,
   i18n catalog.

## 12. Future (out of scope now)

- Server-authoritative movement: `AuthoritativePolicy` loading TMX collision layers in Go,
  client-side prediction/reconciliation using existing `seq` numbers.
- Alternative transports (WebTransport) as `Transport` adapters.
