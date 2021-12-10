#!/bin/bash

gatsby build --prefix-paths || exit 1

rm -rf docs/*
cp -rv public/* docs/
