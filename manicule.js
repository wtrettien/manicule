const COLLATION_READY_EVENT = "collation-ready";
const CACHE_NAME = "manicule";

const cache = await caches.open(CACHE_NAME);
class CollationModel extends HTMLElement {
  static get observedAttributes() {
    return ["ready"];
  }
  constructor() {
    super();
    this.data = {};
    this.insertAdjacentHTML(
      "afterbegin",
      `<style>
            :host { 
                container-type: size;
                container-name: outer;
            }
        </style>`
    );
  }
  get id() {
    return this.getAttribute("id");
  }
  async connectedCallback() {
    const resp = await fetch(`./data/${this.id}/${this.id}.json`);
    this.data = await resp.json();

    // "Derived" data is computed by us from the collation model
    this.data.derived = {};

    const rectos = Object.entries(this.data.Rectos).map(([id, data]) => {
      data.id = +id;
      return data;
    });
    const versos = Object.entries(this.data.Versos).map(([id, data]) => {
      data.id = +id;
      return data;
    });

    this.data.derived.rectos = {};
    this.data.derived.versos = {};

    for (const leaf of rectos) {
      this.data.derived.rectos[leaf.id] = leaf;
    }
    for (const leaf of versos) {
      this.data.derived.versos[leaf.id] = leaf;
    }

    this.data.derived.leaves = Object.entries(this.data.Leafs).map(
      ([id, data]) => {
        data.id = +id;
        data.terms = Object.values(this.data.Terms)
          .map((term) => {
            if (term.objects.Leaf.includes(data.id)) {
              return term.params;
            }
          })
          .filter((term) => term);
        return data;
      }
    );

    this.data.derived.linear = versos.map((e, i) => [e, rectos[i]]);
    this.data.derived.linear = this.data.derived.linear.filter(
      (e) => e[0].params.image?.url
    );

    this.data.derived.quires = [];
    for (const [id, data] of Object.entries(this.data.Groups)) {
      if (data.params.type === "Quire") {
        data.id = +id;
        data.leaves = [];
        // Get leaf ids
        for (const leafIdLabel of data.memberOrders.filter((id) =>
          id.includes("Leaf_")
        )) {
          const leafId = +leafIdLabel.split("Leaf_")[1];
          data.leaves.push(leafId);
        }
        this.data.derived.quires.push(data);
      }
    }
    console.log(this.data.derived);
    this.dispatchEvent(
      new CustomEvent(COLLATION_READY_EVENT, {
        composed: true,
        bubbles: true,
        cancelable: false,
      })
    );

    this.populateMetadata();

    this.setAttribute("ready", true);
  }
  attributeChangedCallback(name, _, value) {
    if (name === "ready" && value === "true") {
      console.log(`Collation ${this.getAttribute("id")} ready.`);
    }
  }
  populateMetadata = () => {
    // For all child nodes that want to be annotated, populate them
    for (const el of this.querySelectorAll("[data-project]")) {
      const attr = el.getAttribute("data-project");

      // Deconstruct simple ('title') or complex ('metadata.date') expressions
      const data = attr.split(".").reduce((o, i) => o[i], this.data.project);
      if (data) {
        el.textContent = data;
      } else {
        console.warn(
          `data-project parameter "${attr}" wasn't found in the JSON data for ${this.id}`
        );
      }
    }
  };
}
class CollationMember extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const collation = this.collation;
    this.id = collation.getAttribute("id");
    collation.addEventListener(COLLATION_READY_EVENT, this.ready, {
      passive: true,
      once: true,
      composed: true,
    });
  }
  ready = () => {
    throw new Error("Method 'ready()' must be implemented.");
  };
  get collation() {
    return this.closest("collation-model");
  }
}

class StructureView extends CollationMember {
  defaultWidth = 50;
  defaultHeight = 50;
  defaultSide = "verso";

  ns = "http://www.w3.org/2000/svg";

  static get observedAttributes() {
    return ["quire", "side"];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.quireIds = undefined;
    super.connectedCallback();
  }
  get quireId() {
    return +this.getAttribute("quire");
  }
  get width() {
    return +this.getAttribute("width") || this.defaultWidth;
  }
  get height() {
    return +this.getAttribute("height") || this.defaultHeight;
  }
  get side() {
    return this.getAttribute("side") || this.defaultSide;
  }
  /**
   * @param {number | string} width
   */
  set width(width) {
    this.setAttribute("width", width);
  }
  /**
   * @param {number | string} height
   */
  set height(height) {
    this.setAttribute("height", height);
  }
  /**
   * @param {string} side
   */
  set side(side) {
    this.setAttribute("side", side);
  }

