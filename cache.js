onmessage = async (e) => {
    const { name, url } = e.data
    const cache = await caches.open(name)
    const match = await cache.match(url)
    if (!match) {
        fetch(new Request(url)).then((resp) => {
            cache.put(url, resp)
        })
    }
}