import gulp from "gulp";
import fs from "fs";
import imagemin from "gulp-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminOptipng from "imagemin-optipng";
import imageminSvgo from "imagemin-svgo";
// import webp from "gulp-webp"; // если нужно

// Растр: jpg, jpeg, png, gif, webp, ico
export const imagesRaster = () => {
  const distDir = app.path.dist.images;
  const hasDist = fs.existsSync(distDir);

  let stream = gulp.src(app.path.src.images, { encoding: false }) // КРИТИЧЕСКО!
    .pipe(app.plugins.plumber());

  if (hasDist) {
    stream = stream.pipe(app.plugins.newer(distDir));
  }

  // если нужно webp в проде:
  // if (app.isProduct) {
  //   stream = stream.pipe(webp());
  // }

  stream = stream.pipe(
    app.plugins.if(
      app.isProduct, // оптимизация только в проде (по желанию)
      imagemin(
        [
          imageminMozjpeg({ quality: 80, progressive: true }),
          imageminOptipng({ optimizationLevel: 3 }),
        ],
        { verbose: true }
      )
    )
  );

  return stream
    .pipe(gulp.dest(distDir))
    .pipe(app.plugins.browsersync.stream());
};

// SVG отдельным потоком
export const imagesSvg = () => {
  const distDir = app.path.dist.images;
  const hasDist = fs.existsSync(distDir);

  let stream = gulp.src(app.path.src.svg, { encoding: false }) // можно и без, но не вредно
    .pipe(app.plugins.plumber());

  if (hasDist) {
    stream = stream.pipe(app.plugins.newer(distDir));
  }

  stream = stream.pipe(
    app.plugins.if(
      app.isProduct,
      imagemin(
        [
          imageminSvgo({
            plugins: [{ name: "removeViewBox", active: false }],
          }),
        ],
        { verbose: true }
      )
    )
  );

  return stream
    .pipe(gulp.dest(distDir))
    .pipe(app.plugins.browsersync.stream());
};

// Общая задача — без вложенных src(): корректно завершится на gulp 5
export const images = gulp.parallel(imagesRaster, imagesSvg);