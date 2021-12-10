#!/bin/bash

gatsby build || exit 1

rm -rf docs/*
cp -rv public/* docs/
