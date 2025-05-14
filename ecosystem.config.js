const isWindows = process.platform === 'win32';
const windowsOptions = {
    interpreter: 'cmd.exe',
    interpreter_args: ['/c'],
    windowsHide: true
}
const defaultOptions = {};
const options = isWindows ? windowsOptions : defaultOptions;

module.exports = {
    apps: [
        {
            name: 'appium',
            script: 'npm',
            args: 'run appium',
            ...options
        },
        {
            name: 'auto-tool',
            script: 'npm',
            args: 'run app',
            ...options
        }
    ]
};
