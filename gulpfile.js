var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var jshint = require('gulp-jshint');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var lazypipe = require('lazypipe');
var karma = require('karma').Server;
var rollup = require('gulp-better-rollup');
var butternut = require('gulp-butternut');
var mergeStream = require('merge-stream');
var del = require('del');

var testFiles = [
    {
        src: './lib/extend.js',
        moduleName: 'deepExtend',
    },
    {
        src: './lib/urlparse.js',
        moduleName: 'urlparse',
    },
    {
        src: './lib/urltemplate.js',
        moduleName: 'urltemplate',
    },
    {
        src: './src/hyperGard.js',
        moduleName: 'HyperGard',
    },
];

var jshintFlow = lazypipe()
    .pipe(jshint)
    .pipe(jshint.reporter, 'jshint-stylish')
    .pipe(jshint.reporter, 'fail');

gulp.task('default', ['build-test-files', 'test-ci']);

gulp.task('test', function(done) {
    new karma({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

gulp.task('test-ci', function(done) {
    new karma({
        configFile: __dirname + '/karma-ci.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('jshint', function() {
    return gulp.src('src/*.js')
               .pipe(jshintFlow());
});

gulp.task('compress', function() {
    return gulp.src(['dist/*.js'])
        .pipe(butternut())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
})

gulp.task('clean:dist', function() {
    return del(['dist/**/*']);
})

gulp.task('bundle', function() {
    var entryPoint = './src/hyperGard.js';

    var umd = gulp.src(entryPoint)
        .pipe(sourcemaps.init())
        .pipe(rollup({
            format: 'umd',
            name: 'HyperGard',
            amd: {
                id: 'HyperGard',
            },
        }));

    var es = gulp.src(entryPoint)
        .pipe(sourcemaps.init())
        .pipe(rollup({
            format: 'es',
        }))
        .pipe(rename(function(path) {
            path.basename += ".es";
        }));

    return mergeStream([es, umd])
        .pipe(sourcemaps.write('./', { addComment: false }))
        .pipe(gulp.dest('dist'));
})

gulp.task('build-test-files', function() {
    var streams = testFiles.map(function(testFile){
        return gulp.src(testFile.src)
            .pipe(rollup({
                format: 'umd',
                name: testFile.moduleName,
                amd: {
                    id: testFile.moduleName,
                },
            }))
    })

    return mergeStream(streams)
        .pipe(gulp.dest('.test-build'));

})

gulp.task('build:all', gulpsync.sync(['jshint', 'build-test-files', 'test-ci', 'clean:dist', 'bundle', 'compress']));

gulp.task('canned', function() {
    var
        canned = require('canned'),
        http = require('http'),
        options = {
            port: '4444',
            src: './test/mocks',
            cors_headers: 'x-hypergard'
        },

        cannedOptions = {
            cors: options.cors || true,
            logger: options.logger || process.stdout,
            cors_headers: options.cors_headers || false
        },

        can = canned(options.src, cannedOptions),

        server = http.createServer(can).listen(options.port);

    console.log('Mock API server running at http://localhost:' + options.port + ', serving files from ' + options.src);
});
