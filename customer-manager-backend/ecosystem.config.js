module.exports = {
    apps: [{
        name: 'customer-api',
        script: './dist/main.js',
        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        exec_mode: 'cluster',
        instances: 3,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'dev'
        },
        env_production: {
            NODE_ENV: 'prod'
        }
    }]
};