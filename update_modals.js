import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            if (filePath.endsWith('.tsx')) {
                callback(filePath);
            }
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

const frontendSrc = path.join(__dirname, 'frontend/src');

walkSync(frontendSrc, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Pattern to find standard modal outer and inner wrappers
    // Many modals have: <div className="fixed inset-0 ..."> <div className="bg-white w-full max-w-... rounded-... ">
    // Also LoginView has a card that looks like a modal.
    
    // Replace rounded-[40px], rounded-[3rem], rounded-[32px], rounded-[2.5rem], rounded-[3.5rem], rounded-2xl, rounded-3xl
    // with rounded-[10px] ONLY if they are part of a modal or a large card.
    
    // Instead of complex parsing, let's just replace all rounded-* with rounded-[10px] 
    // IF the class string contains "bg-white w-full max-w-". This covers almost all modals and cards in the app perfectly.
    
    content = content.replace(/className="([^"]*bg-white\s+w-full\s+max-w-[a-z0-9\-]+\s+[^"]*)"/g, (match, classes) => {
        let newClasses = classes.replace(/rounded-(?:sm|md|lg|xl|2xl|3xl|full)|rounded-\[[^\]]+\]/g, 'rounded-[10px]');
        if (classes !== newClasses) {
            changed = true;
            return `className="${newClasses}"`;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated modals in ${path.relative(frontendSrc, filePath)}`);
    }
});
