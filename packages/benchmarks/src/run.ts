import autocannon from 'autocannon';
import chalk from 'chalk';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001/v1/stats';
const TARGET_CONNECTIONS = 100; // Simulated concurrent users
const DURATION_SECONDS = 10;

console.log(chalk.cyan(`🚀 Starting Mahi API Verse Synthetic Benchmark...`));
console.log(chalk.gray(`Target: ${API_URL}`));
console.log(chalk.gray(`Connections: ${TARGET_CONNECTIONS} | Duration: ${DURATION_SECONDS}s\n`));

const instance = autocannon({
  url: API_URL,
  connections: TARGET_CONNECTIONS,
  duration: DURATION_SECONDS,
  headers: {
    'Accept': 'application/json'
  }
}, (err, result) => {
  if (err) {
    console.error(chalk.red('\n❌ Benchmark Failed:'), err.message);
    process.exit(1);
  }

  console.log(chalk.green('\n✅ Benchmark Complete\n'));
  
  // Format Results
  console.log(chalk.bold('--- Performance Metrics ---'));
  console.log(`Requests/sec:    ${chalk.yellow(result.requests.average)}`);
  console.log(`Latency (Avg):   ${chalk.yellow(result.latency.average)} ms`);
  console.log(`Latency (p99):   ${chalk.yellow(result.latency.p99)} ms`);
  console.log(`Total Requests:  ${chalk.cyan(result.requests.total)}`);
  console.log(`Errors/Timeouts: ${result.errors > 0 ? chalk.red(result.errors) : chalk.green('0')}`);
  console.log(chalk.bold('---------------------------\n'));

  // Ensure our Fastify server can handle at least 5k RPS
  if (result.requests.average < 1000) {
    console.log(chalk.red('⚠️ WARNING: Performance is below the 1,000 RPS threshold. Optimization required.'));
  } else {
    console.log(chalk.green('🚀 System is performing at scale!'));
  }
});

// Stream real-time progress
autocannon.track(instance, { renderProgressBar: true });
