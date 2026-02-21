# Practices

Frontend structure, conventions, and coding practices. For CDK and deployment, see [INFRASTRUCTURE.md](INFRASTRUCTURE.md).

## Package Management (Frontend)

- **Frontend dependencies** are in root `package.json`
- Install: `npm install` (from project root)

## TypeScript (Frontend)

- Frontend uses root `tsconfig.json` (ES modules, React)

## Frontend Structure and Conventions

### Rules

1. **Pages** – A page (`src/pages/*.tsx`) may only contain basic component references and page-level logic. All actual UI components for that page live under `src/components/<PageName>/components/`.

2. **State** – Each component holds local state for itself. Data that comes from the backend is handled in Jotai atoms. If state/logic is needed by multiple children, it lives in the parent.

3. **Parsing** – Prefer doing parsing (e.g. token decode, API response shape) in atoms or in code that feeds atoms. Components should consume already-parsed data from atoms.

4. **Generic logic** – Reusable, non-UI logic goes in `src/utils/` in separate files (e.g. `src/utils/cognito.ts`, `src/utils/strings.ts`).

5. **Large components** – Any component that reaches 100+ lines should be moved into its own file under the appropriate `components/<PageName>/components/` (or `components/shared/` if shared).

### Folder Layout

- `src/pages/` – Route-level components only; thin wrappers that import from `components/<PageName>/`.
- `src/components/<PageName>/components/` – Page-specific components (e.g. `Home/components/Navbar.tsx`, `Login/components/LoginForm.tsx`).
- `src/components/shared/` – Components used by more than one page (use when a component is reused across pages).
- `src/components/ui/` – Design system / ShadCN primitives.
- `src/atoms/` – Global state; derived atoms for parsed/derived data (e.g. display name).
- `src/utils/` – Generic pure functions in separate files by domain.
- `src/lib/` – Side-effectful or config-bound code (auth, API, config).

## Important Files

- `src/` – React application source (see **Frontend structure and conventions** above).
- `src/pages/` – Route-level pages (thin wrappers).
- `src/components/<PageName>/components/` – Page-specific components (e.g. `Home/components/Navbar.tsx`, `Login/components/LoginForm.tsx`, `Home/components/UserMenu.tsx`).
- `src/utils/` – Generic pure logic (e.g. `cognito.ts` for type guards and attribute helpers).
- `src/config/cognito.ts` – Cognito env config (no Amplify).
- `src/lib/auth.ts` – Cognito auth: `signIn`, `signOut`, `getCurrentUserFromCognito`, `getDisplayNameFromToken`
- `src/atoms/auth.ts` – Jotai auth state (`userAtom`, `isAuthenticatedAtom`, `displayNameAtom`)
- `src/atoms/theme.ts` – Theme state (`themeAtom`: light/dark), persisted in localStorage; toggle in Home Navbar.
- `vite.config.ts` – Vite configuration
- `package.json` – Frontend dependencies and scripts

## Authentication (Cognito)

- Login uses **Cognito only** via `amazon-cognito-identity-js` .
- Set `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID` in `.env` (see `.env.example`).
- User Pool must allow **email** as sign-in identifier (or use email as username).
- Auth service: `src/lib/auth.ts` (`signIn`, `signOut`, `getCurrentUserFromCognito`). Config: `src/config/cognito.ts`.
- Auth state is synced on app load via `getCurrentUserFromCognito()` and stored in Jotai `userAtom`.

## CI/CD

- `.github/workflows/deploy.yml` – GitHub Actions deployment workflow
  - Triggers only on commits with `[deploy]` in the message or on manual dispatch
  - Installs both frontend and infrastructure dependencies, builds frontend, then deploys infrastructure

## Common Tasks

### Adding a New Dependency

- **Frontend**: Add to root `package.json`, run `npm install`
- **Infrastructure**: Add to `infrastructure/package.json`, run `cd infrastructure && npm install` (see [INFRASTRUCTURE.md](INFRASTRUCTURE.md))

### Modifying Frontend

- Edit files in `src/`
- Test: `npm run dev`
- Build: `npm run build`
