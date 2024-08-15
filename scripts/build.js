import { spawn } from 'child_process';

function runCommand(command, args) {
  const proc = spawn(command, args, { stdio: 'inherit', shell: true });

  proc.on('close', (code) => {
    console.log(`Process ${command} ${args.join(' ')} exited with code ${code}`);
  });
}

runCommand('pnpm', ['--filter', 'vuiter', 'run', 'build']);
runCommand('pnpm', ['--filter', 'my-vuiter-app', 'run', 'build']);
