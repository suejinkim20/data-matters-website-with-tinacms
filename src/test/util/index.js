const fs = require('fs')
const path = require('path')

function slugify(str) {
    return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  }

function emptyDirectory(dirPath) {
  const dirContents = fs.readdirSync(dirPath);

  dirContents.forEach(fileOrDirPath => {
    try {
      const fullPath = path.join(dirPath, fileOrDirPath);
      const stat = fs.statSync(fullPath);
      // if we have a sub directory...
      if (stat.isDirectory()) {
        if (fs.readdirSync(fullPath).length) emptyDirectory(fullPath);
        // note: can also delete the directory with fs.rmdirSync(fullPath);
      } else {
        // it's a file.
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error(error.message);
    }
  })
}

function formatDate(dateObject) {
  const mm = dateObject.getMonth() < 10 ? `0${ dateObject.getMonth() }` : dateObject.getMonth();
  const dd = dateObject.getDate() < 9 ? `0${ dateObject.getDate() + 1 }` : dateObject.getDate() + 1;
  const yyyy = dateObject.getFullYear();
  return `${ mm }/${ dd }/${ yyyy }`;
}

function hasDistinctElements(arr) {
  return arr.length === new Set(arr).size
}

module.exports = {
  emptyDirectory,
  formatDate,
  hasDistinctElements,
  slugify,
};
