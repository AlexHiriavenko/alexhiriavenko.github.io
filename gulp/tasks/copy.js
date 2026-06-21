
export const copy = () => {
  return app.gulp
    .src(app.path.src.files, { encoding: false }) // <-- КРИТИЧНО для gulp от 5й версии
    .pipe(app.gulp.dest(app.path.dist.files));
};