# 🛒 বাজার দর (BazarDor)

প্রয়োজনীয় পণ্যের দাম এক নজরে — চাল, ডাল, তেল, সবজি, মাছ-মাংসসহ নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর, দাম বাড়া-কমার হিসাব এবং বাজারভিত্তিক তুলনা।

**Live:** _add your Vercel link_ · **Repo:** _add your GitHub link_

## Technologies Used

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · DaisyUI · Better Auth · MongoDB · react-hot-toast

## Key Features

1. **Live price ticker** – অসীম স্ক্রলিং মার্কি, প্রতিটি পণ্যের দাম ও ▲/▼ শতাংশসহ।
2. **Top risers & fallers** – আজ কোন ৬টি পণ্যের দাম সবচেয়ে বেশি বেড়েছে/কমেছে।
3. **Category pages with sorting** – বাংলা সংখ্যা সঠিকভাবে পার্স করে দামের ভিত্তিতে সাজানো।
4. **Protected product details** – সর্বনিম্ন/সর্বোচ্চ/গড় দাম ও বাজারভিত্তিক তালিকা (লগইন প্রয়োজন)।
5. **Authentication** – Better Auth দিয়ে Email/Password, Google ও GitHub লগইন।
6. **Profile update** – নাম আপডেট করার সুবিধা।
7. Fully responsive, skeleton loaders, toast notifications, custom 404.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

### Environment variables

| Key                                         | Purpose                                                        |
| ------------------------------------------- | -------------------------------------------------------------- |
| `MONGODB_URI`                               | MongoDB Atlas connection string (include a database name)      |
| `BETTER_AUTH_SECRET`                        | Random secret (`openssl rand -base64 32`)                      |
| `BETTER_AUTH_URL`                           | `http://localhost:3000` locally, your Vercel URL in production |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth                                                   |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth                                                   |

OAuth callback URLs: `<BETTER_AUTH_URL>/api/auth/callback/google` and `/github`.

## API

Data comes from `https://openapi.programming-hero.com/api/bazardor` (`/categories`, `/products`, `/products?category=`, `/products/:id`).
