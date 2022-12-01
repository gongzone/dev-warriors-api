import buildServer from './libs/sever';

function main() {
  const server = buildServer();
  server.start();
}

main();
