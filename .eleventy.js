module.exports = function(eleventyConfig) {
    eleventyConfig.addLayoutAlias('article', 'article.njk');
    eleventyConfig.addLayoutAlias('project', 'project.njk');

    // Define Collections
    eleventyConfig.addCollection('articles', collection => {
        return [...collection.getFilteredByGlob('./src/pages/articles/*.md')]
          .reverse();
    });

    eleventyConfig.addCollection('projects', collection => {
        return [...collection.getFilteredByGlob('./src/pages/projects/*.md')]
          .reverse();
    });

    eleventyConfig.addCollection('posts', collection => {
        let posts = [];
        return posts.concat([...collection.getFilteredByGlob('./src/pages/articles/*.md')], [...collection.getFilteredByGlob('./src/pages/projects/*.md')]);
    });

    // Copy files through to public directory
    eleventyConfig.addPassthroughCopy('src/media');
    eleventyConfig.addPassthroughCopy('src/scripts');
    eleventyConfig.addPassthroughCopy('src/styles');

    let markdownIt = require("markdown-it");
    let options = {
      html: true,
      breaks: true,
      linkify: true
    };
    
    eleventyConfig.setLibrary("md", markdownIt(options));
    // markdownTemplateEngine: "njk",
    // templateFormats: ["html", "md", "njk"],
    return {
        passthroughFileCopy: true,
        dir: {
            input: "src",
            output: "public",
            layouts: "./layouts",
            includes: "./includes"
        }
    };
};