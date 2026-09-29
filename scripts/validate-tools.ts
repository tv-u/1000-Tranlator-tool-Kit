import { TOOLS_REGISTRY } from '../src/lib/tools/registry';

function validateToolsRegistry() {
  console.log('Validating Translator Kit tool registry...');
  const ids = new Set<string>();
  const slugs = new Set<string>();

  let productionCount = 0;
  let betaCount = 0;
  let disabledCount = 0;

  for (const tool of TOOLS_REGISTRY) {
    if (!tool.id) throw new Error(`Tool missing ID: ${JSON.stringify(tool)}`);
    if (ids.has(tool.id)) throw new Error(`Duplicate tool ID detected: ${tool.id}`);
    ids.add(tool.id);

    if (!tool.slug) throw new Error(`Tool missing slug: ${tool.id}`);
    if (slugs.has(tool.slug)) throw new Error(`Duplicate tool slug detected: ${tool.slug}`);
    slugs.add(tool.slug);

    if (!tool.name) throw new Error(`Tool missing name: ${tool.id}`);
    if (!tool.category) throw new Error(`Tool missing category: ${tool.id}`);
    if (!tool.engine) throw new Error(`Tool missing engine: ${tool.id}`);

    if (tool.status === 'production') productionCount++;
    else if (tool.status === 'beta') betaCount++;
    else if (tool.status === 'disabled') disabledCount++;
  }

  console.log('--- Registry Validation Report ---');
  console.log(`Total Registry Entries: ${TOOLS_REGISTRY.length}`);
  console.log(`Production Tools: ${productionCount}`);
  console.log(`Beta Tools: ${betaCount}`);
  console.log(`Disabled Tools: ${disabledCount}`);
  console.log('Tool registry validation passed successfully.');
}

validateToolsRegistry();
