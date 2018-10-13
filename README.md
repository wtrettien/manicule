# <img src="app/images/icon-36x36.png">Manicule

A standalone React/Redux web application for exploring unique manuscripts.

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

## Running the test suite

Whenever you make a change, however trivial, it's best to run the test suite to make sure there weren't
unexpected breakages:

```
npm run test
```

All the tests should pass. If not, don't commit your change to master!

## Deploying the application to production

To deploy manually, first _build_ the application, then copy the contents of the build folder:

```
npm run build
```

This will create a folder called `build`. Everything inside that should be copied to your production host.



## Updating the data files

### Metadata and structure
Data files pertaining to the structure and metadata of the manuscript itself are in `data`.

Each copy (the code calls these 'editions') will have a folder at the top:

```
data/penn/pages.json
         /structure.xml
    /bpl...
    /other-copy...
```

`pages.json` contains information about each page and its metadata.
This is usually derived from a spreadsheet with the following columns:

`index`, `signatures`, `pagenum`, `category`

There is a utility to convert from a CSV to a JSON file in the project:

```
 ./node_modules/csvtojson/bin/csvtojson <csvfile.csv> > <jsonfile.json>
 ```

*index* should begin at 1 and increase for each page.

#### Categories

Categories help organize, annotate, and visualize the structure of the book. Every page is marked with a category in `pages.json`. The editors determines the categories based on what she wants to share with her edition.

For instance, if she were most interested in marking the presence of marginalia in the book, she might use only two categories: “page” and “annotated page.” These categories would appear as two different colors in the birds-eye view and would mark the bottom of the facsimile in the filmstrip and book browser. The name of the categories appears at the bottom of the facsimile browser, as well. 

In addition to these main categories, you might want to mark a secondary category or add an additional descriptor to the page. This is optional, and should be added to the “description” attribute of the page in `pages.json`. If a description is added, it will appear as marginalia beside the page in the facsimile browser. 

To change the categories and their colors, update the color mapping here: https://github.com/lizadaly/used-books-reader/blob/master/app/utils/metadata.js#L8 
The categories named here so should match the categories used in `pages.json`.

`structure.xml` constains information about the binding structure of the work, including which pages are conjoined or inserted.

### The tour

The `tour` directory contains information about the tour overlay (rendered as a star on the fascimile and filmstrip view).

`tour.json` contains an item for each page in the tour. Each item is numbered, starting from 1.
The value of `page` corresponds to the value of "index" in the `pages.json` sheet — meaning the numbered page starting from 1.

Each page of the tour is numbered by the corresponding page in the fascimile.

There is an `images` folder in the tour which contains cut-out detailed images of those referenced by the tour, but this is currently unused.

