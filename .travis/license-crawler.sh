#!/bin/bash

# Variables
CSV_FILE="nlf-licenses.csv"
CSV_FILE_APACHE="nlf-licenses.apache.csv"
MODULE_PATH=".travis/node_modules"
NLF_PATH="nlf/bin"

# Functions
function npm_package_is_installed {
  local return_=1
  ls node_modules | grep $1 > /dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}

# Begin of code
echo
echo +++ Run NLF to search for Apache-Licenses +++
echo

echo + checking if nlf is installed
cd .travis
if [ $(npm_package_is_installed nlf) == 0 ]; then
  echo "+ ERROR: nlf is not installed, please add nlf to the .travis/package.json"
  exit 1
fi
cd ..

echo + going to folder api
cd api

echo + crawling licenses from api
../$MODULE_PATH/$NLF_PATH/nlf-cli.js --csv > ../$CSV_FILE

echo + going to folder app/webFrontend
cd ../app/webFrontend

echo + crawling licenses from app/webFrontend
# append frontend licenses to existing csv; we have to skip the first line (header)
../../$MODULE_PATH/$NLF_PATH/nlf-cli.js --csv | awk '{if(NR>1)print}'  >> ../../$CSV_FILE

echo + going back to root folder
cd ../..

echo
echo + Finished crawling
echo + Printing out found Apache Licenses

# print first line (head => column-titles) of csv
head -1 $CSV_FILE
echo "-------------------------------------------------------------------------------------------------------------------"

# print rows which contain apache, with the caseinsensitive flag
cat $CSV_FILE | grep -i "apache" > $CSV_FILE_APACHE
cat $CSV_FILE_APACHE

echo + we have found $(wc -l $CSV_FILE_APACHE) potential modules with the Apache-License.