  attributeChangedCallback(name, prev, value) {
    switch (name) {
      case "quires": {
        this.render();
      }
      case "side": {
        for (const button of this.shadowRoot.querySelectorAll(
          '[data-type="side-toggle"]'
        )) {
          button.innerText = this.side;
        }
        const groups = [...this.shadowRoot.querySelectorAll("structure-leaf")];

        for (const group of groups) {
          group.setAttribute("side", this.side);
        }
      }
    }
  }
  ready = () => {
    this.render();
  };
  render = () => {
    this.shadowRoot.replaceChildren();

    if (this.quireId) {
      this.quires = this.collation.data.derived.quires.filter(
        (quire) => quire.id == this.quireId
      );
    } else {
      this.quires = this.collation.data.derived.quires;
    }
    for (const quire of this.quires) {
      const row = document.createElement("div");
      this.shadowRoot.append(row);

      const header = document.createElement("h2");
      header.innerText = `Quire ${quire.id}`;
      const displaySide = document.createElement("button");
      displaySide.setAttribute("data-type", "side-toggle");
      displaySide.innerText = this.side;
      displaySide.addEventListener("click", () => {
        this.side = this.side === "recto" ? "verso" : "recto";
      });
      header.append(displaySide);
      row.append(header);
      const svg = document.createElementNS(this.ns, "svg");

      row.append(svg);

      for (const leafId of quire.leaves) {
        const leaf = this.collation.data.derived.leaves[leafId - 1]; // leaves is an array so -1

        // Always render both sides, but one will be invisible

        const recto = {
          side: "recto",
          data: this.collation.data.derived.rectos[leaf.rectoOrder],
        };
        const verso = {
          side: "verso",
          data: this.collation.data.derived.versos[leaf.versoOrder],
        };

        const group = document.createElement("structure-leaf");
        group.setAttribute("width", this.width);
        group.setAttribute("height", this.height);
        group.setAttribute("side", this.side);
        group.recto = recto;
        group.verso = verso;
        group.leaf = leaf;
        row.append(group);
      }

      const leaves = [
        ...row.querySelectorAll("structure-leaf[data-conjoined-leaf-id]"),
      ];

      const left = leaves[0].getBoundingClientRect();
      const right = leaves[leaves.length - 1].getBoundingClientRect();
      const center = (right.right - left.x) / 2;
      const svgRect = svg.getBoundingClientRect();

      let i = 0;
      const arcHeightIncrement = 15;

      // TODO come back to this; this was needed to get them to paint before calculating their position
      requestAnimationFrame(() => {
        // Loop over the elements as rendered to draw their lines
        for (const leaf of leaves) {
          const id = leaf.getAttribute("data-leaf-id");

          const lrect = leaf.getBoundingClientRect();
          // Start and end coordinates for the lines
          const startx = lrect.x - svgRect.left + lrect.width / 2;
          const starty = svgRect.height;

          let height = 0;
          // Take the index up until we hit the midpoint
          if (i < leaves.length / 2) {
            height = i * arcHeightIncrement;
          } else {
            height = (leaves.length - i - 1) * arcHeightIncrement;
          }
          height = height + 5;

          const path = document.createElementNS(this.ns, "path");

          // Draw a cubic bezier curve with two control points relative to the distance between the nodes
          const d = `M ${startx} ${starty} C ${startx} ${height}, ${center} ${height}, ${center} ${height}`;
          if (leaf.getAttribute("data-mode") === "missing") {
            path.setAttribute("stroke-dasharray", "5,5");
          }

          path.setAttributeNS(null, "d", d);
          path.setAttributeNS(null, "data-leaf-id", id);

          // Set a listener on the path and the image to display the relevant terms
          const showTerms = (e) => {
            console.log(e.target)
            const term = e.target.shadowRoot.querySelector(`dl[data-leaf-id="${id}"]`).classList.toggle('hide')
            leaf.classList.toggle("hover"); // TODO figure out how to pass this down to the final image
            path.classList.toggle("hover");
          };
          const hideTerms = (e) => {
            const term = e.target.shadowRoot.querySelector(`dl[data-leaf-id="${id}"]`).classList.toggle('hide')
            leaf.classList.toggle("hover");
            path.classList.toggle("hover");
          };
          //path.addEventListener("mouseover", showTerms);
          //path.addEventListener("mouseout", hideTerms);
          leaf.addEventListener("mouseover", showTerms);
          leaf.addEventListener("mouseout", hideTerms);

          svg.append(path);
          i++;
        }
      });
    }
    this.shadowRoot.lastChild.insertAdjacentHTML(
      "afterend",
      `<style>
        :host {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
        }
        div {
            white-space: nowrap;
            margin-bottom: 60px;
        }
        [data-type="side-toggle"] {
            background: none;
            color: var(--dark-color);
            border: 1px solid var(--dark-color);
            display: block;
            padding: 0;
            margin: 1rem 0;
        }
        svg {
            display: block;
            height: 80px;
            width: 100%;
        }
        svg path {
            stroke: black;
            stroke-width: 2;
            fill: transparent;
        }
        svg path.hover {
            stroke: var(--highlight-color);
            stroke-width: 3;
        }
        </style>
        `
    );
  };
}
class SpreadNavigator extends HTMLElement {}
class SpreadViewer extends CollationMember {
  region = "full";
  defaultWidth = 1750;
  defaultHeight = 2423;

