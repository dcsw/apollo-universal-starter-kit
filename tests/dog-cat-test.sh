#!/bin/sh
yarn cli deletemodule dog
yarn cli deletemodule cat
yarn cli -- addmodule dog --no-seed-count
yarn cli -- addmodule cat --no-seed-count
yarn cli -- link-modules dog cat --no-seed-count
yarn cli -- set-seed-counts --seed-count 7 --linked-seed-count 3 dog
yarn cli -- set-seed-counts --seed-count 5 cat
rm dev-db.sqlite3
yarn seed
yarn watch