#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const UI_DIR = 'src/components/ui';
const SRC_DIR = 'src';

// Recursively find all TS/TSX files
function findFiles(dir, ext = ['.ts', '.tsx', '.jsx', '.js']) {
  let results = [];
  try {
    const list = readdirSync(dir);
    list.forEach(file => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        results = results.concat(findFiles(filePath, ext));
      } else if (ext.some(e => file.endsWith(e))) {
        results.push(filePath);
      }
    });
  } catch (err) {
    // ignore errors (directory might not exist)
  }
  return results;
}

// Extract @/components/ui/* imports from file content
function extractUIImports(content) {
  const imports = new Set();
  // Match: import ... from '@/components/ui/MODULE'
  const regex = /from\s+['"]@\/components\/ui\/([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  return Array.from(imports);
}

// Find all UI modules on disk
function findUIModules() {
  try {
    const files = readdirSync(UI_DIR);
    return files
      .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
      .map(f => f.replace(/\.tsx?$/, ''));
  } catch (err) {
    return [];
  }
}

// Main
const allFiles = findFiles(SRC_DIR);
const importMap = new Map(); // module -> Set<importer files>

allFiles.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    const imports = extractUIImports(content);
    imports.forEach(mod => {
      if (!importMap.has(mod)) importMap.set(mod, new Set());
      importMap.get(mod).add(relative(process.cwd(), file));
    });
  } catch (err) {
    // skip files that can't be read
  }
});

const onDisk = new Set(findUIModules());
const referenced = Array.from(importMap.keys());

const used = referenced.map(mod => ({
  module: mod,
  count: importMap.get(mod).size,
  importers: Array.from(importMap.get(mod)),
  onDisk: onDisk.has(mod)
}));

const unused = Array.from(onDisk).filter(mod => !importMap.has(mod));

const report = {
  timestamp: new Date().toISOString(),
  used: used.sort((a, b) => b.count - a.count),
  unused: unused.sort(),
  missing: used.filter(u => !u.onDisk).map(u => u.module)
};

writeFileSync('ui-refs.json', JSON.stringify(report, null, 2));

console.log('✅ UI Refs Check Complete');
console.log(`   Used: ${used.length} modules`);
console.log(`   Unused: ${unused.length} modules`);
console.log(`   Missing: ${report.missing.length} modules`);

if (report.missing.length > 0) {
  console.error('\n❌ ERROR: Referenced UI modules not found on disk:');
  report.missing.forEach(mod => {
    const importers = used.find(u => u.module === mod).importers;
    console.error(`   - ${mod} (imported by ${importers.length} files)`);
    importers.slice(0, 3).forEach(imp => console.error(`     • ${imp}`));
    if (importers.length > 3) console.error(`     ... and ${importers.length - 3} more`);
  });
  process.exit(1);
}
