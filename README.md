# 📚 BookSelf – LocalStorage Based Personal Library App

**BookSelf** is a lightweight, privacy-first personal book tracking app.  
Easily manage books you're reading, plan to read, or have finished — all stored securely in your own browser with **LocalStorage**.

🔗 **Live App:** [https://notebookself.netlify.app](https://notebookself.netlify.app)

---

## ✨ Features

- ✅ **Add / Edit / Delete Books**  
  Manage your personal collection with complete control.

- 🖼️ **Upload & Preview Book Covers**  
  Add visual context to your books with custom image uploads.

- 📆 **Track Reading Timeline**  
  Record start dates, deadlines, and reading progress.

- 📊 **Dashboard Stats**  
  See how many books you’ve completed, are reading, or haven’t started.

- 🔍 **Search & Filter in Real-Time**  
  Find books instantly by title, author, or status.

- 🔔 **Deadline Warnings**  
  Books with approaching deadlines are automatically highlighted.

- 💾 **LocalStorage Based**  
  All data is saved in your browser — no accounts, no cloud, fully private.

- 📁 **Backup & Import System**  
  Export your data to JSON or import it to another device.

- 🔐 **User Isolation**  
  Every user session is completely separate and safe — no one can see or modify your data.

---

## 🎨 UI & Design

- 🎯 **Theme:** Blue (#2563eb) and White, no gradients
- 🖋️ **Typography:** Sans-serif font, modern hierarchy
- 📱 **Mobile-First:** Fully responsive on phones, tablets, and desktops
- 🎥 **Animations:** Smooth transitions and micro-interactions
- ♿ **Accessible:** Semantic HTML, ARIA labels, keyboard-navigable

---

## 📦 Tech Stack

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS (customized with strict color palette)
- **Storage:** Browser `LocalStorage`
- **Deployment:** Netlify

---

## 🚀 Getting Started

```bash
# Clone the project
git clone https://github.com/your-username/bookself-localstorage.git
cd bookself-localstorage

# Install dependencies
npm install

# Run the app locally
npm run dev

# Build for production
npm run build
