const CACHE_NAME = "manicule"

export const cache = await caches.open(CACHE_NAME)

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
