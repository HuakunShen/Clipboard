ln -s /etc/nginx/sites-available/huakunshen.com /etc/nginx/sites-enabled/huakunshen.com;
ln -s /etc/nginx/sites-available/localhost /etc/nginx/sites-enabled/localhost;

nginx -g "daemon off;";