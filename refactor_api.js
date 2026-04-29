import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && filePath.endsWith('.tsx')) {
            callback(filePath);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

const frontendSrc = path.join(__dirname, 'frontend/src');
const apiPath = path.join(__dirname, 'frontend/src/api/apiClient.ts');

walkSync(frontendSrc, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes("import axios from 'axios';")) {
        // Determine relative path
        const relativeApi = path.relative(path.dirname(filePath), apiPath).replace(/\\/g, '/').replace('.ts', '');
        
        content = content.replace("import axios from 'axios';", `import apiClient from '${relativeApi}';`);
        
        // Remove API_BASE constants
        content = content.replace(/const API_BASE_URL? = '[^']+';\n?/g, '');
        content = content.replace(/const API_BASE? = '[^']+';\n?/g, '');
        
        // Replace axios calls
        // axios.get(`${API_BASE}/...`) -> apiClient.get('/...')
        content = content.replace(/axios\.(get|post|put|delete)\(\s*`\$\{API_BASE_?U?R?L?\}([^`]*)`([^)]*)\)/g, "apiClient.$1(`$2`$3)");
        content = content.replace(/axios\.(get|post|put|delete)\(\s*API_BASE_?U?R?L? \+ '([^']+)'([^)]*)\)/g, "apiClient.$1('$2'$3)");
        
        // Also handle cases without backticks if any: axios.get(API_BASE_URL) -> apiClient.get('/')
        content = content.replace(/axios\.(get|post|put|delete)\(\s*API_BASE_?U?R?L?\s*([^)]*)\)/g, "apiClient.$1('/'$2)");

        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Refactored API in ${path.relative(frontendSrc, filePath)}`);
    }
});
