#!/bin/bash

set -e

CNAME=${CNAME-`date +%s`} 

docker compose -f docker-compose.yml -p $CNAME up -d