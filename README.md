# Manicule (version 2)

Demo: <a href="https://digitalbookhistory.com/manicule">https://digitalbookhistory.com/manicule</a>

Manicule is a standalone React web application for presenting unique printed books and manuscripts in digital facsimile. It allows editors to:

☞ build guided tours through a book’s distinguishing features;

<img src="public/images/tour.png">

☞ annotate the edges of interesting pages with extra information;

<img src="public/images/marginalia.png">

☞ categorize and color-code each page in the facsimile, giving a bird’s-eye or "map" view of a book’s main elements;

<img src="public/images/map.png">

☞ and visualize the book’s structure.

<img src="public/images/structure.png">

# Installation (first time)

Create a [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of this repository so you are able to add your own content.

## Install Node Version Manager (nvm)

Follow the current instructions for <a href="https://github.com/nvm-sh/nvm#installing-and-updating">installation</a>. On MacOS and Linux, the process will be similar to:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

On MacOS you will need to have installed or upgraded the XCode Toolkit. Typically this is via Software Update or by typing:

```
xcode-select --install
```

## Install Node version 16

```
nvm install 16
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
nvm use 16
npm run start
```

This will run the application as http://localhost:3000/. You can cancel the development server by pressing Control and C.

## Running the test suite

Whenever you make a change, however trivial, it's best to run the test suite to make sure there weren't
unexpected breakages:

```
npm run test
```

All the tests should pass. Tests will also automatically be run when creating a pull request unless Github Actions are disabled in your fork of the repository.

# Building your book

The source code is loaded with a demo manuscript (Rosenbach MS 1084/2, called `default`). You can begin building your own projects by switching out the `default` manuscript for your own book.

## Loading the facsimile

Page images are stored in `public/images/book/{edition}/images`. Thumbnails are in the `thumbnails` folder within this directory.

Multiple editions can be stored in the same Manicule instance. You can overwrite the `default` book edition by replacing `public/images/book/default` with your own images, or create a new edition with a unique name.

File names should begin with `0001.jpg` for the first verso of the first spread (a blank may be used to begin with the cover) and increase sequentially in the order the pages are to appear.

Files should be web-ready JPGs, not be archival TIFFs.

## Updating the pages data

Data files pertaining to the structure and metadata of the manuscript itself are in `src/data`. Each copy (the code calls these 'editions') will have a folder at the top:

```
src/data/default/pages.json
                /structure.xml
```

`pages.json` contains information about each page and its metadata.
This is usually derived from a spreadsheet with the following columns:

`index`: this begins at 1 and increases sequentially, aligning with the file names of the pages

`signatures`: the bibliographic signatures, to be loaded in in the bottom right and left margins of the facsimile reader

`pagenum`: the page number as it appears in the book

`category`: the page's category (more on these below)

`description`: a secondary category or description that can be attached to any page; this appears in the margins beside the facsimile

It easiest to work from a spreadsheet and convert the CSV to a JSON after you've finished. There is a utility for this conversion in the project:

```
npx csvtojson <csvfile.csv> > <jsonfile.json>
```

### Categories

Categories help organize, annotate, and visualize the structure of the book. Every page is marked with a category in `pages.json`. The editors determines the categories based on what she wants to share with her edition.

For instance, if she were most interested in marking the presence of marginalia in the book, she might use only two categories: `page` and `marginalia.` These categories would appear as two different colors in the map view and would mark the bottom of the facsimile in the filmstrip and book browser. The name of a page's category appears at the bottom of the facsimile browser, as well.

In addition to these main categories, you can mark a secondary category or add an additional descriptor to the page. This is optional, and should be added to the `description` attribute in `pages.json`. If a description is added, it will appear as marginalia beside the page in the facsimile browser.

Colors are assigned to each category automatically based on a palette of colors. You can customize this palette in `src/metadata.ts` by changing the value of the variable `categoryPalette` to include a list of hex values that will be assigned.

### Map

The color-coded bar on the right of the homepage and below the filmstrip on the reader is called the `map` in the code. It offers a quick, color-coded overview of the book by categories.

The demo has the map boxes set to 15px width. If your book is longer, you may want to reduce these to thinner bars, so the map fits on one line. You can also expand them to form squares that align more like a grid. To change these styles, alter the `.block` class in `src/styles/Map.module.css`.

## Building a tour

Tour metadata is stored alongside book metadata in `src/data/{edition}/tour`. The `tour` directory contains information about the tour overlay (rendered as a bookmark on the fascimile and filmstrip view).

`tour.json` contains an item for each page in the tour. Each item is numbered, starting from 1 and increasing sequentially. The value of `page` corresponds to the value of `index` in the `pages.json` sheet. You can find this number by looking at the end of the URL when using the facsimile browser, too, which shows the left page in the spread (add 1 for the right page's index number).

To add a tour stop to your book, create an HTML file and name it after the index number of the page where you want readers to pause. For instance, if you want readers to stop at the seventh facsimile page, you would name the file `7.html`. The file should contain a `<div>` that wraps any HTML you would like loaded in the modal overlay (text, images, video, embeds). Then update `tour.json` to add the stop. As with the pages data, it is easiest to build your tour on a spreadsheet and convert it to a JSON file when you are done. To include images in a given tour HTML file, put the image files in `public/images/book/{edition}/tour` and reference them as `<img src="images/book{edition}/tour/{your-image.jpg}">`. Note that the `public` directory is omitted from the URL.

The `item` attribute in the JSON file should run sequentially from 1 to n. This is the linear order of your tour stops. However, the pages where the tour stops can run nonsequentially, jumping from, for instance, page 30 as the first stop, to page 13 as the second stop and page 42 as the third. Thus you can build a tour that zigzags across the book, linking together separate features and elements.

## Structure

`structure.xml` contains information about the format of the work, including which pages are conjoined, gathered, or inserted. It follows the data model used by <a href="https://github.com/leoba/VisColl">VisColl</a>, a project for visualizing the physical collation of a manuscript.

# Deploying the application to production

It's easiest to edit the application while running it locally. After you're done building the book (more on that below), you'll want to upload your site to your host server. To deploy the application manually, first stop your development server with Control-C, then _build_ it using this command:

```
npm run build
```

This will create a folder called `build`. Everything inside that folder should be copied to your production host in a folder of your choosing.

## Deploying with Github Pages (experimental)

A convenient way to put Manicule on the web without bothering with servers or manual deployment steps is to use [Github Pages](https://docs.github.com/en/pages), which is available for use after [forking this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

Manicule comes with a command to deploy to Pages:

```
npm run deploy
```

This will copy the current snapshot of your installation to the `gh-pages` branch (the default for Github Pages) and kick off the deploy process. Note that it can take up to 10 minutes for new or changed content to reach Pages. The URL will be something like `https://<your-github-username>.github.io/manicule`. See the "Pages" section under "Settings" in your fork for the repository. The process and URL may be different if you are using an Organizational Github account rather than a personal one.

# Changes from version 1

If you have previously worked with Manicule version 1, you may need to make the following changes to render a book on version 2:

-   Data files are now stored in `src/data` (rather than `data`)
-   Tour metadata is now stored adjacent to book metadata in `src/data/{edition}` rather than in its own folder.
-   All book images are stored in `public/images/book/{edition}`, including tour images.
-   Website styles are stored in `src/styles` as plain CSS, not SCSS. Style file names have changed from version 1.
-   Source code pages are in TypeScript rather than JavaScript. If you are customizing the home page or other site pages you may need to be extra-careful about syntax as TypeScript is a bit more strict than JavaScript, but the page content should be very familiar to Manicule 1 users.
-   URLs have changed from version 1 to make it simpler to deploy. You should not need to mess with `.htaccess` files or similar server configuration in version 2. However, if you are upgrading from Manicule 1 to Manicule 2, note that existing inbound links will need to be changed.

A full list of changes including internal code changes are available in CHANGELOG.md.

# Credits

This app was built and designed by Liza Daly and Whitney Trettien, with support from the Price Lab for Digital Humanities at the University of Pennsylvania. We have also benefited from the input, generosity, and open data of the Kislak Center for Special Collections, Rare Books, and Manuscripts and the Schoenberg Institute for Manuscript Studies.

Our manicule icon comes from page 365 of the records of Christian Lehman, a notary who lived in Germantown and Philadelphia in the late eighteenth and early nineteenth centuries. It is MS Codex 1713 at the University of Pennsylvania. Visit the pointing hand in its original habitat <a href="http://dla.library.upenn.edu/dla/medren/pageturn.html?q=manicules&id=MEDREN_9963989553503681&rotation=0&fq=century_facet%3A%2219th%20century%22&currentpage=372">here</a>.

Get in touch and let us know how you use it!
