/** ****************************************************************************
 *
 *  Componentes
 *
 */
var gulp            = require('gulp'),
    less            = require('gulp-less'),
    lessminify      = require('gulp-minify-css'),
    jshint          = require('gulp-jshint'),
    uglify          = require('gulp-uglify'),
    gzip            = require('gulp-gzip'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    rename          = require('gulp-rename'),
    watch           = require('gulp-watch');

/** ****************************************************************************
 *
 *  Control de errores para mostrar en consola
 *
 */
function handle_errors(err)
{
    console.log(err.toString());
    this.emit('end');
}

/** ****************************************************************************
 *
 *  Obtimización de imagenes
 *
 */
gulp.task('siteImages', function()
{
    return gulp.src('./img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/img/'));
});

/** ****************************************************************************
 *
 *  Compila estilos con LESS
 *
 */
gulp.task('siteStyles', function()
{
    return gulp.src('./less/styles.less')
        .pipe(concat('site.less'))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(lessminify({keepSpecialComments: 0}))
        .pipe(rename({
            dirname: "css",
            basename: "styles",
            prefix: "site-",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(gzip())
        .pipe(rename({
            dirname: "css",
            basename: "styles",
            prefix: "site-",
            suffix: ".min",
            extname: ".gzip"
        }))
        .pipe(gulp.dest('./dist/'))
        .on('error', handle_errors);
});

/** ****************************************************************************
 *
 *  Revisa Javascript y lo comprime
 *
 */
gulp.task('siteScripts', function()
{
    var scripts = [
            'js/scripts.js'
        ];
    return gulp.src( scripts )
        .pipe(jshint())
        .pipe(jshint.reporter('default', {verbose: true}))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            dirname: "js",
            basename: "scripts",
            prefix: "site-",
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(gzip())
        .pipe(rename({
            dirname: "js",
            basename: "scripts",
            prefix: "site-",
            suffix: ".min",
            extname: ".gzip"
        }))
        .pipe(gulp.dest('./dist/'))
        .on('error', handle_errors);
});

/** ****************************************************************************
 *
 *  Concatenar librerias javascript
 *
 */
    gulp.task('vendorsjs', function()
    {
        var scripts = [
            'js/jquery.min.js',
            'js/bootstrap.min.js',
            'js/slippry.min.js',
            'bxslider/jquery.bxslider.min.js'
        ];

        return gulp.src(scripts)
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(rename({
                dirname: "js",
                basename: "vendors",
                prefix: "site-",
                suffix: ".min",
                extname: ".js"
            }))
            .pipe(gulp.dest('./dist/'))
            .pipe(gzip())
            .pipe(rename({
                dirname: "js",
                basename: "vendors",
                prefix: "site-",
                suffix: ".min",
                extname: ".gzip"
            }))
            .pipe(gulp.dest('./dist/'))
            .on('error', handle_errors);
    });

/** ****************************************************************************
 *
 *  Concatenar Librerias CSS
 *
 */
gulp.task('vendorscss', function()
{
    var styles = [
            'bxslider/jquery.bxslider.css',
            'css/slippry.css',
            'css/font-awesome.css',
            'css/bootstrap.css',
        ];

    return gulp.src( styles )
        .pipe(concat('site.css'))
        .pipe(lessminify({keepSpecialComments: 0}))
        .pipe(rename({
            dirname: "css",
            basename: "vendors",
            prefix: "site-",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(gzip())
        .pipe(rename({
            dirname: "css",
            basename: "vendors",
            prefix: "site-",
            suffix: ".min",
            extname: ".gzip"
        }))
        .pipe(gulp.dest('./dist/'))
        .on('error', handle_errors);
});


/** ****************************************************************************
 *
 *  Loop principal
 *
 */
gulp.task('loop', function()
{
    var options = {verbose: true};

    gulp.watch('less/*.less', options, ['siteStyles']);
    gulp.watch('js/*.js', options, ['siteScripts']);
    gulp.watch('img/*', options, ['siteImages']);
});

/** ****************************************************************************
 *
 *  Corre la tarea por default
 *
 */
gulp.task('default', ['vendorsjs', 'vendorscss', 'siteStyles', 'siteScripts', 'siteImages']);
gulp.task('dev', ['vendorsjs', 'vendorscss', 'siteStyles', 'siteScripts', 'siteImages', 'loop']);