  constructor() {
    super();
  }
  static get observedAttributes() {
    return ["index"];
  }
  get width() {
    return +this.getAttribute("width") || this.defaultWidth;
  }
  get height() {
    return +this.getAttribute("height") || this.defaultHeight;
  }
  get default() {
    return this.getAttribute("default") || "images/loading-icon.svg";
  }
  connectedCallback() {
    super.connectedCallback();
  }
  attributeChangedCallback(name, oldValue, value) {
    // Fire the render method only when the attribute has been dynamically updated
    if (name === "index" && oldValue != undefined) {
      this.render();
    }
  }
  ready = () => {
    this.render();
  };
  render = () => {
    const index = +this.getAttribute("index");
    const verso = cacheableImage(
      this.width,
      this.height,
      "leaf",
      {},
      this.default
    );
    const recto = cacheableImage(
      this.width,
      this.height,
      "leaf",
      {},
      this.default
    );

    this.shadowRoot.replaceChildren(...[verso, recto]);
    const spread = this.collation.data.derived.linear[index];

    verso.setAttribute(
      "data-url",
      iiif(spread[0].params.image.url, this.region, this.width, this.height)
    );
    recto.setAttribute(
      "data-url",
      iiif(spread[1].params.image.url, this.region, this.width, this.height)
    );
    this.shadowRoot.lastChild.insertAdjacentHTML(
      "afterend",
      `<style>
        :host {
            display: flex;
            align-items: center;
            width: 100%;          
        }
        img { 
            height: auto;
            max-width: 50%;
        }
        img.selected {
            outline: 5px solid var(--highlight-color);
            z-index: 99;            
        }
    </style>`
    );
  };
}

class LeafNav extends CollationMember {
  ready = () => {
    const button = document.createElement("button");
    button.textContent = this.getAttribute("direction");
    this.shadowRoot.append(button);
    button.addEventListener("click", () => {
      const spread = this.collation.querySelector("spread-viewer");
      const current = +spread.getAttribute("index");
      if (this.getAttribute("direction") === "next") {
        spread.setAttribute("index", current + 1);
      } else if (this.getAttribute("direction") === "previous") {
        spread.setAttribute("index", current - 1);
      }
    });
  };
}

class NavStrip extends CollationMember {
  region = "square";
  defaultWidth = 109;
  defaultHeight = 151;

  get width() {
    return +this.getAttribute("width") || this.defaultWidth;
  }
  get height() {
    return +this.getAttribute("height") || this.defaultHeight;
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.innerHTML = `<style>
         nav {
            overflow-x: auto;
            width: 100%;
            white-space: nowrap;
        }
        nav img {
            width: 50px;
            height: 50px;
        }
        </style>`;
  }
  ready = () => {
    const viewer = this.collation.querySelector("spread-viewer");
    const strip = document.createElement("nav");
    let i = 0;

    const items = this.collation.data.derived.linear.map((spread) => {
      const container = document.createElement("span");
      container.setAttribute("data-spread-index", i);
      container.addEventListener("click", () => {
        viewer.setAttribute(
          "index",
          container.getAttribute("data-spread-index")
        );
      });
      for (const leaf of spread) {
        const img = cacheableImage(this.width, this.height, "nav-leaf");

        container.append(img);

        const url = iiif(
          leaf.params.image.url,
          this.region,
          this.width,
          this.height
        );
        img.setAttribute("data-url", url);
      }
      i++;
      return container;
    });
    strip.append(...items);
    this.shadowRoot.append(strip);
  };
}

/**
 * Return an image element that will, as a side effect, cache itself and return the cached image as its source.
 *
 * @param {number} width
 * @param {number} height
 * @param {string} type
 * @param {Object} attrs
 * @param {string} srcDefault
 * @param {boolean} visible
 * @param {boolean} selected


 */
