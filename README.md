# Next.js Starter Template

A production-ready **Next.js 16** starter template with authentication, API client, theming, and shadcn/ui pre-configured. Clone it, connect your backend, and start building.

---

## ✨ What's Included

| Feature | Details |
|---|---|
| **Authentication** | JWT-based auth with login, register, profile management, password change, and automatic token refresh |
| **API Client** | Type-safe HTTP client (`lib/api-client.ts`) with Bearer auth, refresh token rotation, 401 handling, and request queuing |
| **Theming** | Dark / Light / System toggle via `next-themes` with shadcn/ui design tokens (OKLCH color system) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) with Tailwind CSS v4 — Button, DropdownMenu, Avatar pre-installed |
| **Auth UI** | Ready-to-use login/signup modal, profile settings modal, user button dropdown |
| **Route Groups** | `(marketing)` for public pages, `(main)` for authenticated pages with route protection |
| **Google Fonts** | Inter + Geist Sans + Geist Mono pre-loaded as CSS variables |
| **Toast Notifications** | [Sonner](https://sonner.emilkowal.dev/) integrated globally |

---

## 📁 Project Structure

```
├── app/
│   ├── (marketing)/              # Public pages (landing, etc.)
│   │   ├── _components/          # Navbar, Logo, Heading, Heroes, Footer
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (main)/                   # Authenticated pages
│   │   ├── dashboard/page.tsx    # Default authenticated page
│   │   └── layout.tsx            # Auth guard + top nav
│   ├── globals.css               # Tailwind v4 + shadcn/ui design tokens
│   └── layout.tsx                # Root layout (providers, modals, fonts)
├── components/
│   ├── auth/                     # Auth UI components
│   │   ├── auth-modal.tsx        # Login/Signup modal
│   │   ├── profile-modal.tsx     # Profile & security settings
│   │   ├── sign-in-button.tsx    # Opens login modal
│   │   ├── sign-up-button.tsx    # Opens signup modal
│   │   ├── user-button.tsx       # User avatar dropdown
│   │   ├── authenticated.tsx     # Render children only if authenticated
│   │   ├── unauthenticated.tsx   # Render children only if unauthenticated
│   │   └── auth-loading.tsx      # Render children only while loading
│   ├── providers/
│   │   ├── auth-provider.tsx     # Auth context (state, login, logout, etc.)
│   │   └── theme-provider.tsx    # next-themes wrapper
│   ├── ui/                       # shadcn/ui components
│   ├── mode-toggle.tsx           # Theme toggle dropdown
│   └── spinner.tsx               # Loading spinner with size variants
├── hooks/
│   ├── use-auth.ts               # Auth hook (useAuth + useUser)
│   └── use-scroll-top.tsx        # Detect scroll position
├── lib/
│   ├── api-client.ts             # HTTP client with auth & refresh
│   └── utils.ts                  # cn() utility
├── .env.example                  # Environment variable reference
├── .env.local                    # Your local env (git-ignored)
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url> my-app
cd my-app
npm install
```

> If prompted about install scripts (`sharp`, `unrs-resolver`), approve them:
> ```bash
> npm approve-scripts --allow-scripts-pending
> ```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication

The template expects a REST API backend with these endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Login with `{ email, password }` → `{ access_token, refresh_token, user? }` |
| `POST` | `/api/v1/auth/register` | Register with `{ name, email, password }` → `{ access_token, refresh_token, user? }` |
| `GET` | `/api/v1/auth/me` | Get current user profile (requires Bearer token) |
| `PATCH` | `/api/v1/auth/me` | Update profile with `{ name }` |
| `POST` | `/api/v1/auth/change-password` | Change password with `{ old_password, new_password }` |
| `POST` | `/api/v1/auth/refresh` | Refresh access token (Bearer: refresh_token) → `{ access_token }` |

Tokens are stored in `localStorage` under `app-token` and `app-refresh-token`.

### Auth Components

```tsx
import { useAuth } from "@/hooks/use-auth";
import { Authenticated } from "@/components/auth/authenticated";
import { Unauthenticated } from "@/components/auth/unauthenticated";
import { SignInButton } from "@/components/auth/sign-in-button";

// Hook usage
const { user, isAuthenticated, isLoading, login, logout } = useAuth();

// Conditional rendering
<Authenticated>
  <p>Only visible when logged in</p>
</Authenticated>

<Unauthenticated>
  <SignInButton>
    <button>Log in</button>
  </SignInButton>
</Unauthenticated>
```

---

## 🌐 API Client

The API client (`lib/api-client.ts`) provides a type-safe HTTP wrapper:

```tsx
import { api } from "@/lib/api-client";

// GET request
const users = await api.get<User[]>("/users");

// POST request
const newPost = await api.post<Post>("/posts", { title: "Hello" });

// With query parameters
const results = await api.get<Item[]>("/search", {
  params: { q: "hello", page: "1" },
});
```

**Built-in features:**
- Auto-prepends `/api/v1` to endpoints
- Attaches `Authorization: Bearer <token>` header automatically
- Handles 401 errors with automatic token refresh
- Queues concurrent requests during token refresh
- Dispatches `auth-unauthorized` event on session expiry
- Supports `FormData` and JSON bodies

---

## 🎨 Theming

The template uses [next-themes](https://github.com/pacocoursey/next-themes) with shadcn/ui's OKLCH color system.

```tsx
import { ModeToggle } from "@/components/mode-toggle";

// Drop in the theme toggle anywhere
<ModeToggle />
```

Design tokens are defined in `app/globals.css` as CSS custom properties. Edit them to customize your app's color palette.

---

## 🧩 Adding shadcn/ui Components

```bash
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add card
```

Components are installed into `components/ui/`.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Toasts:** [Sonner](https://sonner.emilkowal.dev/)
- **Utilities:** [usehooks-ts](https://usehooks-ts.com/)

---

## 📋 Customization Checklist

When starting a new project from this template:

- [ ] Update `package.json` — change `name` to your project name
- [ ] Update `app/layout.tsx` — change metadata `title` and `description`
- [ ] Update `.env.local` — set your backend API URL
- [ ] Update `lib/api-client.ts` — adjust API prefix if your backend differs from `/api/v1`
- [ ] Replace `app-token` / `app-refresh-token` localStorage keys if desired
- [ ] Update `app-theme` storage key in `app/layout.tsx` if desired
- [ ] Customize `globals.css` — tweak the OKLCH color tokens for your brand
- [ ] Add more shadcn/ui components as needed (`npx shadcn@latest add ...`)
- [ ] Build your pages inside `app/(main)/` for authenticated routes

---

## 📄 License

MIT — use this template for any project.