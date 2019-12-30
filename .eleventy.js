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
    let markdownIt_attrs = require("markdown-it-attrs");
    let markdownIt_header_sections = require("markdown-it-header-sections");
    let markdownIt_multimd_table = require("markdown-it-multimd-table");

    let options = {
        html: true,
        breaks: true,
        linkify: true
    };

    let tableOptions = {
        multiline: true,
        rowspan: true,
        headerless: true
    };
    
    eleventyConfig.setLibrary("md", markdownIt(options)
                                        .use(markdownIt_attrs)
                                        .use(markdownIt_header_sections)
                                        .use(markdownIt_multimd_table)
    );

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