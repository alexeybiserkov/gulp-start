var gulp         = require('gulp');
var notify       = require("gulp-notify");

// Utils
var watch        = require('gulp-watch');
var gulpif       = require('gulp-if');
var fs           = require('fs');
var rename       = require('gulp-rename');
var hash         = require('gulp-hash');
var browserSync  = require('browser-sync').create();

// Assets
var sourcemaps   = require('gulp-sourcemaps');

// Styles
var concatCss    = require('gulp-concat-css');
var csscomb      = require('gulp-csscomb');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss    = require('gulp-minify-css');
var sass         = require('gulp-sass');

// Javascript
var uglifyJs     = require('gulp-uglify');
var concatJs     = require('gulp-concat');
var plato        = require('gulp-plato');

//Connect
var gutil        = require( 'gulp-util' );
var ftp          = require( 'vinyl-ftp' );
var sftp         = require('gulp-sftp');

// Develop paths and options
var options = require('./options');
var filePath = require('./path');

// Tasks

gulp.task('AppStyles', function () {
    return gulp.src(filePath.src.css.app)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 5 versions', '> 1%', 'ie 9'))
        .pipe(csscomb())
        .pipe( gulpif( options.min , minifyCss() ) )
        .pipe( gulpif( options.hash , hash()) )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(filePath.dist.css.app))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe( gulpif( options.hash , hash.manifest(filePath.mainfest, { // Generate the manifest file
            deleteOld: true,
            sourceDir: __dirname + '/' + filePath.dist.css.app
        })))
        .pipe( gulpif( options.hash , gulp.dest('.') ) );
});

gulp.task('VendorStyles', function () {
    return gulp.src(filePath.src.css.libs)
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss('libs.css'))
        .pipe(minifyCss())
        .pipe( gulpif( options.hash , hash() )  )
        .pipe(gulp.dest(filePath.dist.css.libs))
        .pipe( gulpif( options.hash , hash.manifest(filePath.mainfest, { // Generate the manifest file
            deleteOld: true,
            sourceDir: __dirname + '/' + filePath.dist.css.libs
        })) )
        .pipe( gulpif( options.hash , gulp.dest('.') ) );
});

gulp.task('AppJS', function() {
    return gulp.src(filePath.src.js.app)
        .pipe( concatJs('script.js'))
        .pipe( gulpif( options.hash , hash() ) )
        .pipe( gulpif( options.min , uglifyJs()) )
        .pipe( gulp.dest(filePath.dist.js.app))
        .pipe( browserSync.stream({match: '**/*.js'}))
        .pipe( gulpif( options.hash , hash.manifest(filePath.mainfest, { // Generate the manifest file
            deleteOld: true,
            sourceDir: __dirname + '/' + filePath.dist.js.app
        })) )
        .pipe( gulpif( options.hash , gulp.dest('.') ) );
});

gulp.task('VendorJS', function() {
    return gulp.src(filePath.src.js.libs)
        .pipe(concatJs('vendor.js'))
        .pipe(uglifyJs())
        .pipe( gulpif( options.hash , hash()) )
        .pipe(gulp.dest(filePath.dist.js.libs))
        .pipe( gulpif( options.hash , hash.manifest(filePath.mainfest, { // Generate the manifest file
            deleteOld: true,
            sourceDir: __dirname + '/' + filePath.dist.js.libs
        })) )
        .pipe( gulpif( options.hash , gulp.dest('.') ) );
});

gulp.task('deploy', function () {

    var config = options.deploy;

    if ( config.type === 'ftp' ) {

        // FTP version
        var conn = ftp.create( {
            host:     config.host,
            user:     config.user,
            password: config.pass,
            parallel: 10,
            log:      gutil.log
        });

        return gulp.src( config.globs, { base: config.base , buffer: config.buffer } )
            .pipe( conn.newer( config.remotePath ) ) // only upload newer files
            .pipe( conn.dest( config.remotePath ) );

    } else if ( config.type === 'sftp' ) {

        // SFTP version
        var conn = sftp({
            host: config.host,
            user: config.user,
            pass: config.pass,
            port: config.port,
            remotePath: config.remotePath,
        });
        return gulp.src(config.globs, { base: config.base, buffer: config.buffer } )
            .pipe(conn);
    }

});

gulp.task('deploy-watch', function() {
    watch( ['../**'], function(event) {
        var config = options.deploy;
        if ( config.type === 'ftp' ) {

            // FTP version
            var conn = ftp.create( {
                host:     config.host,
                user:     config.user,
                password: config.pass,
                parallel: 10,
                log:      gutil.log
            });

            return gulp.src( event.path , { base: config.base , buffer: config.buffer } )
                .pipe( conn.newer( config.remotePath ) ) // only upload newer files
                .pipe( conn.dest( config.remotePath ) );

        } else if ( config.type === 'sftp' ) {
            // SFTP version
            var conn = sftp({
                host: config.host,
                user: config.user,
                pass: config.pass,
                port: config.port,
                remotePath: config.remotePath,
            });
            return gulp.src( event.path , { base: config.base, buffer: config.buffer } )
                .pipe(conn);
        }
    });

});

gulp.task('browser-sync', function() {
    browserSync.init(options.browserSync);
});

gulp.task('report', function () {
    return gulp.src('../assets/**/*.js')
        .pipe( gulpif( options.report, plato('report', {
            jshint: {
                options: {
                    strict: false
                }
            },
            complexity: {
                trycatch: true
            }
        })) );
});

gulp.task('watch', function(){
    gulp.watch(filePath.src.css.watch, ['AppStyles'] );
    gulp.watch(filePath.src.js.watch, ['AppJS'] );
});

gulp.task('default', [
    'VendorStyles',
    'AppStyles',
    'VendorJS',
    'AppJS',
    'report',
    'browser-sync',
    'watch'
]);