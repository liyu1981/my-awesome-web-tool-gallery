#!/bin/bash

cd chrome_helper

rm -rf dist/static/*
mkdir dist/static/

npx webpack --mode production --config webpack.prod.config.js

cd -
