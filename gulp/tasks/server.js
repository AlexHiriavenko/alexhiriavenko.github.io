export const server = (done) => {
   console.log(process.env.PORT);

   app.plugins.browsersync.init({
      server: {
         baseDir: `${app.path.dist.html}`
      },
      notify: false,
      port: process.env.PORT || 3000
   })
}