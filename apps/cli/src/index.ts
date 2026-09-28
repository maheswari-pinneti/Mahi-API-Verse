#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

// Config
const API_URL = process.env.MAHI_API_URL || 'http://localhost:3001/v1';

const program = new Command();

program
  .name('mahi')
  .description('The official CLI for the Mahi API Verse (10M+ APIs)')
  .version('1.0.0');

// ---------------------------------------------------------
// Command: Search
// ---------------------------------------------------------
program
  .command('search')
  .description('Search the massive API catalog')
  .argument('<query>', 'Search term (e.g. stripe, weather)')
  .action(async (query: string) => {
    const spinner = ora(`Searching for "${query}" across 10M APIs...`).start();
    try {
      // Hits the Fastify backend built in Phase 32
      const response = await axios.get(`${API_URL}/apis?q=${encodeURIComponent(query)}`);
      spinner.succeed(chalk.green(`Found ${response.data.meta?.total || 0} results for "${query}"`));
      
      console.log('\nTop Results:');
      response.data.data.forEach((api: any) => {
        console.log(`- ${chalk.blue.bold(api.name)} (ID: ${api.id})`);
        console.log(`  Status: ${api.lifecycle === 'VERIFIED' ? chalk.green('Verified') : chalk.yellow('Unverified')}`);
      });
      
    } catch (err: any) {
      spinner.fail(chalk.red('Failed to connect to the Mahi API Engine'));
      if (err.response) {
        console.error(chalk.red(err.response.data?.error || err.message));
      }
    }
  });

// ---------------------------------------------------------
// Command: Generate SDK
// ---------------------------------------------------------
program
  .command('generate')
  .description('Generate an SDK client for a specific API')
  .argument('<apiId>', 'The Canonical ID of the API')
  .option('-l, --language <language>', 'Target language (typescript, python, go, rust)', 'typescript')
  .action(async (apiId: string, options: { language: string }) => {
    const spinner = ora(`Generating ${options.language} SDK for API: ${apiId}...`).start();
    
    // In production, this hits the SDK Generator Engine (Phase 37)
    setTimeout(() => {
      spinner.succeed(chalk.green(`Successfully generated ${options.language} SDK!`));
      console.log(chalk.cyan(`\nRun \`npm install\` in the output directory to get started.`));
    }, 1500); // Mock network latency for the blueprint
  });

program.parse(process.argv);
