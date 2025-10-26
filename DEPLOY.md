# Deploy Backend to Render.com

## Quick Deploy Steps:

1. **Go to [Render.com](https://render.com)** and sign up/login with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect Repository:**
   - Select `cbharath-123/facereader_frontend`
   - Click "Connect"

4. **Configure Service:**
   - **Name:** `facereader-backend` (or any name you like)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these:
   ```
   GEMINI_API_KEY=AIzaSyBmHS3CJBL2lD77RNAOEwqA73rWMS9ATnM
   DATABASE_URL=file:./dev.db
   PORT=3001
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy the URL** (will be something like: `https://facereader-backend.onrender.com`)

9. **Update Vercel:**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_BACKEND_URL` to your Render URL
   - Redeploy your frontend

## Alternative: Deploy to Railway.app

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repo and the `backend` folder
4. Add the same environment variables
5. Deploy and get the URL

---

**After deployment, update your frontend's environment variable in Vercel with the backend URL!**
