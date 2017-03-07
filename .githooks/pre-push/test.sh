#!/bin/bash
#
# Runs npm test before commiting
#

npm test || exit 1
