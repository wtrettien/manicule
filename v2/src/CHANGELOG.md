# Changes from version 1 to version 2

In late 2021, Manicule was udpated to remove dependencies on out-of-date software and to be easier to maintain in the future. This included the following internal changes:

-   Manicule is now built on [create-react-app](https://create-react-app.dev/), the officially-sanctioned React application starter.
-   Source code has been ported to [TypeScript](https://www.typescriptlang.org/), which provides a safer foundation for future maintenance and development.
-   React udpated to 17.x.
-   Redux has been removed in favor of state management through React Context now available in React 16+.
-   The animation library [react-spring](https://react-spring.io/) is now used in replace of the discontinued `react-motion`.
-   The line-drawing library `jsPlumb` has been removed; book structure diagrams are now implemented with custom SVG directly.
-   The test suite is now [https://testing-library.com/docs/react-testing-library/intro/](https://testing-library.com/docs/react-testing-library/intro/) replacing Enzyme.
-   Supported `node` version is increased to version 16 (with long-term support) up from 14, which is no longer supported.
-   SCSS installation is no longer required, so there are no non-JavaScript dependencies in Manicule 2.
-   React Router has been configured to use hash-style routing, removing the need to customize backend websites (though URLs in Manicule 2 do not exactly match Manicule 1).

Changes specific to Manicule itself:

-   Multiple editions were only partially supported in version 1. In version 2, you can switch between multiple editions by modifying the edition name in the URL: http://localhost:3000/#/reader/default/6 vs. http://localhost:3000/#/reader/your-edition/6
-   Hosting Manicule version 1 often required customizing the web server on the back end. In version 2, any web server that can serve HTML should be able to host Manicule with no customization.
-   In version 1, some JSON metadata fields had to be integer numbers and others had to be quoted string numbers. In version 2, either works and Manicule will convert to integers as appropriate.
-   Tour data files used to be in their own folder. Tour metadata is now stored alongside book metadata.
-   SCSS has been replaced with CSS Modules, and style filenames have changed to match the CSS Module conventions.