const cacheableImage = (
  width,
  height,
  type = undefined,
  attrs = {},
  srcDefault = "images/document-icon.png",
  visible = false,
  selected = false
) => {
  const loadingImg = document.createElement("img");
  loadingImg.width = width;
  loadingImg.height = height;
  loadingImg.src = srcDefault;
  loadingImg.setAttribute("data-type", type);

  const img = document.createElement("img");
  img.width = width;
  img.height = height;
  img.visible = visible;
  img.selected = selected;
  img.mousedown = false;
  img.setAttribute("data-type", type);
  img.setAttribute("data-cacheable-image", "cacheable-image");

  for (const attr of Object.entries(attrs)) {
    const [k, v] = attr;
    img.setAttribute(k, v);
  }

  loadingImg.observer = new IntersectionObserver((entries) => {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        img.cache();
        loadingImg.observer.unobserve(entry.target);
      }
    });
  });
  loadingImg.observer.observe(loadingImg);

  if (type === "leaf") {
    const start = {
      x: 0,
      y: 0,
    };
    const offset = {
      x: 0,
      y: 0,
    }; // The transform offset (from center)
    let scale = 1;
    img.addEventListener(
      "wheel",
      (e) => {
        if (img.selected) {
          scale += e.deltaY * -0.01;

          // Restrict scale
          scale = Math.min(Math.max(1, scale), 4);

          // Apply scale transform
          img.style.transform = `scale(${scale})`;

          if (scale > 1) {
            img.zoomed = true;
            img.style.zIndex = 99;
          } else {
            img.zoomed = false;
            img.style.zIndex = 1;
            img.style.translate = "0px 0px";
          }
        }
      },
      {
        passive: true,
      }
    );
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      img.selected = !img.selected;
      img.classList.toggle("selected");
    });
    img.addEventListener("mousedown", (e) => {
      img.mousedown = true;
      start.x = e.clientX - offset.x;
      start.y = e.clientY - offset.y;
    });
    img.addEventListener("mouseup", () => {
      img.mousedown = false;
    });

    img.addEventListener("mousemove", (e) => {
      if (img.mousedown && img.zoomed && img.selected) {
        e.preventDefault();
        offset.x = e.clientX - start.x;
        offset.y = e.clientY - start.y;
        img.style.translate = `${offset.x}px ${offset.y}px`;
      }
    });
  }
  img.cache = () => {
    const url = loadingImg.getAttribute("data-url");
    cache.match(url).then((resp) => {
      if (resp) {
        resp.blob().then((blob) => {
          img.src = URL.createObjectURL(blob);
          img.decode().then(() => loadingImg.replaceWith(img));
        });
      } else {
        fetch(new Request(url)).then((resp) => {
          cache.put(url, resp.clone());
          resp.blob().then((blob) => {
            img.src = URL.createObjectURL(blob);
            img.decode().then(() => loadingImg.replaceWith(img));
          });
        });
      }
    });
  };
  return loadingImg;
};

class StructureLeaf extends HTMLElement {
  static get observedAttributes() {
    return ["side"];
  }

  region = "square";

