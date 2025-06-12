#!/bin/bash -e
pushd apps
bun run build
popd
rm -rf static/apps
mv apps/dist static/apps
git add static/apps
git commit -m "Deploy apps"
