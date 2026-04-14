/**
 * WCAG 2.1 AA Accessibility Audit Script
 * Tests: dark mode default, dark mode expanded card, light mode default, light mode expanded card
 * Injects axe-core manually to avoid path resolution issues with spaces in paths.
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read axe-core source directly
const axeCorePath = path.join(__dirname, 'node_modules', 'axe-core', 'axe.min.js');
const axeSource = fs.readFileSync(axeCorePath, 'utf8');

const URL_TO_TEST = 'http://localhost:5173/utdrikningslag/';
const OUTPUT = 'wcag-audit-results.json';

const SCENARIOS = [
  { name: 'Dark mode — default', setup: null },
  { name: 'Dark mode — card expanded', setup: 'expandCard' },
  { name: 'Light mode — default', setup: 'toggleTheme' },
  { name: 'Light mode — card expanded', setup: 'expandCardLight' },
];

async function waitForAnimations(page, ms = 600) {
  await new Promise((r) => setTimeout(r, ms));
}

async function runScenario(browser, scenario) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(URL_TO_TEST, { waitUntil: 'networkidle0', timeout: 30000 });
  await waitForAnimations(page, 1500); // let framer-motion animations settle

  // Apply scenario setup
  if (scenario.setup === 'expandCard') {
    const cardBtn = await page.$('button.flex.w-full');
    if (cardBtn) {
      await cardBtn.click();
      await waitForAnimations(page, 800);
    }
  } else if (scenario.setup === 'toggleTheme') {
    const themeBtn = await page.$('button[aria-label*="tema"]');
    if (themeBtn) {
      await themeBtn.click();
      await waitForAnimations(page, 800);
    }
  } else if (scenario.setup === 'expandCardLight') {
    const themeBtn = await page.$('button[aria-label*="tema"]');
    if (themeBtn) {
      await themeBtn.click();
      await waitForAnimations(page, 800);
    }
    const cardBtn = await page.$('button.flex.w-full');
    if (cardBtn) {
      await cardBtn.click();
      await waitForAnimations(page, 800);
    }
  }

  // Inject axe-core manually
  await page.evaluate(axeSource);

  // Run axe analysis
  const results = await page.evaluate(async () => {
    return await axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
      },
      resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable'],
    });
  });

  await page.close();
  return results;
}

function formatViolation(v) {
  const wcagTags = v.tags.filter(t => t.startsWith('wcag'));
  const bestPractice = v.tags.includes('best-practice');
  return {
    ruleId: v.id,
    severity: v.impact,
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    wcagCriteria: wcagTags,
    isBestPractice: bestPractice,
    nodes: v.nodes.map(n => ({
      target: n.target,
      html: n.html?.substring(0, 300),
      failureSummary: n.failureSummary,
    })),
  };
}

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const allResults = [];
  const allViolationIds = new Set();

  for (const scenario of SCENARIOS) {
    console.log(`\nScanning: ${scenario.name}...`);
    try {
      const result = await runScenario(browser, scenario);
      const formatted = result.violations.map(formatViolation);
      formatted.forEach(v => allViolationIds.add(v.ruleId));
      allResults.push({
        scenario: scenario.name,
        violationCount: formatted.length,
        violations: formatted,
        passCount: result.passes?.length || 0,
        incompleteCount: result.incomplete?.length || 0,
      });
      console.log(`  Found ${formatted.length} violations, ${result.passes?.length || 0} passes`);
    } catch (err) {
      console.error(`  Error in scenario "${scenario.name}": ${err.message}`);
      allResults.push({
        scenario: scenario.name,
        error: err.message,
        violations: [],
      });
    }
  }

  await browser.close();

  // Merge all unique violations across scenarios
  const mergedViolations = {};
  for (const result of allResults) {
    for (const v of result.violations) {
      if (!mergedViolations[v.ruleId]) {
        mergedViolations[v.ruleId] = {
          ...v,
          foundInScenarios: [],
          allNodes: [],
        };
      }
      mergedViolations[v.ruleId].foundInScenarios.push(result.scenario);
      mergedViolations[v.ruleId].allNodes.push(
        ...v.nodes.map(n => ({ ...n, scenario: result.scenario }))
      );
    }
  }

  // Deduplicate nodes by target selector
  for (const v of Object.values(mergedViolations)) {
    const seen = new Set();
    v.allNodes = v.allNodes.filter(n => {
      const key = JSON.stringify(n.target);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Severity ordering
  const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const sortedViolations = Object.values(mergedViolations).sort(
    (a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4)
  );

  // Summary stats
  const bySeverity = {};
  for (const v of sortedViolations) {
    bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
  }

  const output = {
    generatedAt: new Date().toISOString(),
    url: URL,
    summary: {
      totalUniqueViolations: sortedViolations.length,
      bySeverity,
      scenarioResults: allResults.map(r => ({
        scenario: r.scenario,
        violations: r.violationCount,
        passes: r.passCount,
      })),
    },
    violations: sortedViolations,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${OUTPUT}`);

  // Print console summary
  console.log('\n' + '='.repeat(70));
  console.log('WCAG 2.1 AA AUDIT SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total unique violations: ${sortedViolations.length}`);
  for (const [sev, count] of Object.entries(bySeverity)) {
    console.log(`  ${sev.toUpperCase()}: ${count}`);
  }
  console.log('');
  for (const v of sortedViolations) {
    console.log(`[${v.severity.toUpperCase()}] ${v.ruleId}`);
    console.log(`  ${v.help}`);
    console.log(`  WCAG: ${v.wcagCriteria.join(', ') || 'best-practice'}`);
    console.log(`  Scenarios: ${v.foundInScenarios.join(', ')}`);
    console.log(`  Affected elements (${v.allNodes.length}):`);
    for (const n of v.allNodes.slice(0, 5)) {
      console.log(`    → ${n.target.join(' > ')}`);
      if (n.failureSummary) console.log(`      Fix: ${n.failureSummary}`);
    }
    if (v.allNodes.length > 5) console.log(`    ... and ${v.allNodes.length - 5} more`);
    console.log(`  Docs: ${v.helpUrl}`);
    console.log('');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
