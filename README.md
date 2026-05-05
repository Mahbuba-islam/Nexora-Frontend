
# **Nexora — Multi‑Seller E‑Commerce Platform**  
A modern, AI‑powered multi‑seller marketplace built with a premium, minimal design system and a modular full‑stack architecture.

Nexora combines marketplace commerce, seller tools, AI‑assisted shopping, and a clean, universal brand identity.

---

## **✨ Features**
### **🛍️ Marketplace**
- Multi‑seller product listings  
- Category‑based browsing  
- Deals, new arrivals, trending items  
- Storefront pages for each seller  

### **👤 Authentication**
- Email/password login  
- Google OAuth (GIS / Redirect flow)  
- JWT‑based session handling  
- Secure role‑based access (Admin, Seller, Customer)

### **🤖 Nexora AI**
- AI‑powered product search  
- Smart recommendations  
- “Ask Nexora AI” assistant  
- Weekly curated email drops

### **📦 Seller Dashboard**
- Product management  
- Inventory tracking  
- Order management  
- Analytics & insights  

### **🎨 Premium UI/UX**
- Minimal, universal branding  
- Nexora color system (Indigo, Teal, Mint, Pale Yellow)  
- Fully responsive layout  
- Pixel‑perfect navbar, forms, and components  
- Dark mode support  

### **⚙️ Backend**
- Node.js + Express  
- MongoDB / Prisma  
- Modular service architecture  
- MailerSend + Gmail SMTP  
- Google OAuth callback flow  
- Render deployment ready  

### **🚀 Frontend**
- Next.js (App Router)  
- Tailwind CSS + shadcn/ui  
- Server Actions  
- Optimized images  
- API integration with backend  

---

## **📁 Project Structure**
```
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
│   └── prisma/ or models/
│
└── README.md
```

---

## **🔧 Environment Variables**

### **Frontend**
```
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

### **Backend**
```
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


---

## **🧠 Google OAuth Setup**
1. Go to Google Cloud Console  
2. Create OAuth Client (Web Application)  
3. Add authorized redirect URI:

```
https://your-backend.com/api/v1/auth/callback/google
```

4. Add client ID + secret to backend env  
5. Add client ID to frontend env  

---

## **🚀 Running Locally**

### **Backend**
```
cd backend
npm install
npm run dev
```

### **Frontend**
```
cd frontend
npm install
npm run dev
```

---

## **📦 Deployment**
Nexora is optimized for:

- **Render** (Backend)  
- **Vercel** (Frontend)  
- **Cloudinary** (Images)  
- **MailerSend / Gmail SMTP** (Emails)

---

## **🧪 Testing**
- Jest (backend)  
- React Testing Library (frontend)  
- Postman collection included (optional)

---

## **📄 License**
This project is proprietary and owned by **Nexora**.  
All rights reserved.

---

## **💡 Roadmap**
- AI‑powered seller analytics  
- Multi‑currency support  
- Mobile app (React Native)  
- Real‑time order tracking  
- Affiliate system  
- AI‑generated product descriptions  

---

## **🤝 Contributing**
Contributions are welcome for UI, backend modules, and integrations.  
Open a PR or create an issue.

---

## **🖤 Credits**
Designed & developed by **Mahbuba Akter**.

---

