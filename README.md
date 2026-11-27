# LaTeX Studio

<p align="center">
  <img src="https://img.shields.io/badge/PHP-8.3%2B-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.3+" />
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 13" />
  <img src="https://img.shields.io/badge/Inertia.js-v3-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js v3" />
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Vue 3.5" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Vite-Plus-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Monaco_Editor-0.58-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Monaco Editor" />
  <img src="https://img.shields.io/badge/PDF.js-6.5-EC1C24?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="PDF.js" />
  <img src="https://img.shields.io/badge/Pest-5-F28D1A?style=for-the-badge&logo=php&logoColor=white" alt="Pest 5" />
  <img src="https://img.shields.io/badge/Fortify_%26_Passkeys-Auth-18181B?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel Fortify & Passkeys" />
  <img src="https://img.shields.io/badge/Wayfinder-Typed_Routes-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel Wayfinder" />
</p>

## Project Brief

**LaTeX Studio** is a full-stack, collaborative academic and scientific LaTeX authoring platform built on **Laravel 13**, **Inertia.js v3**, **Vue 3**, **TypeScript**, and **Tailwind CSS 4**. Designed for researchers, authors, and technical teams, it combines a Monaco-powered LaTeX workspace with visual authoring studios so complex equations, tables, and TikZ diagrams can be composed without memorizing every macro.

### Key Capabilities

- **Integrated LaTeX Workspace**: Split-pane **Monaco Editor** (`Code` and `Visual` modes) with LaTeX syntax highlighting, live diagnostics, outline navigation, **PDF.js** preview, build logs/warnings/history, snapshots, and ZIP export.
- **Inline Equation Hover Preview**: Hovering over `$...$`, `$$...$$`, `\[...\]`, `\(...\)`, or multi-line math environments (`equation`, `align`, `gather`, `multline`, `matrix`, `cases`) renders a live typeset preview directly inside the code editor.
- **Equation Studio & LaTeX Equation Laboratory**: Interactive visual mathfield, raw LaTeX editor, searchable metadata-driven symbol catalogue, standard equation templates, live MathML preview, structural syntax validation, required package detection, revision history, and review comments.
- **Enhanced Sidebar Symbol Palette**: Searchable symbol and template browser with Favorites and Recent history persisted in `localStorage` and synced with the Equation Laboratory.
- **Visual Table Designer**: Interactive spreadsheet-style table builder supporting `booktabs`, custom style profiles, cell formatting, and clean LaTeX code generation.
- **Visual TikZ Figure Editor**: Node-and-edge diagramming canvas with properties inspection and round-trip TikZ code generation.
- **Collaboration & Role-Based Access**: Multi-user project collaboration (Owner, Co-Author, Reviewer, Commenter, Viewer), collaborator chat, review workflows, research tools, AI assistant integration, and an Admin control panel powered by **Spatie Laravel Permission**.
- **Modern Security**: Authentication via **Laravel Fortify** with email verification, two-factor authentication (2FA/TOTP), and **Passkeys / WebAuthn**.

---

## Prerequisites

