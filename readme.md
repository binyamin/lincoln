# Lincoln

> 🎩 Test for broken links. CLI + API.

![Test](https://github.com/binyamin/lincoln/workflows/Test/badge.svg)

**Roadmap**

- check all html files in a local directory
- take in an array of pages to check
- unit tests on `/lib`

## Usage

### API

**Basic Example**

```js
import lincoln from '@binyamin/lincoln';

const results = await lincoln('https://binyam.in');
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
});
```

**Examples**

- There's a sitemap.xml in the root. We check all those urls.
- No sitemap.xml exists. We only check the given url.
- Site doesn't exist. We get an error.

### CLI

```sh
npx @binyamin/lincoln https://example.com
```

**Flags**

- _-h, --help_ - Prints usage information
- _-v, --version_ - prints version
- _-a, --allow <n>_ - Allow total broken links less than the given number
  (Default: 0)

## Contribute

This is mainly a personal project, so I don't expect any contributions. That
said, I'm open to all suggestions and/or contributions.

## Legal

This project is under the
[MIT](https://github.com/binyamin/lincoln/tree/master/LICENSE) license.
