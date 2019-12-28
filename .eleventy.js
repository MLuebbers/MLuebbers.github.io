module.exports = function(eleventyConfig) {
    eleventyConfig.addLayoutAlias('article', 'article.njk');
    // eleventyConfig.addLayoutAlias('event', 'event.njk');


    // Define Collections
    eleventyConfig.addCollection('articles', collection => {
        return [...collection.getFilteredByGlob('./src/pages/articles/*.md')]
          .reverse();
    });

    eleventyConfig.addCollection('projects', collection => {
        return [...collection.getFilteredByGlob('./src/pages/events/*.md')]
          .reverse();
    });

    eleventyConfig.addCollection('posts', collection => {
        let posts = [];
        return posts.concat([...collection.getFilteredByGlob('./src/pages/articles/*.md')], [...collection.getFilteredByGlob('./src/pages/projects/*.md')]);
    });

    // Copy files through to public directory
    eleventyConfig.addPassthroughCopy('src/media');
    eleventyConfig.addPassthroughCopy('src/styles');

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