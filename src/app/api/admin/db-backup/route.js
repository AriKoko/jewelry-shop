import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    console.log('התחלת תהליך גיבוי')
    // נתיב לתיקיית הגיבוי וקובץ ה-ZIP
    const rootDir = process.cwd();
    const backupDir = path.join(rootDir, 'backup');
    const zipPath = path.join(rootDir, 'mongo-backup.zip');
    
    console.log('מיקום נוכחי:', rootDir);
    console.log('נתיב גיבוי:', backupDir);
    console.log('נתיב ZIP:', zipPath);

    // מריץ את סקריפט הגיבוי עם נתיב מלא
    console.log('מריץ סקריפט גיבוי...');
    await new Promise((resolve, reject) => {
      // בדוק אם הסקריפט קיים
      const scriptPath = path.join(rootDir, 'scripts', 'backup-mongo.sh');
      fs.access(scriptPath)
        .then(() => {
          console.log('הסקריפט נמצא:', scriptPath);
          const command = `bash ${scriptPath}`;
          console.log('מריץ פקודה:', command);
          
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error('שגיאה בהרצת הסקריפט:', error);
              console.error('stderr:', stderr);
              reject(stderr || error);
            } else {
              console.log('פלט הסקריפט:', stdout);
              resolve(stdout);
            }
          });
        })
        .catch(err => {
          console.error('הסקריפט לא נמצא:', err);
          reject(new Error(`הסקריפט לא נמצא: ${scriptPath}`));
        });
    });

    // יוצר קובץ zip מהתיקייה
    console.log('יוצר קובץ ZIP...');
    await new Promise((resolve, reject) => {
      const zipCommand = `cd ${rootDir} && zip -r ${zipPath} backup`;
      console.log('פקודת ZIP:', zipCommand);
      
      exec(zipCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('שגיאה ביצירת ZIP:', error);
          console.error('stderr:', stderr);
          reject(stderr || error);
        } else {
          console.log('פלט יצירת ZIP:', stdout);
          resolve(stdout);
        }
      });
    });

    // בודק אם הקובץ נוצר
    console.log('בודק אם קובץ ZIP נוצר...');
    try {
      const stats = await fs.stat(zipPath);
      console.log('קובץ ZIP נוצר, גודל:', stats.size);
    } catch (err) {
      console.error('שגיאה בבדיקת קובץ ZIP:', err);
      throw new Error(`קובץ ה-ZIP לא נוצר: ${err.message}`);
    }

    // קורא את הקובץ
    console.log('קורא את קובץ ה-ZIP...');
    const fileBuffer = await fs.readFile(zipPath);
    console.log('קובץ ZIP נקרא, גודל:', fileBuffer.length);

    // מוחק את קובץ ה-zip אחרי השליחה
    console.log('מוחק את קובץ ה-ZIP...');
    await fs.unlink(zipPath);
    console.log('מחיקת קובץ ZIP הושלמה');

    console.log('מחזיר תשובה ללקוח');
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="mongo-backup.zip"',
      },
    });
  } catch (err) {
    console.error('שגיאה בתהליך הגיבוי:', err);
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
} 