const fs = require('fs');
const path = require('path');

const backendDir = 'D:\\FULL STACK JAVA\\FarmXp - Integration\\BackEnd';

function walkSync(dir, fileList = []) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        walkSync(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const javaFiles = walkSync(backendDir).filter(f => f.endsWith('Controller.java'));
const apis = [];

javaFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const classMappingMatch = content.match(/@RequestMapping\s*\(\s*["']([^"']+)["']/);
  const basePath = classMappingMatch ? classMappingMatch[1] : '';

  const methodRegex = /@(Get|Post|Put|Delete|Patch)Mapping\s*\(\s*(?:path\s*=\s*)?["']([^"']*)["']/g;
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    apis.push({
      file: path.basename(file),
      method: match[1].toUpperCase(),
      path: basePath + match[2]
    });
  }
});

fs.writeFileSync('D:\\FULL STACK JAVA\\FarmXp - Integration\\backend_apis.json', JSON.stringify(apis, null, 2));
