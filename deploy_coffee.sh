#!/bin/bash -e
pushd caffeinated-bracket-battle
bun run build
popd
rm -rf static/coffee
mv caffeinated-bracket-battle/dist static/coffee
git add static/coffee
git commit -m "Deploy coffee"
