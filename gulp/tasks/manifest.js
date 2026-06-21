export const manifest = () => {
  return app.gulp
    .src(app.path.src.manifest, { encoding: false })
    .pipe(app.gulp.dest(app.path.dist.manifest));
};
