const fs = require('fs');

exports.createPages = async ({ actions: { createPage } }) => {
  const allFiles = fs.readdirSync('./src/toolsData');
  const allTools = allFiles.map(file => {
    return require(`./src/toolsData/${file}`);
  });

  createPage({
    path: `/`,
    component: require.resolve('./src/templates/gallery.tsx'),
    context: { allTools: allTools },
  });
};
