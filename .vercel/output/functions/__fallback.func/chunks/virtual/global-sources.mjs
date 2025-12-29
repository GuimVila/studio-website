const sources = [
    {
        "context": {
            "name": "@nuxt/content@v3:urls",
            "description": "Generated from your markdown files.",
            "tips": [
                "Parsing the following collections: "
            ]
        },
        "fetch": "/__sitemap__/nuxt-content-urls.json",
        "sourceType": "app"
    },
    {
        "context": {
            "name": "nuxt:pages",
            "description": "Generated from your static page files.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:pages'] }`."
            ]
        },
        "urls": [
            {
                "loc": "/about"
            },
            {
                "loc": "/"
            },
            {
                "loc": "/music"
            },
            {
                "loc": "/terms"
            },
            {
                "loc": "/contact"
            },
            {
                "loc": "/cookies"
            },
            {
                "loc": "/gallery"
            },
            {
                "loc": "/privacy"
            },
            {
                "loc": "/services"
            },
            {
                "loc": "/portfolio"
            },
            {
                "loc": "/resources"
            },
            {
                "loc": "/subscribe/error"
            },
            {
                "loc": "/subscribe"
            },
            {
                "loc": "/subscribe/confirmed"
            }
        ],
        "sourceType": "app"
    }
];

export { sources };
//# sourceMappingURL=global-sources.mjs.map
