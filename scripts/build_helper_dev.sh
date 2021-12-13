#!/bin/bash

cd chrome_helper

rm -rf dist/static/*

npx webpack --mode development --config webpack.dev.config.js --watch

cd -
