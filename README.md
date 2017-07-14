# page-loader cli-utility
[![Code Climate](https://codeclimate.com/github/vishenkov/project-lvl3-s100/badges/gpa.svg)](https://codeclimate.com/github/vishenkov/project-lvl3-s100)
[![Test Coverage](https://codeclimate.com/github/vishenkov/project-lvl3-s100/badges/coverage.svg)](https://codeclimate.com/github/vishenkov/project-lvl3-s100/coverage)
[![Issue Count](https://codeclimate.com/github/vishenkov/project-lvl3-s100/badges/issue_count.svg)](https://codeclimate.com/github/vishenkov/project-lvl3-s100)
[![Build Status](https://travis-ci.org/vishenkov/project-lvl3-s100.svg?branch=master)](https://travis-ci.org/vishenkov/project-lvl3-s100)
[![NPM Version](http://img.shields.io/npm/v/page-loader-vishkir.svg?style=flat)](https://www.npmjs.org/package/page-loader-vishkir)

## About
> Downloads all resourses of a specified page 

## Setup
```
make install
```

## Install
```
npm install page-loader-vishkir
```

## Help
```
Usage: page-loader [options] <host>

Downloads all resourses of a specified page


Options:

  -V, --version       output the version number
  -o, --output [dir]  output directory
  -h, --help          output usage information
```

## Usage example
```
page-loader -o ./tmp https://vishenkov.github.io
 ✖ https://vishenkov.github.io/assets/img/favicon.png
   → Error: Request failed with status code 404
 ✖ https://vishenkov.github.io/assets/css/notexisting.css
   → Error: Request failed with status code 404
 ✔ https://vishenkov.github.io/assets/css/foundation.css
 ✔ https://vishenkov.github.io/assets/js/app.js
 ✔ https://vishenkov.github.io/assets/css/app.css
 ✔ https://vishenkov.github.io/assets/img/user.jpg
Page was downloaded as 'vishenkov-github-io-.html'

```