var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    include = require('gulp-include'),
    open = require('gulp-open');

gulp.task('browser', function () {
  var options = {
    uri: 'localhost:3000',
    app: 'firefox'
  };
  gulp.src(__filename)
      .pipe(open(options));
});

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.sass')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({stream: true}))
});

gulp.task('sass-expanded', function () {
  return gulp.src('app/sass/**/*.sass')
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({stream: true}))
});

// зжимаем несколько jquery в один
gulp.task('js', function () {
  return gulp.src('app/js/*.js')
      .pipe(include()).on('error', console.log)
      //.pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('app/script'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('min-js', function () {
  return gulp.src('app/js/*.js')
      .pipe(include()).on('error', console.log)
      .pipe(uglify())
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest('app/script'))
      .pipe(browserSync.reload({stream: true}));
});


gulp.task('css-libs', ['sass'], function () {
  return gulp.src('app/css/libs.css')
      .pipe(cssnano())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function () {
  browserSync({

    server: {
      baseDir: 'app'
    },

    //proxy: 'gulp.loc',

    // отключяем уведомление
    notify: false

  });
});

gulp.task('clean', function () {
  return del.sync('dist');
});
// очистка кеша
gulp.task('clear', function () {
  return cache.clearAll();
});


gulp.task('img', function () {
  return gulp.src('app/img/**/*')
      .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
      })))
      .pipe(gulp.dest('app/imgmin'));
});

// gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function(){
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch('app/sass/**/*.sass', ['sass','sass-expanded']);
  gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/**/*.php', browserSync.reload);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch('app/css/**/*.css', browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('bild', ['clean', 'img', 'sass', 'scripts'], function () {
  var bildCss = gulp.src([
    'app/css/main.css',
    'app/css/libs.min.css',
  ])
      .pipe(gulp.dest('dist/css'));

  var bildFonts = gulp.src('app/fonts/**/*')
      .pipe(gulp.dest('dist/fonts'));

  var bildJs = gulp.src('app/js/*')
      .pipe(gulp.dest('dist/js'));

  var bildHtml = gulp.src('app/*.html')
      .pipe(gulp.dest('dist'));

});
