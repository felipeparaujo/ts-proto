#!/usr/bin/env bash

SCRIPTPATH="$(
  cd -- "$(dirname "$0")" || exit >/dev/null 2>&1
  pwd -P
)"

cd "$SCRIPTPATH" || exit
yarn build

cd test-protos || exit
rm -rf gen

export PATH="$PATH:$SCRIPTPATH"
buf generate
