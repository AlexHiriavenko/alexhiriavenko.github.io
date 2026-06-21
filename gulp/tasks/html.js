// для склейки итогового html файла ир разных кусочков html (хедер футер и т.п.);
import fileinclude from "gulp-file-include";
import versionNumber from "gulp-version-number";
export const html = () => {
  return (
    app.gulp
      // берет исходный html файл из src,
      .src(app.path.src.html)
      // при возникновении ошибки формирует вывод об ошибке,
      .pipe(app.plugins.plumber(app.plugins.notify.onError()))
      // склейка html,
      .pipe(fileinclude())
      // замена на правильный путь к картинке в итоговом html, с помощью регулярных выражений;
      .pipe(app.plugins.replace(/@img\//g, "./img/"))
      .pipe(app.plugins.replace(/@js\//g, "./js/"))
      .pipe(app.plugins.replace(/@\//g, "./"))
      // запрещает кеширование в браузере для определенных файлов
      .pipe(
        app.plugins.if(
          app.isProduct,
          versionNumber({
            value: "%DT%",
            append: {
              key: "_v",
              cover: 0,
              to: ["css", "js"],
            },
            output: { file: "gulp/version.json" },
          })
        )
      )
      // транпортирует из src в корень проекта (см path.js -> объект path)
      .pipe(app.gulp.dest(app.path.dist.html))
      // обновляет браузер при изменениях в исходниках html
      .pipe(app.plugins.browsersync.stream())
  );
};