  // Contains two leaf images, one for each side
  constructor() {
    super();
    this.recto = undefined;
    this.verso = undefined;
    this.leaf = undefined;
    this.attachShadow({ mode: "open" });
  }
  get width() {
    return +this.getAttribute("width") || this.defaultWidth;
  }
  get height() {
    return +this.getAttribute("height") || this.defaultHeight;
  }
  get side() {
    return this.getAttribute("side") || this.defaultSide;
  }
  /**
   * @param {number | string} width
   */
  set width(width) {
    this.setAttribute("width", width);
  }
  /**
   * @param {number | string} height
   */
  set height(height) {
    this.setAttribute("height", height);
  }
  /**
   * @param {string} side
   */
  set side(side) {
    this.setAttribute("side", side);
  }
  connectedCallback() {
    this.style.width = `${this.width}px`;
    this.style.height = `${this.height}px`;
    const { recto, verso, leaf, side } = this;

    const figure = document.createElement("figure");
    this.shadowRoot.append(figure);

    for (const sideData of [recto, verso]) {
      const img = cacheableImage(
        this.width,
        this.height,
        "structure-leaf-image",
        {
          "data-leaf-id": leaf.id,
          "data-conjoined-leaf-id": leaf.conjoined_leaf_order,
          "data-side": sideData.side,
          "data-facing": sideData.side === this.side ? "front" : "back",
        }
      );
      img.setAttribute(
        "data-facing",
        sideData.side === this.side ? "front" : "back"
      );

      this.setAttribute("data-leaf-id", leaf.id);
      this.setAttribute("data-conjoined-leaf-id", leaf.conjoined_leaf_order);
      this.setAttribute("data-mode", leaf.params.type.toLowerCase());

      const terms = document.createElement("dl");
      terms.setAttribute("data-leaf-id", leaf.id);
      terms.classList.add("hide");

      for (const term of leaf.terms) {
        // TODO does this account for sides?
        const leafName = document.createElement("span");
        leafName.innerText = `L${leaf.id}`;
        const taxonomy = document.createElement("dt");
        const title = document.createElement("dd");
        taxonomy.innerText = term.taxonomy;
        title.innerText = term.title;
        terms.append(leafName, taxonomy, title);
      }

      // Get the URL for this leaf
      const url = iiif(
        sideData.data.params.image.url,
        this.region,
        this.width,
        this.height
      );
      img.setAttribute(
        "data-url",
        sideData.data.params.image.url ? url : img.src
      );
      figure.append(img);

      const caption = document.createElement("figcaption");
      figure.append(caption);

      // TODO associate the figure and the capture since it's not connected in the DOM
      // <figure role="region" aria-labelledby="caption-text"> + id
      caption.append(terms);
    }
    this.shadowRoot.lastChild.insertAdjacentHTML(
      "afterend",
      `<style>
        :host {
            display: inline-block;
            perspective: 600px;
        }
        [data-type="structure-leaf-image"] {
            display: inline-block;
        }
        [data-type="structure-leaf-image"].hover {
            outline: inset 2px var(--highlight-color);
        }
        [data-type="structure-leaf-image"] {
            position: absolute;
            height: 100%;
            width: 100%;
            backface-visibility: hidden;
        }
        [data-type="structure-leaf-image"][data-facing="back"] {
            transform: rotateY(180deg);
        }
        .is-flipped {
            transform: rotateY(180deg);
        }
        /* Un-rotate the caption */
        .is-flipped figcaption {
            transform: rotateY(180deg);
        }
        figcaption {
            position: absolute;
            bottom: -60px;
            width: 100%;
            height: 3rem;
        }
        figcaption dt {
            display: none;
        }
        figcaption * {
            margin: 0;
        }
        figure {
            margin: 0;
            width: 100%;
            height: 100%;
        
            position: relative;
            transition: transform 1s;
            transform-style: preserve-3d;
        }
        .hide {
            display: none;
        }
        </style>`
    );
  }
  attributeChangedCallback(name, prev, value) {
    switch (name) {
      case "side": {
        for (const fig of this.shadowRoot.querySelectorAll("figure")) {
          fig.classList.toggle("is-flipped");
        }
      }
    }
  }
}
const iiif = (
  url,
  region,
  width,
  height,
  rotation = "0",
  quality = "default",
  format = "jpg"
) => `${url}/${region}/${width},${height}/${rotation}/${quality}.${format}`;

customElements.define("collation-model", CollationModel);
customElements.define("nav-strip", NavStrip);
customElements.define("spread-viewer", SpreadViewer);
customElements.define("leaf-nav", LeafNav);
customElements.define("spread-navigator", SpreadNavigator);
customElements.define("structure-view", StructureView);
customElements.define("structure-leaf", StructureLeaf);

// Figure out how to do this intelligently
// window.addEventListener(COLLATION_READY_EVENT, (e) => {
//     setTimeout(() => {
//         // For any collation, start caching all of its full-size images
//         const worker = new Worker('cache.js')
//         const data = e.target.data
//         for (const spread of data.derived.linear) {

//             for (const leaf of spread) {

//                 const url = iiif(leaf.params.image.url,
//                     "full",
//                     "1750",
//                     "2423"
//                 )
//                 worker.postMessage({
//                     name: CACHE_NAME,
//                     url
//                 })
//             }
//         }
//     }, 5000)
// })

// Add cancel listeners to the parent
document.addEventListener("click", () => {
  [...document.querySelectorAll(".selected")].map((el) => {
    el.parentNode.selected = !el.parentNode.selected;
    el.classList.toggle("selected");
  });
});

// ESC resets all zoom options
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Escape": {
      [...document.querySelectorAll("[data-cacheable-image]")].map((el) => {
        el.zoomed = false;
        el.selected = false;
        el.style.translate = "0px 0px";
        el.style.transform = "scale(1)";
        el.classList.remove("selected");
        el.zIndex = 1;
      });
    }
  }
});
