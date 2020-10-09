# Lincoln
> 🎩 Test for broken links

**Roadmap**
- CLI usage
- check all html files in a local directory
- take in an array of pages to check

## Usage
### Library
**Basic Example**
```js
const lincoln = require("lincoln");

lincoln("https://binyam.in")
    .then(results => {
        console.log(results);
        // => {
        //      total: (number of links found),
        //      broken: [{
        //        url (link which is dead),
        //        src (page it was on),
        //        response_code (404),
        //        msg (not found)
        //      }, ...]
        // }
    })
```

**Examples**
```js
lincoln("https://binyam.in")
// => There's a sitemap.xml in the root, so we check all those urls

lincoln("https://no-sitem.app")
// => No sitemap.xml exists. We only check the given url

lincoln("https://examp.le")
// => Site doesn't exist, so we get an error
```
### CLI
_Not yet_

## Contribute
This is mainly a personal project, so I don't expect any contributions. That said, I'm open to all suggestions and/or contributions.

# Legal
This project is under the [MIT](https://github.com/binyamin/lincoln/tree/master/LICENSE) license.
