#!/bin/bash -e
pushd apps
bun run build
popd
rm -rf static/apps
mv apps/dist static/apps
mkdir -p static/apps/feel-good
cp static/apps/index.html static/apps/feel-good/index.html
mkdir -p static/apps/sorting-hat
cp static/apps/index.html static/apps/sorting-hat/index.html
mkdir -p static/apps/floor-plan
cp static/apps/index.html static/apps/floor-plan/index.html
git add static/apps
git commit -m "Deploy apps"
