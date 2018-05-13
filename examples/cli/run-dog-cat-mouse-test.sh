#!/bin/sh
yarn cli deletemodule dog
yarn cli deletemodule cat
yarn cli deletemodule mouse
yarn cli addmodule dog --seed-count 7
yarn cli addmodule cat --seed-count 5
yarn cli addmodule mouse --seed-count 3 --nomenu
yarn cli link-modules dog cat --linked-seed-count 3
yarn cli link-modules dog mouse --linked-seed-count 4

yarn watch