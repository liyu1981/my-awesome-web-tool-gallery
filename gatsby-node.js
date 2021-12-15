const fs = require('fs');
const crypto = require('crypto');
const FlexSearch = require('flexsearch');

const getFirst6CharsOfSHA256ofJSON = input => {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(input))
    .digest('hex')
    .substring(0, 6);
};

const allFiles = fs.readdirSync('./src/toolsData');

const allWebTools = allFiles
  .map(file => {
    return require(`./src/toolsData/${file}`);
  })
  .map(tool =>
    Object.assign({}, tool, {
      id: getFirst6CharsOfSHA256ofJSON(tool),
    }),
  );

exports.createPages = async ({ actions: { createPage } }) => {
  createPage({
    path: `/`,
    component: require.resolve('./src/templates/gallery.tsx'),
    context: { allWebTools },
  });
};

exports.onPostBootstrap = async (ref, options) => {
  const nameIndex = new FlexSearch.Index({
    preset: 'performance',
    tokenize: 'forward',
  });
  const descriptionIndex = new FlexSearch.Index({
    preset: 'performance',
    tokenize: 'forward',
  });
  allWebTools.forEach((webTool, index) => {
    nameIndex.add(index, webTool.name);
    descriptionIndex.add(index, webTool.description);
  });
  let allIndexData = {
    nameIndexData: {},
    descriptionIndexData: {},
  };
  await nameIndex.export((key, data) => {
    allIndexData.nameIndexData[key] = data;
  });
  await descriptionIndex.export((key, data) => {
    allIndexData.descriptionIndexData[key] = data;
  });
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('will save allIndexData:', allIndexData);
      fs.writeFileSync(
        'public/webtool_all_index.json',
        JSON.stringify(allIndexData),
      );
      resolve();
    }, 1000);
  });
};
