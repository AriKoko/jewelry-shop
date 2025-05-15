#!/bin/bash
# שחזור מסד הנתונים jewelry-shop מגיבוי
MONGO_URI=${MONGODB_URI:-"mongodb://localhost:27017/jewelry-shop"}
BACKUP_DIR=${1:-"./backup"}

echo "משחזר את מסד הנתונים מ-$BACKUP_DIR"
mongorestore --uri="$MONGO_URI" "$BACKUP_DIR"
echo "השחזור הסתיים" 