#!/bin/bash
# גיבוי מסד הנתונים jewelry-shop לתיקיית backup
MONGO_URI=${MONGODB_URI:-"mongodb://localhost:27017/jewelry-shop"}
BACKUP_DIR=${1:-"./backup"}

echo "מגבה את מסד הנתונים ל-$BACKUP_DIR"
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR"
echo "הגיבוי הסתיים" 