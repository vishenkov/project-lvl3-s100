install:
	npm install
start:
	npm run babel-node -- src/bin/page-loader.js
build:
	rm -rf dist
	npm run build
	make test
publish:
	npm publish
patch:
	npm version patch
lint:
	npm run eslint
test:
	npm test

.PHONY: test