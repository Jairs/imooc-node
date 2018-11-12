module.exports = function(grunt){

    grunt.initConfig({
        watch:{
            jade:{
                files:['views/**'],
                options:{
                    livereload:true
                }
            },
            js:{
                files:['public/js/**','models/**/*.js','shemas/**/*.js'],
                // tasks:['jshint'],
                options:{
                    livereload:true
                }
            }
        },
        nodemon:{
            dev:{
                options:{
                    file:'app.js',
                    args:[],
                    ignoredFiles:['README.md','node_moules/**','.DS_Store'],
                    watchedExtensions:['js'],
                    watchedFolders:['./'],
                    debug:true,
                    delayTime:1,
                    env:{
                        PORT:3000
                    },
                    cwd:__dirname
                }
            }
        },

        
        concurrent:{
            tasks:['nodemon','watch'],
            options:{
                logConcurrentOutput:true
            }
        }
    })

    grunt.option('force',true);
    grunt.loadNpmTasks('grunt-contrib-watch');//若有文件更新，则重新执行注册好的任务
    grunt.loadNpmTasks('grunt-contrib-nodemon');//实时更新入口文件，实时监听app.js，自动重启
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.option('force',true);
    grunt.registerTask('default',['concurrent']);
}