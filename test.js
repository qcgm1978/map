ghpages = {
    options: {
        add: true,
        base: './',//specify the current dir
        branch: 'master',
        repo: 'https://github.com/qcgm1978/web.git',
        user: {
            name: 'ZhangHong-liang',
            email: 'qcgm197874@gmail.com'
        }
    },

    src: ['**/*', '!node_modules/**/*', '!dist/**/*']
}