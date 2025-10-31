import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  /* VITE_로 시작하는 환경 변수를 process.env.KEY로 매핑
   → Jest 환경(Node.js)에서도 접근 가능하고
   → 브라우저 환경에서도 빌드 시 치환되어 접근 가능 */
  const processEnv = Object.keys(env)
    .filter((key) => key.startsWith('VITE_'))
    .reduce(
      (acc, key) => {
        const newKey = key.replace(/^VITE_/, '');
        acc[`process.env.${newKey}`] = JSON.stringify(env[key]);
        return acc;
      },
      {} as Record<string, string>
    );

  return {
    plugins: [react(), tailwindcss(), svgr(), mkcert()],
    server: {
      port: 3000,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: processEnv,
  };
});
