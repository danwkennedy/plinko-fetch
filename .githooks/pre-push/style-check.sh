#!/bin/bash
#
# Runs npm run style-check before commiting
#

npm run style-check || exit 1
