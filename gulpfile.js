'use strict';

var gulp = require('gulp');
var gp = require('gulp-load-plugins')();

var browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		del = require('del'),
		bowerDep = require('main-bower-files'),
		flatten = require('gulp-flatten');

var browserSync = require('browser-sync'),
		reload = browserSync.reload;
var nodemon = require('gulp-nodemon');

var babel = function() {
	return gp.babel({
		presets: ['es2015']
	});
};

var wiredep = require('wiredep').stream;

// @Main serving section

gulp.task('noserved', ['hooks', 'extras', 'fnt', 'img', 'clientjs', 'sass', 'css', 'html', 'app', 'serverjs'], function(){
	// Just in case if you've done a lot coding/styling with no running servers to skip running tasks one-by-one
});

gulp.task('serve', ['browser-sync'], function () {

	// watchdogs for development changes
	gulp.watch('Devapp/Public/Styles/**/*.scss', ['sass']);
	gulp.watch('Devapp/Public/Styles/**/*.css', ['css']);
	gulp.watch('Devapp/Public/Scripts/**/*.js', ['clientjs']);
	gulp.watch('Devapp/Public/Views/*.html', ['html']);
	gulp.watch('Devapp/Public/Images/*.*', ['img']);
	gulp.watch('Devapp/Public/Fonts/*.*', ['fnt']);
	gulp.watch('Devapp/Public/Extras/*.*', ['extras']);
	gulp.watch('Devapp/Server/**/*.*', ['serverjs']);
	gulp.watch('Devapp/app.js', ['app']);
	// additional watchdogs
	gulp.watch('bower.json', ['hooks']);
	//gulp.watch('bower.json', ['wiredep', 'hooks']);

});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		notify: true,
		proxy: "http://localhost:5000",
    files: ["App/Public/**/*.*"],
    port: 9000,
		ui: {
    port: 9090
		}
	});
	gulp.src(__filename)
  .pipe(gp.open({uri: 'http://localhost:9090'}));
	gulp.src('Devapp/Logs/applogs.log')
  .pipe(gp.open({app : 'google-chrome'}));
});

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'App/app.js',
		ignore: ['App/Public/**/*.*'],
		watch: ['App/app.js', 'App/Server/**/*.*']
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
});

// @HTML parsers / helpers

gulp.task('html', ['htmlparse'], function() {
	return gulp.src('App/Public/Views/*.html')
	//.pipe(wiredep())
	.pipe(gp.useref({
		searchPath: 'App/Public'
	}))
	.pipe(gp.size({title: 'Production', showFiles: true}))
	.pipe(gulp.dest('App/Public/Views'));
})

gulp.task('htmlparse', function() {
	return gulp.src('Devapp/Public/Views/*.html')
	.pipe(gp.htmlmin({collapseWhitespace: false}))
	.pipe(gulp.dest('App/Public/Views'));
})

// @CSS parsers / helpers

gulp.task('sass', function() {
	return gulp.src('Devapp/Public/Styles/**/*.scss')
	.pipe(gp.sass.sync({
		outputStyle: 'expanded',
		precision: 10,
		includePaths: ['.']
	}).on('error', gp.sass.logError))
	.pipe(gulp.dest('Devapp/Public/Styles'));
})

gulp.task('css', function() {
	return gulp.src('Devapp/Public/Styles/*.css')
		.pipe(gp.plumber())
		.pipe(gp.concat('Main.css'))
		.pipe(gp.sourcemaps.init())
		.pipe(gp.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gp.cssnano())
		.pipe(gp.sourcemaps.write('.'))
		.pipe(gp.size({title: 'Production', showFiles: true, gzip: true}))
		.pipe(gulp.dest('App/Public/Styles'));
})

// @JavaScript parsers / helpers (ES2015 issues compiling)

gulp.task('jscompile', function() {
	var code =  gulp.src('Devapp/Public/Scripts/**/*.js')
		.pipe(babel())
		.pipe(gp.jshint())
		.pipe(gp.size())
		.pipe(gulp.dest('.Temp'));
	return code;
})

gulp.task('jsfooter', function() {
	var code =  gulp.src('.Temp/Footer.js')
		.pipe(gulp.dest('App/Public/Scripts/'));
	return code;
})

gulp.task('clientjs', ['jscompile', 'jsfooter'], function() {
	var bundled = browserify({ basedir : '.Temp'});
	var code = bundled.add('./Main.js')
		.bundle()
		.on('error', function(err) { console.error(err); this.emit('end'); })
		.pipe(source('Build.js'))
		.pipe(buffer())
		.pipe(gp.jshint())
		.pipe(gp.sourcemaps.init({loadMaps: true}))
		//.pipe(gp.uglify())
		.pipe(gp.sourcemaps.write('.'))
		.pipe(gp.size({title: 'Production', showFiles: true, gzip: true}))
		.pipe(gulp.dest('App/Public/Scripts/'));
	return code;
})

gulp.task('serverjs', function(){
	var code =  gulp.src('Devapp/Server/**/*.js')
		.pipe(babel())
		.pipe(gp.jshint())
		.pipe(gp.size())
		.pipe(gulp.dest('App/Server'));
	return code;
});

gulp.task('app', function(){
	var code =  gulp.src('Devapp/app.js')
		.pipe(babel())
		.pipe(gp.jshint())
		.pipe(gp.size())
		.pipe(gulp.dest('App'));
	return code;
});

// @Images && fonts && extras adding tasks

gulp.task('img', function() {
  return gulp.src('Devapp/Public/Images/**/*.*')
    .pipe(gp.if(gp.if.isFile, gp.cache(gp.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('App/Public/Images'));
});

gulp.task('hooks', ['styling', 'fonts'], function() {
  return gulp.src('bower_components/**/*.min.js')
		.pipe(flatten())
		.pipe(gulp.dest('App/Public/Scripts/Vendors'));
});
gulp.task('styling', function() {
  return gulp.src('bower_components/**/*.min.css')
		.pipe(flatten())
		.pipe(gulp.dest('App/Public/Styles/Vendors'));
});
gulp.task('fonts', function() {
  return gulp.src('bower_components/**/*.{eot,svg,ttf,woff,woff2}')
		.pipe(flatten())
		.pipe(gulp.dest('Devapp/Public/Fonts'));
});

gulp.task('fnt', function() {
  return gulp.src('Devapp/Public/Fonts/**/*')
	//.pipe(gp.concat('allfonts'))
	.pipe(gulp.dest('App/Public/Fonts'));
});

gulp.task('extras', function() {
  return gulp.src([
    'Devapp/Public/Extras/*.*',
		'Devapp/Public/*.*',
		'Devapp/*.*',
    '!Devapp/*.html',
		'!Devapp/*.txt',
		'!Devapp/*.js'
  ], {
    dot: true
  }).pipe(gulp.dest('App/Public/Extras'));
});

// @Helpers && first time hooks

// @@Bower components injection
gulp.task('wiredep', function() {
  gulp.src('Devapp/Public/Styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('Devapp/Public/Styles'));

  gulp.src('Devapp/Public/Views/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('Devapp/Public/Views'));
});

gulp.task('first', ['clean', 'hooks', 'extras', 'fnt', 'img', 'clientjs', 'css', 'html'], function() {
	console.warn('Initial work done.\nPlease use "gulp serve" to run project');
});

gulp.task('clean', del.bind(null, ['.Temp/*', 'App/Public/*']));

// @End of gulpfile
