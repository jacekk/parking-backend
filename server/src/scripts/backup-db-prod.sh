#!/usr/bin/env bash

LEAVE_LATEST=5
NOW_FORMATTED=`date +%Y%m%d-%H%M%S-%Z`
BACKUP_DIR="/backups/dbs"
BACKUP_PATH="$BACKUP_DIR/$NOW_FORMATTED"

mkdir -p $BACKUP_PATH

mongodump \
    --db parkly \
    --host localhost \
    --archive=$BACKUP_PATH \
    --gzip

echo "Backup created sucessfully into: $BACKUP_PATH."

cd "$BACKUP_DIR"
ls . | head -n -$LEAVE_LATEST | xargs rm -rf

echo "Removed oldest backups; left $LEAVE_LATEST."
