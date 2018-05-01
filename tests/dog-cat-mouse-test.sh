#!/bin/sh
yarn cli deletemodule dog
yarn cli deletemodule cat
yarn cli deletemodule mouse
yarn cli addmodule dog --seed-count 7
yarn cli addmodule cat --seed-count 5
yarn cli addmodule mouse --seed-count 3
yarn cli link-modules dog cat --linked-seed-count 3
yarn cli link-modules dog mouse --linked-seed-count 4

# yarn cli set-seed-counts dog cat --linked-seed-count 3
# yarn cli set-seed-counts --seed-count 5 cat

rm dev-db.sqlite3
yarn seed
yarn watch