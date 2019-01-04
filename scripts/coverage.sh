#!/usr/bin/env bash

rm -rf flat
node scripts/solc-patch.js
COVERAGE=true scripts/test.sh