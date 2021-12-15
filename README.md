# My Awesome Web Tool Gallery

## Make a better awesome web tool list

The usual text based awesome xyz list on github is very helpful, but some times
we may want something better with rich client side technologies. Modern static
website generators plus Github pages have enabled us to build rich static
website much easier, so let us also use it for creating better awesome xyz list!

Access this list with powered by Github pages here:
https://liyu1981.github.io/my-awesome-web-tool-gallery/

## Add new tool

Add a new tool is done by adding a new `<tool_name>.js` file in `src/toolsData`
folder with following contents

```javascript
module.exports = {
  name: '<replace with the name of the tool>',
  description:
    '<replace with the description of the tool, usually is the html title>',
  url: '<URL to access the tool>',
  favicon: '<Favicon of the tool>',
  canUseInIframe: true | false, // whether the tool can be used in iframe
};
```

For the last `canUseInIframe` option, a method to decide whether it is true or
false is to check its HTTP GET response headers. If there is
`Access-Control-Allow-Origin: *` then the value should be `true`, otherwise is
`false`.

After adding the file, should use `npm run develop` to test the new tool
locally. If all is OK, then create a diff containing the `<tool_name>.js` and
send a pull request.

### add a new tool with chrome helper

There is a `chrome_helper` in this project can help on getting the config of one
tool much easier. To use it, you will need to

1. clone this repo to local
2. `npm install`, `npm run build-helper-dev`
3. open Chrome, open `chrome://extensions`, then load `unpacked extension` from
   local folder `chrome_helper/dist`
4. navigate the web tool you want to add, click the extension, it then will show
   the config in a popup window
