import { spawn } from 'child_process';

const port = process.env.PORT || 4173;
console.log(`Starting Vite preview server on port ${port}...`);

const child = spawn(
  process.execPath,
  ['./node_modules/vite/bin/vite.js', 'preview', '--host', '0.0.0.0', '--port', String(port)],
  { stdio: 'inherit' }
);

child.on('exit', (code) => {
  process.exit(code || 0);
});

