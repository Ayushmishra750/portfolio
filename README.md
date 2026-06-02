# Ayush Mishra — Portfolio Website

A world-class data engineering portfolio built with Next.js 15, Three.js, Framer Motion, and GSAP.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion + GSAP
- **3D/Canvas**: Three.js, React Three Fiber, Custom Canvas
- **Scroll**: Lenis Smooth Scroll
- **Icons**: Lucide React
- **UI**: Shadcn UI (Radix primitives)

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── globals.css        # Global styles, glassmorphism, animations
│   ├── layout.tsx         # Root layout with SEO metadata
│   └── page.tsx           # Main page — composes all sections
├── components/
│   ├── Loader.tsx         # Premium loading screen
│   ├── Cursor.tsx         # Custom cursor with spring physics
│   ├── ScrollProgress.tsx # Scroll progress bar
│   ├── Navbar.tsx         # Glass navbar with mobile menu
│   ├── Hero.tsx           # Full-screen hero with magnetic buttons
│   ├── NetworkBackground.tsx # Canvas 3D network animation
│   ├── About.tsx          # About with animated counters
│   ├── Skills.tsx         # Interactive skill cards with bars
│   ├── Experience.tsx     # Timeline experience section
│   ├── Projects.tsx       # Project cards with modal detail view
│   ├── DataPipeline.tsx   # Animated ETL pipeline visualization
│   ├── Certifications.tsx # Certification cards with hover shine
│   ├── GitHubStats.tsx    # GitHub stats & contribution heatmap
│   ├── Contact.tsx        # Contact form with floating labels
│   └── Footer.tsx         # Footer with social links
├── public/
│   └── resume.pdf         # Your resume (add manually)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment

### Option 1: Vercel (Recommended — easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Your site is live in ~2 minutes at `https://your-project.vercel.app`

**Custom domain on Vercel:**
1. Go to Project Settings → Domains
2. Add your domain (e.g., `ayushmishra.dev`)
3. Update your domain's DNS: add a CNAME record pointing to `cname.vercel-dns.com`

### Option 2: GitHub Pages

The project uses `output: 'export'` in `next.config.ts` for static export.

1. Push your repository to GitHub
2. The included GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys on every push to `main`
3. Go to Settings → Pages → Source: `gh-pages` branch
4. Your site is live at `https://yourusername.github.io/repository-name`

**Custom domain on GitHub Pages:**
1. Go to Settings → Pages → Custom domain
2. Enter your domain (e.g., `ayushmishra.dev`)
3. Add these DNS records at your registrar:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME: `www` → `yourusername.github.io`
4. Create a `public/CNAME` file with just your domain: `ayushmishra.dev`

## 📸 Sections

| Section | Description |
|---------|-------------|
| Hero | Full-screen with 3D network, magnetic buttons |
| About | Animated counters, floating cards |
| Skills | Interactive skill cards with category tabs |
| Experience | Timeline with Cognizant achievements |
| Projects | Cards with modal detail view |
| ETL Pipeline | Animated data flow visualization |
| Certifications | Cards with hover shine effects |
| GitHub Stats | Contribution heatmap, language distribution |
| Contact | Floating label form with success animation |

## ✏️ Customization

- **Personal info**: Edit text in each component file
- **Colors**: Update `tailwind.config.ts` and `app/globals.css`
- **Resume**: Add `resume.pdf` to the `public/` folder
- **GitHub links**: Update `href` values in `GitHubStats.tsx`, `Contact.tsx`, `Footer.tsx`
- **LinkedIn**: Update links in `Contact.tsx` and `Footer.tsx`

## 📄 License

MIT — free to use and customize.
