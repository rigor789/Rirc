module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            dev: {
                options: {
                    paths: ["assets/less/"]
                },
                files: {
                  "assets/css/rirc.css": "assets/less/rirc.less"
                }
            },
            prod: {
                options: {
                    paths: ["assets/less"],
                    cleancss: true
                },
            }
        },
        watch: {
          files: ['assets/less/*'],
          tasks: ['less:dev']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['less:dev']);
};