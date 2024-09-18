module.exports = {
    apps: [
        {
            script: "npm run start",
        },
    ],

    deploy: {
        production: {
            user: "root",
            host: "125.212.231.98",
            ref: "origin/main",
            repo: "https://github.com/tinhtran24/customer",
            path: "/home/ubuntu/",
            "pre-deploy-local": "",
            "post-deploy":
                "source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
            "pre-setup": "",
            "ssh-options": "ForwardAgent=yes",
        },
    },
};