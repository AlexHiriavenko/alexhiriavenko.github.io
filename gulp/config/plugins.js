// автоматизация замены имен , путей и т.д.
import replace from "gulp-replace";
// формирует вывод об ошибке. Но при этом работа Gulp не прерывается.
import plumber from 'gulp-plumber';
// уведомления об ошибках
import notify from 'gulp-notify';
// запуск локального сервера и реагирования на изменения в реальном времени аналог лайв-сервер
import browsersync from 'browser-sync'
//перевірка оновлення картинки
import newer from "gulp-newer"
//умовне вітвління (для розділення на dev й prod)
import ifPlugin from "gulp-if"



export const plugins = {
    replace: replace,
    plumber: plumber,
    notify: notify,
    browsersync: browsersync,
    newer: newer,
    if: ifPlugin,
}