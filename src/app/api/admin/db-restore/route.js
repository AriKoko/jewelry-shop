import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req) {
  try {
    // קבלת הקובץ מהבקשה
    const formData = await req.formData();
    const file = formData.get('backup');
    if (!file) {
      return NextResponse.json({ error: 'לא התקבל קובץ גיבוי' }, { status: 400 });
    }

    // שמירת הקובץ הזמני
    const tempZipPath = path.join(process.cwd(), 'mongo-restore.zip');
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempZipPath, Buffer.from(arrayBuffer));

    // חילוץ הקובץ
    await new Promise((resolve, reject) => {
      exec(`unzip -o mongo-restore.zip -d ./`, (error, stdout, stderr) => {
        if (error) reject(stderr || error);
        else resolve(stdout);
      });
    });

    // מריץ את סקריפט השחזור
    await new Promise((resolve, reject) => {
      exec('bash ./scripts/restore-mongo.sh', (error, stdout, stderr) => {
        if (error) reject(stderr || error);
        else resolve(stdout);
      });
    });

    // מוחק את קובץ ה-zip
    await fs.unlink(tempZipPath);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  }
} 