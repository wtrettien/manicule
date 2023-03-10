# Manicule (version 3)

## March 2023

This is an in-development version of Manicule. It not ready for general use.

# Installation (first time)

Create a [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of this repository so you are able to add your own content.

Manicule does not require any external dependencies or libraries to operate, but it does require
a local web server to be running. The simplest thing is to use the built-in Vite library to run a local development server:

```
npm install

```

to install Vite, then:

```
npm run dev
```

every time you want to work on your local copy of Manicule.

# Changes from version 1

If you have previously worked with Manicule version 1, you may need to make the following changes to render a book on version 2:

- Data files are now stored in `src/data` (rather than `data`)
- Tour metadata is now stored adjacent to book metadata in `src/data/{edition}` rather than in its own folder.
- All book images are stored in `public/images/book/{edition}`, including tour images.
- Website styles are stored in `src/styles` as plain CSS, not SCSS. Style file names have changed from version 1.
- Source code pages are in TypeScript rather than JavaScript. If you are customizing the home page or other site pages you may need to be extra-careful about syntax as TypeScript is a bit more strict than JavaScript, but the page content should be very familiar to Manicule 1 users.
- URLs have changed from version 1 to make it simpler to deploy. You should not need to mess with `.htaccess` files or similar server configuration in version 2. However, if you are upgrading from Manicule 1 to Manicule 2, note that existing inbound links will need to be changed.

A full list of changes including internal code changes are available in CHANGELOG.md.

# Credits

This app was built and designed by Liza Daly and Whitney Trettien, with support from the Price Lab for Digital Humanities at the University of Pennsylvania. We have also benefited from the input, generosity, and open data of the Kislak Center for Special Collections, Rare Books, and Manuscripts and the Schoenberg Institute for Manuscript Studies.

Our manicule icon comes from page 365 of the records of Christian Lehman, a notary who lived in Germantown and Philadelphia in the late eighteenth and early nineteenth centuries. It is MS Codex 1713 at the University of Pennsylvania. Visit the pointing hand in its original habitat <a href="http://dla.library.upenn.edu/dla/medren/pageturn.html?q=manicules&id=MEDREN_9963989553503681&rotation=0&fq=century_facet%3A%2219th%20century%22&currentpage=372">here</a>.

Get in touch and let us know how you use it!
