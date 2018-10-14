<img src="app/images/manicule.png">

Manicule is a standalone React/Redux web application for presenting unique printed books and manuscripts in digital facsimile. It allows editors to:

☞ build guided tours through a book’s distinguishing features;

<img src="app/images/tour.png">

☞ annotate the edges of interesting pages with extra information;

<img src="app/images/marginalia.png">

☞ categorize and color-code each page in the facsimile, giving a bird’s-eye or "map" view of a book’s main elements;

<img src="app/images/map.png">

☞ and visualize the book’s structure.

<img src="app/images/structure.png">

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

This will run the application as http://localhost:3000/manicule/

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

This will create a folder called `build`. Everything inside that should be copied to your production host in a folder named `manicule`. 

## Building your book

The source code is loaded with a demo manuscript (Rosenbach MS 1084/2). You can begin building your own projects by switching out the demo manuscript for your own book.

### Loading the facsimile

Page images are stored in app/images/book/{edition - this is 'penn' by default}/images. Thumbnails are in the `thumbnails` folder within this directory. 

File names should begin with 0001.jpg for the first verso of the first spread (a blank may be used to begin with the cover) and increase sequentially in the order the pages are to appear. 
 
Files should be not be archival TIFFs but web-ready JPGs.  

### Updating the pages data 

Data files pertaining to the structure and metadata of the manuscript itself are in `data`. Each copy (the code calls these 'editions') will have a folder at the top:

```
data/penn/pages.json
         /structure.xml
    /bpl...
    /other-copy...
```

`pages.json` contains information about each page and its metadata.
This is usually derived from a spreadsheet with the following columns:

`index`: this begins at 1 and increases sequentially, aligning with the file names of the pages

 `signatures`: the bibliographic signatures, to be loaded in  in the bottom right and left margins of the facsimile reader
 
 `pagenum`: the page number as it appears in the book
 
`category`: the page's category (more on these below)

`description`: a secondary category or description that can be attached to any page; this appears in the margins beside the facsimile

It easiest to work from a spreadsheet and convert the CSV to a JSON after you've finished. There is a utility for this conversion in the project:

```
 ./node_modules/csvtojson/bin/csvtojson <csvfile.csv> > <jsonfile.json>
 ```
#### Categories

Categories help organize, annotate, and visualize the structure of the book. Every page is marked with a category in `pages.json`. The editors determines the categories based on what she wants to share with her edition.

For instance, if she were most interested in marking the presence of marginalia in the book, she might use only two categories: `page` and `marginalia.` These categories would appear as two different colors in the map view and would mark the bottom of the facsimile in the filmstrip and book browser. The name of a page's category appears at the bottom of the facsimile browser, as well. 

In addition to these main categories, you can  mark a secondary category or add an additional descriptor to the page. This is optional, and should be added to the `description` attribute in `pages.json`. If a description is added, it will appear as marginalia beside the page in the facsimile browser. 

To change the categories and their colors, update the color mapping in /app/utils/metadata.js. The categories named here so should match the categories used in `pages.json`. 

#### Map

The color-coded bar on the right of the homepage and below the filmstrip on the reader is called the `map` in the code. It offers a quick, color-coded overview of the book by categories.

The demo has the map boxes set to 15px width. If your book is longer, you may want to reduce these to thinner bars, so the map fits on one line. You can also expand them to form squares that align more like a grid. To change these styles, alter the `map-blocks` class in `_map.scss`.

### Building a tour

The `tour` directory contains information about the tour overlay (rendered as a bookmark on the fascimile and filmstrip view).

`tour.json` contains an item for each page in the tour. Each item is numbered, starting from 1 and increasing sequentially. The value of `page` corresponds to the value of `index` in the `pages.json` sheet. You can find this number by looking at the end of the URL when using the facsimile browser, too, which shows the left page in the spread (add 1 for the right page's index number). 

To add a tour stop to your book, create an HTML file and name it after the index number of the page where you want readers to pause. For instance, if you want readers to stop at the seventh facsimile page, you would name the file `7.html`. The file should contain a `<div>` that wraps any HTML you would like loaded in the modal overlay (text, images, video, embeds). Then update `tour.json` to add the stop. As with the pages data, it is easiest to build your tour on a spreadsheet and convert it to a JSON file when you are done.

The `item` attribute in the JSON file should run sequentially from 1 to n. This is the linear order of your tour stops. However, the pages where the tour stops can run nonsequentially, jumping from, for instance, page 30 as the first stop, to page 13 as the second stop and page 42 as the third. Thus you can build a tour that zigzags across the book, linking together separate features and elements. 

There is an `images` folder in the tour which contains cut-out detailed images of those referenced by the tour, but this is currently unused.

### Structure

`structure.xml` contains information about the format of the work, including which pages are conjoined, gathered, or inserted. It follows the data model used by <a href="https://github.com/leoba/VisColl">VisColl</a>, a project for visualizing the physical collation of a manuscript.

## Credits

This app was built and designed by Liza Daly and Whitney Trettien, with support from the Price Lab for Digital Humanities at the University of Pennsylvania. We have also benefited from the input, generosity, and open data of the Kislak Center for Special Collections, Rare Books, and Manuscripts and the Schoenberg Institute for Manuscript Studies. 

Our manicule icon comes from page 365 of the records of Christian Lehman, a notary who lived in Germantown and Philadelphia in the late eighteenth and early nineteenth centuries. It is MS Codex 1713 at the University of Pennsylvania. Visit the pointing hand in its original habitat <a href="http://dla.library.upenn.edu/dla/medren/pageturn.html?q=manicules&id=MEDREN_9963989553503681&rotation=0&fq=century_facet%3A%2219th%20century%22&currentpage=372">here</a>. 

Get in touch and let us know how you use it!