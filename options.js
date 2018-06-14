module.exports = {
    min: true,
    hash: false,
    report: false,
    browserSync: {
        url: 'http://maxburst.loc/',
        proxy: 'http://maxburst.loc/'
    },
    deploy: {
        type: 'ftp',
        host: '',
        port: 22,
        user: '',
        pass: '',
        remotePath: '',
        globs: ['../**', '!**/node_modules/**', '!**/bower_components/**', '!**/node_modules/', '!**/bower_components/'],
        base: '../',
        buffer: true // special
        //privateKey: fs.readFileSync('/Users/biserkov/.ssh/id_rsa') // for sftp
    }
};