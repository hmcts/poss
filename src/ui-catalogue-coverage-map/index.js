import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const personaRoleMapping = require(join(__dirname, '../../data/persona-role-mapping.json'));

export function getPersonaRoleMapping(personaId) {
  return personaRoleMapping[personaId];
}
