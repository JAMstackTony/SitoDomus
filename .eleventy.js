module.exports = function (eleventyConfig) {
    // Копируем статические файлы (CSS, JS, изображения)
    eleventyConfig.addPassthroughCopy('src/styles');
    eleventyConfig.addPassthroughCopy('src/script');
    eleventyConfig.addPassthroughCopy('src/foto');
    eleventyConfig.addPassthroughCopy('src/translate_static.json');
    eleventyConfig.addPassthroughCopy('src/regions_translated.json');

        // Фильтр для преобразования пути в slug (чистый URL)
    eleventyConfig.addFilter("slugify", function (value) {
        return value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    });


        // Создаем коллекцию для _announcements
    eleventyConfig.addCollection('announcements', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/_announcements/*.md')
    }); 

    // Создаем коллекцию для faq
    eleventyConfig.addCollection('faqcol', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/_announcements4/*.md');
    });    

        // Создаем коллекцию для rent
    eleventyConfig.addCollection('rent', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/_announcements5/*.md')
    });    

        // Создаем коллекцию для random
    eleventyConfig.addCollection('random', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/_announcements6/*.md')
    });    

    return {
        dir: {
            input: 'src', // Папка с исходными файлами
            output: 'dist', // Папка для выходных файлов
        },
        templateFormats: ['njk', 'md', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',        
    };
};