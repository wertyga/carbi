import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'logfile.txt');

export const logger = (msg = '', level = 'INFO') => {
  const message = {
    date: new Date(),
    level: level.toUpperCase(),
    msg,
  };
  try {
    fs.statSync(logFile);
    fs.appendFile(logFile, JSON.stringify(message) + `\n`, err => {
      if (err) console.log(err);
    })
  } catch (e) {
    if (e.code === 'ENOENT') {
      fs.writeFileSync(logFile, JSON.stringify(message) + `\n`);
    }
  }
};