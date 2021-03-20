const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');

const tsProject = ts.createProject('./tsconfig-build.json', { declarationFiles: true });

gulp.task('build:ts', () => {
    const result = gulp.src('src/**/*')
        .pipe(ts({
            declaration: true,
            jsx: "react",
            moduleResolution: "node"
        }));

    return merge([
        result.dts.pipe(gulp.dest('lib/types')),
        result.js.pipe(gulp.dest('lib'))
    ]);
});

gulp.task('ts:declarations', () => {
    const result = tsProject
        .src()
        .pipe(tsProject());

    return result.dts.pipe(gulp.dest('types'))
})
