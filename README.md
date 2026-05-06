
# 🚀 Nexora — Multi-Seller E-Commerce Platform

🔗 Live Demo: https://nexora-frontend-nine.vercel.app

Nexora is a modern, AI-powered multi-seller e-commerce platform built with a scalable full-stack architecture and a premium design system.

It enables sellers to create their own stores, helps users discover products intelligently using AI, and provides a seamless shopping + marketplace experience.

---

## ✨ Core Features

- 🧠 **AI Shopping Assistant** — helps users find the right products and improves discovery experience  
- 🤖 **AI Product Recommendation Engine** — smart suggestions based on user behavior and intent  
- 🏪 **AI Store Builder for Sellers** — assists sellers in creating and optimizing their storefront  
- 📦 **Multi-Seller Store System** — each seller can create and manage their own store  
- 🛍️ **Smart Marketplace** — category-based browsing, trending products, and deals system  
- 🔔 **Intelligent Notification System** — real-time updates for orders, messages, payments, and platform activity  
- 💳 **Secure Payment System** — smooth and reliable checkout flow  
- 👤 **Role-Based System** — Admin, Seller, and Customer experiences  

---

## 🧠 AI Integration

Nexora uses AI to enhance both buyer and seller experience:

- Product discovery assistant (“Ask Nexora AI”)  
- Smart product suggestions and ranking  
- Seller store setup guidance  
- Personalized shopping experience  

---

## 👤 Authentication & Security

- Email/password authentication  
- Google OAuth integration  
- JWT-based secure sessions  
- Role-based access control (Admin / Seller / Customer)  

---

## 🏪 Seller Features

- Create and manage personal storefront  
- Add / update / delete products  
- Inventory tracking  
- Order management system  
- Sales analytics dashboard  

---

## 🎨 UI / UX System

- Minimal and modern design system  
- Responsive mobile-first layout  
- Dark mode support  
- Reusable component architecture  
- Clean and consistent branding system  

---

## ⚙️ Tech Stack

### Frontend
- Next.js (App Router)  
- Tailwind CSS  
- shadcn/ui  
- TypeScript  

### Backend
- Node.js + Express  
- Modular architecture  
- MongoDB / Prisma  

### Services & Tools
- Stripe (Payments)  
- Cloudinary (Images)  
- MailerSend / Gmail SMTP (Email)  
- Google OAuth  
- AI APIs (OpenAI / Gemini)  

---

## 📁 Project Structure

```text
nexora/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── styles/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   └── prisma/
│
└── README.md
````

---

## ⚙️ Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_AUTH_BASE_URL=
NEXT_PUBLIC_AUTH_URL=

NEXT_PUBLIC_GOOGLE_CLIENT_ID=

OPENAI_API_KEY=
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=
OPENAI_MODEL=
```

---

### Backend

```env
PORT=
MONGO_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

MAILERSEND_API_KEY=
SMTP_EMAIL=
SMTP_PASSWORD=

OPENAI_API_KEY=
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=
OPENAI_MODEL=

STRIPE_SECRET_KEY=
```

---

## 🚀 Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Deployment

* Frontend → Vercel
* Backend → Render
* Images → Cloudinary
* Emails → MailerSend / Gmail SMTP
* Payments → Stripe

---

## 🧪 Testing

* Jest (Backend)
* React Testing Library (Frontend)
* Postman API collection support

---

## 🧠 Roadmap

* AI-powered seller analytics dashboard
* Multi-currency support
* Mobile app (React Native)
* Real-time order tracking
* Affiliate system
* Advanced AI personalization engine

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

We welcome improvements in UI, backend scalability, and AI features.

---

## 📄 License

This project is proprietary and owned by **Nexora**.
All rights reserved.

---

## 👨‍💻 Author

**Mahbuba Akter**
Full-Stack Web Developer

```

