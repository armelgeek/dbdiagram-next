# Copilot Instructions for Boutik

## Project Overview
- **Framework:** Next.js (App Router, TypeScript)
- **Architecture:** Modular, feature-driven (see `features/`), with shared UI and logic in `shared/`.
- **Database:** Drizzle ORM (see `drizzle/`, `db/`, and migration scripts)
- **Integrations:** Stripe, Uploadthing, custom Auth (see `app/api/`, `shared/lib/config/`)

## Key Patterns & Conventions

### Feature Module Pattern

Each business domain (e.g., `products`, `auth`, `cart`, `orders`, `category`) is a subfolder in `features/`. Every feature is self-contained and follows this structure:

```
features/<feature>/
  components/
    atoms/        # Smallest UI elements (e.g., Button, Input)
    molecules/    # Composed UI (e.g., ProductList, CartMenu)
    organisms/    # Complex UI (e.g., ProductTable, AuthForm)
  hooks/          # React hooks for stateful or reusable logic
  config/         # Zod schemas, types, constants, params
  domain/
    service.ts    # Service layer for business logic
    use-cases/    # One file per use-case (e.g., create-*.use-case.ts)
```

**Example:**
- `features/products/components/organisms/crud/add.tsx` (UI for adding a product)
- `features/products/domain/use-cases/create-product.use-case.ts` (business logic for product creation)
- `features/products/config/product.schema.ts` (Zod schema for product validation)
- `features/products/hooks/use-products.ts` (fetching product list)

**Why this pattern?**
- Keeps each feature isolated, testable, and easy to maintain
- UI is built from small to large (atomic design)
- Business logic is separated from UI and colocated with its feature
- Types and validation are always close to where they're used

**Shared code** (e.g., generic UI, hooks) lives in `shared/` and should be reused across features.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (or `bun dev`, `yarn dev`, `pnpm dev`)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **DB Migrations:**
  - Generate: `npm run db:generate`
  - Migrate: `npm run db:migrate`
  - Studio: `npm run db:studio`
- **Stripe Webhook Dev:** `npm run stripe:listen`

## Creating a New Feature

### How to Create a New Feature

1. **Create a folder in `features/`** (e.g., `features/inventory/`).
2. **Add these subfolders:**
  - `components/atoms/`, `components/molecules/`, `components/organisms/` (for UI)
  - `hooks/` (for custom React hooks)
  - `config/` (for Zod schemas, types, params)
  - `domain/service.ts` and `domain/use-cases/` (for business logic)
3. **UI:** Build UI from atoms → molecules → organisms. Example: `ProductItem` (atom) → `ProductList` (molecule) → `ProductTable` (organism).
4. **Business logic:** Put each use-case in its own file in `domain/use-cases/` (e.g., `create-inventory.use-case.ts`).
5. **Types & validation:** Define types and Zod schemas in `config/` (e.g., `inventory.schema.ts`).
6. **API:** If needed, add an endpoint in `app/api/v1/<feature>/route.ts`.
7. **Reuse:** Use shared UI and logic from `shared/` whenever possible.

**See `features/products/` for a complete example.**

## Integration Points
- **Drizzle ORM:** See `drizzle/`, `db/`, and migration scripts for schema and data access.
- **Stripe:** Payment and webhook logic in `app/api/stripe/` and `shared/lib/config/stripe.ts`.
- **Uploadthing:** File upload logic in `app/api/uploadthing/` and `shared/lib/utils/uploadthing.ts`.
- **Auth:** Custom logic in `features/auth/` and `app/api/auth/`.

## Project-Specific Notes
- **Use absolute imports** (e.g., `@/features/products/...`).
- **Colocate types, schemas, and business logic** within each feature.
- **Prefer hooks for stateful logic** and context for cross-feature state.
- **Follow atomic design for UI** (atoms → molecules → organisms).

---

For more, see `README.md` and explore the `features/` and `shared/` directories for examples.
