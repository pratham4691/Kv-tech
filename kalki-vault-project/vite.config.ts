import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  createAuthChallenge,
  registerWebAuthnCredential,
  verifyWebAuthnLogin,
  handlePasswordLogin,
  validateSession,
  handleLogout,
  getProtectedTelemetry,
  getDefconState,
  setDefconState,
  getAuditLogs,
  createGateTicket,
  validateGateTicket,
  DefconLevel
} from './src/server/authBackend';
import {
  queryFable51,
  streamFable51,
  isFableConfigured
} from './src/server/fableService';

function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  res.end(JSON.stringify(data));
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'kalki-security-and-routing-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const rawUrl = req.url || '';
          const url = rawUrl.split('?')[0];
          const query = rawUrl.includes('?') ? rawUrl.substring(rawUrl.indexOf('?') + 1) : '';
          const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

          // 1. Dynamic Rotating Random URL Token Enforcement for /admin
          if (url === '/admin' || url === '/admin/' || url === '/admin.html') {
            const params = new URLSearchParams(query);
            const token = params.get('gate_token');

            // If accessed without a rotating gate token, enforce dynamic random capability URL
            if (!token || !token.startsWith('KV-SEC-')) {
              const freshToken = createGateTicket(clientIp);
              const entropy = Math.random().toString(36).substring(2, 12);
              res.writeHead(302, {
                Location: `/admin?gate_token=${freshToken}&entropy=${entropy}&issued=${Date.now()}`
              });
              res.end();
              return;
            }

            req.url = '/admin.html?' + query;
            return next();
          }
          if (url === '/login' || url === '/login/') {
            req.url = '/login.html';
            return next();
          }
          if (url === '/about' || url === '/about/') {
            req.url = '/about.html';
            return next();
          }
          if (url === '/insights' || url === '/insights/') {
            req.url = '/insights.html';
            return next();
          }

          // 2. Server-side Authenticated API Endpoints
          if (url.startsWith('/api/')) {
            const authHeader = req.headers.authorization;
            const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

            // Auth Challenge
            if (url === '/api/auth/challenge' && req.method === 'POST') {
              const result = createAuthChallenge(clientIp);
              return sendJson(res, 200, result);
            }

            // WebAuthn Passkey Registration
            if (url === '/api/auth/webauthn/register' && req.method === 'POST') {
              const body = await parseRequestBody(req);
              const result = registerWebAuthnCredential({ ...body, sessionToken, ip: clientIp });
              return sendJson(res, result.success ? 200 : 401, result);
            }

            // WebAuthn Passkey Verification
            if (url === '/api/auth/webauthn/verify' && req.method === 'POST') {
              const body = await parseRequestBody(req);
              const result = verifyWebAuthnLogin({ ...body, ip: clientIp, userAgent: req.headers['user-agent'] });
              return sendJson(res, result.success ? 200 : 401, result);
            }

            // Server-Side Password Fallback Verification
            if (url === '/api/auth/login' && req.method === 'POST') {
              const body = await parseRequestBody(req);
              const result = handlePasswordLogin(body.password || '', clientIp, req.headers['user-agent']);
              return sendJson(res, result.success ? 200 : 401, result);
            }

            // Session Verification
            if (url === '/api/auth/session' && req.method === 'GET') {
              const session = validateSession(sessionToken);
              if (session) {
                return sendJson(res, 200, { success: true, principal: session.principal, role: session.role, expiresIn: 900 });
              }
              return sendJson(res, 401, { success: false, error: 'Session invalid or expired' });
            }

            // Logout
            if (url === '/api/auth/logout' && req.method === 'POST') {
              const result = handleLogout(sessionToken, clientIp);
              return sendJson(res, 200, result);
            }

            // Protected SOC Telemetry (Strictly gated)
            if (url === '/api/admin/telemetry' && req.method === 'GET') {
              const result = getProtectedTelemetry(sessionToken);
              return sendJson(res, result.success ? 200 : 403, result);
            }

            // DEFCON State (Get)
            if (url === '/api/admin/defcon' && req.method === 'GET') {
              const result = getDefconState(sessionToken);
              return sendJson(res, 200, result);
            }

            // DEFCON State (Set)
            if (url === '/api/admin/defcon' && req.method === 'POST') {
              const body = await parseRequestBody(req);
              const result = setDefconState(body.level as DefconLevel, sessionToken, clientIp);
              return sendJson(res, result.success ? 200 : 403, result);
            }

            // Audit Logs (Strictly gated)
            if (url === '/api/admin/audit-logs' && req.method === 'GET') {
              const result = getAuditLogs(sessionToken);
              return sendJson(res, result.success ? 200 : 403, result);
            }

            // Claude Fable 5.1 Status Check
            if (url === '/api/fable/status' && req.method === 'GET') {
              return sendJson(res, 200, {
                success: true,
                model: 'anthropic/claude-fable-5.1',
                isConfigured: isFableConfigured(),
                timestamp: Date.now()
              });
            }

            // Claude Fable 5.1 Chat Completion (Streaming & Synchronous)
            if (url === '/api/fable/chat' && req.method === 'POST') {
              const body = await parseRequestBody(req);
              const messages = body.messages || [
                { role: 'user', content: body.prompt || '' }
              ];

              if (body.stream !== false) {
                res.writeHead(200, {
                  'Content-Type': 'text/event-stream',
                  'Cache-Control': 'no-cache',
                  'Connection': 'keep-alive',
                  'Access-Control-Allow-Origin': '*'
                });

                await streamFable51(
                  messages,
                  (chunk) => {
                    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                  },
                  () => {
                    res.write(`data: [DONE]\n\n`);
                    res.end();
                  },
                  (err) => {
                    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
                    res.end();
                  },
                  body.max_tokens || 350
                );
                return;
              } else {
                try {
                  const text = await queryFable51(
                    body.prompt || messages[messages.length - 1]?.content || '',
                    messages.slice(0, -1)
                  );
                  return sendJson(res, 200, {
                    success: true,
                    model: 'anthropic/claude-fable-5.1',
                    content: text
                  });
                } catch (err: any) {
                  return sendJson(res, 500, { success: false, error: err.message });
                }
              }
            }

            return sendJson(res, 404, { success: false, error: 'Endpoint not found' });
          }

          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
        login: path.resolve(__dirname, 'login.html'),
        about: path.resolve(__dirname, 'about.html'),
        insights: path.resolve(__dirname, 'insights.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
