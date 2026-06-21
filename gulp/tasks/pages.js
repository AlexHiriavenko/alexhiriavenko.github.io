// import fileinclude from "gulp-file-include";
// import versionNumber from "gulp-version-number";

// export const pages = () => {
//   return (
//     app.gulp
//       // base: сохраняем структуру вида src/certificates/index.html → dist/certificates/index.html
//       .src(app.path.src.pages)
//       .pipe(app.plugins.plumber(app.plugins.notify.onError()))
//       // .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
//       .pipe(fileinclude())
//       .pipe(app.plugins.replace(/@img\//g, "./img/"))
//       .pipe(
//         app.plugins.if(
//           app.isProduct,
//           versionNumber({
//             value: "%DT%",
//             append: { key: "_v", cover: 0, to: ["css", "js"] },
//             output: { file: "gulp/version.json" },
//           })
//         )
//       )
//       .pipe(app.gulp.dest(app.path.dist.html))
//       .pipe(app.plugins.browsersync.stream())
//   );
// };

// gulp/tasks/pages.js
import fileinclude from "gulp-file-include";
import versionNumber from "gulp-version-number";
import * as path from "path";

export const pages = () => {
  return app.gulp
    .src(app.path.src.pages, { base: path.join(app.path.srcFolder, "pages") })
    .pipe(app.plugins.plumber(app.plugins.notify.onError()))
    .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
    .pipe(app.plugins.replace(/@img\//g, "../img/"))
    .pipe(app.plugins.replace(/@js\//g, "../js/"))
    .pipe(app.plugins.replace(/@\//g, "../"))
    .pipe(
      app.plugins.if(
        app.isProduct,
        versionNumber({
          value: "%DT%",
          append: { key: "_v", cover: 0, to: ["css", "js"] },
          output: { file: "gulp/version.json" },
        })
      )
    )
    .pipe(app.gulp.dest(app.path.dist.html)) // dist/
    .pipe(app.plugins.browsersync.stream());
};
