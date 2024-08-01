import { spawn } from 'child_process';

function runCommand(command, args, callback) {
  const proc = spawn(command, args, { stdio: 'inherit', shell: true });

  proc.on('close', (code) => {
    console.log(`Process ${command} ${args.join(' ')} exited with code ${code}`);
    if (callback) callback(code);
  });
}

// 先运行 vuiter 的 dev 命令
runCommand('pnpm', ['--filter', 'vuiter', 'run', 'build'], (code) => {
  if (code === 0) {
    runCommand('pnpm', ['--filter', 'my-vuiter-app', 'run', 'build']);
  } else {
    console.error('vuiter dev failed, not starting my-vuiter-app');
  }
});
