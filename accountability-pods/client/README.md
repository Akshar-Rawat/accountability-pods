# Accountability Pods

Accountability Pods helps small groups stay consistent with shared goals. Create a pod, choose its schedule and member limit, check in, share proof of work, and keep each other moving through realtime chat.

## Features

- Cookie-based JWT authentication
- Daily, weekday, monthly, or custom schedules
- Creator-selected member limits from 2 to 100
- Check-ins, notes, photo proof, streaks, and leaderboards
- Realtime pod chat and check-in updates with Socket.IO
- Optional browser push reminders
- Privacy, terms, contact, and FAQ pages

## Architecture

The `client` folder is a React 19 + Vite single-page app. Zustand stores auth and pod state, Axios calls the API, and React Router handles navigation.

The `server` folder is an Express API backed by MongoDB and Mongoose. Controllers validate requests and enforce pod membership. Socket.IO authenticates from the access-token cookie and only allows members into pod rooms. Cloudinary stores images; temporary multer files are deleted after processing.

## Local setup

```powershell
cd server
npm install
npm run dev

cd ..\\client
npm install
npm run dev
```

The API runs on port 5000 and the client on port 5173.

## Environment variables

`server/.env` requires MongoDB, JWT, Cloudinary, and VAPID values:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

`client/.env` contains only `VITE_VAPID_PUBLIC_KEY`, matching the server public key. Never expose the private key to the client.

For Vercel, set these environment variables and redeploy:

```env
VITE_API_URL=https://your-render-service.onrender.com/api/v1
VITE_SOCKET_URL=https://your-render-service.onrender.com
VITE_VAPID_PUBLIC_KEY=the_same_vapid_public_key
```

For Render, set `NODE_ENV=production`, `CORS_ORIGIN=https://your-vercel-domain.vercel.app`, and all server secrets. Use the Render service URL for both client URLs above. Add any custom Vercel domain to `CORS_ORIGIN` as a comma-separated value.

## Testing

```powershell
cd server
npm test
cd ..\\client
npm run lint
npm run build
```

Server tests cover authentication, protected pod routes, membership limits, check-ins, and streaks. Manually smoke-test realtime chat and push delivery in two normal browser windows.

---


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
