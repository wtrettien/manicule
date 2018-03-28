## Used Books reader

A standalone React/Redux web application for exploring unique manuscripts

<img src="https://travis-ci.org/lizadaly/used-books-reader.svg?branch=master" alt="Build status">

# Installation (first time)

## Mac OS

Install the package manager `brew` by going to https://brew.sh/ and following the instruction from a Terminal window.

When that completes, from a Terminal, install `npm`:

```
brew install npm
```

When _that_ completes, you should be ready to install the reader application itself:

1. Clone this Github repo
2. In a Terminal window, from the directory where you installed the repo:

```
npm install
```

It should run for a long time and then complete.

## Running the application locally (every time)

```
npm start
```

This will run the application as http://localhost:3000/usedbooks/

## Deploying the application to production

To deploy manually, first _build_ the application, then copy the contents of the build folder:

```
npm run build
```

This will create a folder called `build`. Everything inside that should be copied to your production host.



