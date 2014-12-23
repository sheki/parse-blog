#!/bin/bash -e
$GOPATH/bin/hugo --theme=purehugo
PARSE_CONFIG_DIR="parse_app/config"
mkdir -p "$PARSE_CONFIG_DIR"
cp -rf public parse_app/public
go run scripts/gen_travis_parse_keys.go > "$PARSE_CONFIG_DIR/global.json"
cd parse_app
parse deploy
