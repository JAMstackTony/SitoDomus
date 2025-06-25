module.exports = function (eleventyConfig) {
    // Копируем статические файлы (CSS, JS, изображения)
    eleventyConfig.addPassthroughCopy('src/styles');
    eleventyConfig.addPassthroughCopy('src/script');
    eleventyConfig.addPassthroughCopy('src/foto');
    eleventyConfig.addPassthroughCopy('src/translate_static.json');
    eleventyConfig.addPassthroughCopy('src/regions_translated.json');
    eleventyConfig.addPassthroughCopy('src/faq_translated.json');
    eleventyConfig.addPassthroughCopy('src/services_translated.json');


        // Фильтр для преобразования пути в slug (чистый URL)
    eleventyConfig.addFilter("slugify", function (value) {
        return value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
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