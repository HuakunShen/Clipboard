server {
    listen 80;
    listen [::]:80;

    index index.html index.htm index.nginx-debian.html;

    server_name clipboard.huakunshen.com www.clipboard.huakunshen.com;

    error_page 404 /404.html;
    location = /404.html {
        root /var/www/clipboard.huakunshen.com/html/;
        internal;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/clipboard.huakunshen.com/html/;
        internal;
    }

    location / {
        root /var/www/clipboard.huakunshen.com/html;
        try_files $uri /index.html =404;
    }

    location /api/ {
        proxy_pass http://backend/api/;
    }
}
