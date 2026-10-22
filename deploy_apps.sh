#!/bin/bash -e
pushd apps
bun run build
popd
rm -rf static/apps
mv apps/dist static/apps
mkdir -p static/apps/feel-good
cp static/apps/index.html static/apps/feel-good/index.html
git add static/apps
git commit -m "Deploy apps"
