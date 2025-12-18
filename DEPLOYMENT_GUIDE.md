# Deployment Guide

## Deploying to Vercel (Recommended)

The easiest way to deploy your Next.js application is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Prerequisites
- A GitHub, GitLab, or Bitbucket account
- A Vercel account (free sign up at [vercel.com](https://vercel.com/signup))

### Steps to Deploy

1. **Push your code to a Git repository**
   - Initialize git (if not already done): `git init`
   - Add files: `git add .`
   - Commit: `git commit -m "Initial commit"`
   - Push to GitHub/GitLab/Bitbucket

2. **Connect to Vercel**
   - Go to the Vercel Dashboard
   - Click **"Add New..."** -> **"Project"**
   - Import your Git repository
   - Vercel will auto-detect that it's a Next.js project

3. **Configure Environment Variables**
   - In the "Configure Project" screen, expand the **"Environment Variables"** section
   - Add any variables from your `.env.local` file:
     - `TWILIO_ACCOUNT_SID` (if used)
     - `TWILIO_AUTH_TOKEN` (if used)
     - `TWILIO_PHONE_NUMBER` (if used)

4. **Deploy**
   - Click **"Deploy"**
   - Wait for the build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Troubleshooting Vercel Builds

- If the build fails, check the "Building" logs in Vercel.
- Ensure you aren't committing any secrets (like API keys) directly in code. Use Environment Variables.
- Errors often happen if `npm install` fails due to dependency conflicts. The `package-lock.json` ensures consistent installs.

## Deploying to Netlify

1. **Push to Git** (Same as above)
2. **Log in to Netlify** and click **"New site from Git"**
3. **Choose your repo**
4. **Configure Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next` (Netlify Next.js plugin usually handles this automatically)
5. **Environment Variables**: Add them in "Site settings" -> "Build & deploy" -> "Environment"

## Docker Deployment (Advanced)

If you want to self-host using Docker:

1. **Build the image**:
   ```bash
   docker build -t whatsapp-next .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 whatsapp-next
   ```
   
   (Make sure you have a `Dockerfile` optimized for Next.js - see Next.js docs for a reference Dockerfile)
