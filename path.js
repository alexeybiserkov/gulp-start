module.exports = {
    src: {
        css:{
            libs: [
                'bower_components/normalize-css/normalize.css',
                'bower_components/owl.carousel/dist/assets/owl.carousel.css',
                'bower_components/owl.carousel/dist/assets/owl.theme.default.css',
                'bower_components/animate.css/animate.css'
            ],
            app: [
                'src/scss/**/*.scss'
            ],
            watch: 'src/scss/**/*.scss'
        },
        js:{
            libs: [
                'bower_components/modernizer/modernizr.js',
                'bower_components/owl.carousel/dist/owl.carousel.js',
                'src/js/app.js'
            ],
            app: [
                'src/js/main.js'
            ],
            watch: 'src/js/**/*.js'
        },
        ts:{
            app: 'src/js/**/*.ts',
            watch: 'src/js/**/*.ts'
        }
    },
    dist: {
        css:{
            libs: '../styles/',
            app: '../styles/'
        },
        js:{
            libs: '../js/',
            app: '../js/'
        },
        ts:{
            libs: '../js/',
            app: '../js/'
        }
    },
    mainfest: '../assets/assets.json'
};