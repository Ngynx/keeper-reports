module.exports = {
    apps: [{
        name: 'reportes',
        script: './dist/main.js',
        /** PM2 will not restart your app if it crashes or ends peacefully */
        autorestart: true,
        // instances: 2,
        // exec_mode: "cluster",
        /** shutdown an application with process.send(‘shutdown’) instead of process.kill(pid, SIGINT) */
        // shutdown_with_message: true,
        exp_backoff_restart_delay: 1000
    }]
}