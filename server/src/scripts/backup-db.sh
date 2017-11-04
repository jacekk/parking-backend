#!/usr/bin/env bash

NOW_FORMATTED=`date +%A`
BACKUP_DIR="./db-backups"
BACKUP_PATH="$BACKUP_DIR/$NOW_FORMATTED"

mkdir -p $BACKUP_PATH

mongodump \
    --db parkly \
    --host mongodb \
    --archive=$BACKUP_PATH \
    --gzip

echo "Backed up sucessfully into: $BACKUP_PATH."
