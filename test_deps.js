try {
    require('autoprefixer');
    console.log('autoprefixer loaded');
    require('postcss');
    console.log('postcss loaded');
} catch (e) {
    console.error(e);
}
