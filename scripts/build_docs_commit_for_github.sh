#!/bin/bash

git config --local user.email "liyu1981@gmail.com"
git config --local user.name "github-actions[bot] liyu1981"
git add ./docs
git commit -m 'Auto generated docs'