- **PHP** `>= 8.3` (with `pdo_sqlite`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`)
- **Composer** `>= 2.x`
- **Node.js** `>= 20.x` and **npm**
- **Git**
- *(Optional)* **TeX Live / MiKTeX** (`pdflatex`, `xelatex`, `lualatex`) if running local PDF compilation workers

---

## Installation & Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/vanlalruata/LaTex-Studio.git
cd LaTex-Studio
```

### 2. Install Dependencies & Configure Environment

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

> **Note (SQLite default):** By default, `.env.example` uses SQLite. Ensure `database/database.sqlite` exists (`touch database/database.sqlite` on macOS/Linux, or `New-Item database/database.sqlite -ItemType File` on Windows PowerShell) before migrating.

### 3. Run Migrations & Seed the Database

```bash
php artisan migrate --seed
```

### 4. Start the Development Server

```bash
composer run dev
```

`composer run dev` uses `concurrently` to start all local services together:
- **Laravel HTTP Server** (`php artisan serve`) — `http://127.0.0.1:8000`
- **Queue Worker** (`php artisan queue:listen --tries=1`)
- **Vite Dev Server** (`npm run dev`)

If you prefer building production frontend assets first, run:

```bash
npm run build
```

*(You can also run `composer run setup` for a one-command initial install, `.env` copy, key generation, migration, and asset build, followed by `php artisan db:seed` and `composer run dev`.)*

---

## Seeded User Credentials

Running `php artisan migrate --seed` (or `php artisan db:seed`) creates the following pre-verified accounts via [`DatabaseSeeder.php`](database/seeders/DatabaseSeeder.php). All seeded users share the password **`password`**.

| Name | Email | Password | Role / Purpose |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@latexstudio.com` | `password` | System Administrator (`admin` role) |
| **Dr. Researcher** | `researcher@latexstudio.com` | `password` | Primary Researcher / Project Owner |
| **Co-Author** | `coauthor@latexstudio.com` | `password` | Collaborating Co-Author |
| **Dr. Priya Nair** | `reviewer@latexstudio.com` | `password` | Peer Reviewer |
| **Sam Okafor** | `commenter@latexstudio.com` | `password` | Commenter |
| **Guest Reader** | `viewer@latexstudio.com` | `password` | Read-Only Viewer |
| **Test User** | `test@example.com` | `password` | General Testing Account |

---

## Testing & Code Quality

| Check | Command | Description |
| :--- | :--- | :--- |
| **Full Backend Suite** | `composer test` | Clears config, runs Pint lint check, PHPStan static analysis, and Pest tests |
| **PHP Formatting** | `composer lint` | Formats PHP files with Laravel Pint |
| **Frontend Typecheck** | `npm run types:check` | Runs `vue-tsc --noEmit` across TypeScript and Vue SFCs |
| **Frontend Lint/Format** | `npm run check` | Runs `vp check` |
| **Production Build** | `npm run build` | Builds client bundle via Vite (`vp build`) |

---

## Project Roadmap

### Completed
- [x] **Authentication & Security**: Fortify login/registration, 2FA/TOTP, Passkeys, role-based permissions (`spatie/laravel-permission`), and Admin dashboard.
- [x] **Project Workspace**: Multi-file project explorer, outline view, Monaco LaTeX editor (`Code` & `Visual`), PDF.js viewer, snapshots, and ZIP export.
- [x] **Visual Table Designer**: Spreadsheet-like LaTeX table editor with `booktabs` and saved style profiles.
- [x] **Visual TikZ Figure Editor**: Interactive node/edge canvas with TikZ generation and round-trip editing.
- [x] **Equation Studio & Equation Laboratory**: Interactive mathfield, metadata-driven symbol catalogue, templates, MathML/SVG preview, AST validation, revisions, and comments.
- [x] **Symbol Palette & Editor Hover Preview**: Searchable sidebar symbol/template palette with Favorites & Recents, plus pane-contained Monaco hover equation previews.

### Planned / Next Milestones
- [ ] **Isolated TeX Live Compilation Workers**: Sandboxed `pdflatex` / `xelatex` / `lualatex` / `biber` execution pipeline with real-time SyncTeX source ↔ PDF jumping.
- [ ] **Real-Time Collaborative Editing**: WebSocket/CRDT multi-cursor presence and live conflict-free document synchronization.
- [ ] **Bibliography & Citation Manager**: Live `.bib` parser, DOI/arXiv lookup, and Zotero/Mendeley synchronization.
- [ ] **Git & Cloud Sync**: Two-way GitHub/GitLab repository synchronization and automated release tagging.
- [ ] **AI Manuscript Assistant**: Context-aware LaTeX error fixing, equation synthesis, and academic proofreading backed by live LLM providers.

---

## Author

**Developed by Dr. Vanlalruata Hnamte**
