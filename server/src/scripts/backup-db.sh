#!/usr/bin/env bash

NOW_FORMATTED=`date +%Y%m%d-%H%M%S-%Z`
BACKUP_DIR="./db-backups"
BACKUP_PATH="$BACKUP_DIR/$NOW_FORMATTED"

mkdir -p $BACKUP_PATH

mongodump \
    --db parkly \
    --host mongodb \
    --out $BACKUP_PATH

echo "Backed up sucessfully into: $BACKUP_PATH."
