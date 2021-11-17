#!/bin/bash

set -e

bn=`git symbolic-ref --short HEAD`
bn2=`echo $bn | cut -d '/' -f 2`

CNAME=${bn2} BRANCH=${bn} docker-compose -f docker-compose.yml -p ${bn2} up -d 