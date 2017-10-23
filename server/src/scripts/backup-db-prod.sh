#!/usr/bin/env bash

NOW_FORMATTED=`date +%Y%m%d-%H%M%S-%Z`
BACKUP_DIR="/backups/dbs"
BACKUP_PATH="$BACKUP_DIR/$NOW_FORMATTED"

mkdir -p $BACKUP_PATH

mongodump \
    --db parkly \
    --host localhost \
    --out $BACKUP_PATH

echo "Backed up sucessfully into: $BACKUP_PATH."
