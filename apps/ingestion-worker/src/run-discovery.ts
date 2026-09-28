import { GithubAdapter } from './discovery/GithubAdapter';

async function run() {
  console.log("🚀 Starting Phase 4: Source Discovery Pipeline...\n");

  const githubAdapter = new GithubAdapter();
  
  // Discovering APIs from a GitHub repository
  const results = await githubAdapter.discover('https://github.com/github/rest-api-description');
  
  console.log("\n📦 Discovery Results:");
  console.log(JSON.stringify(results, null, 2));
}

run();
