export const resume = () => {
  return app.gulp.src(app.path.src.resume, { encoding: false }).pipe(app.gulp.dest(app.path.dist.resume));
};
