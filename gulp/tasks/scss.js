import * as dartSass from "sass";
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename'; 
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';

//переменная sass - вызываем gulpSass с вызовом компилятора dartSass
const sass = gulpSass(dartSass);

// функция scss котороя:
// берет исходный файл из src, с пом {sourcemaps} получает доступ к исходникам (scss будем собирать из частей - миксины , переменные и т.д.)
// настраивает сообщения об ошибках, и правильные пути к изображениям в css,
// преобразует scss в сss и прописывает название/расширение итоговому файлу ".min.css"
// выгружает итоговый файл в папку с результатом (dist)
// обновляет браузер при изменениях в исходниках scss
export const scss = () => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(app.plugins.notify.onError()))
        // .pipe(sass().on("error", sass.logError))
        .pipe(sass({
         outputStyle: 'expanded'
      }))
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(groupCssMediaQueries())
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: ["last 3 versions"],
            cascade: true
        }))
        .pipe(rename({basename:"view-only", extname: ".css"}))
        .pipe(app.plugins.if(app.isDev,                 // добавляем "красивый сss файл" (только в dev)
            app.gulp.dest(app.path.dist.css)))
        .pipe(cleanCss()) 
        .pipe(rename({basename: "styles.min", extname: ".css"}))            
        .pipe(app.gulp.dest(app.path.dist.css))        // минифицированный css после сlean + rename. (и в дев и в продакт)
        .pipe(app.plugins.browsersync.stream())
}