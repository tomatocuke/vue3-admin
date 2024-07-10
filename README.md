### 技术
Vue3 + Element Plus + Vite 


### 开发 
- `npm install` 安装
- `npm run dev` 运行

### 配置文件
- `npm run dev` 会自动加载 `.env.dev` 文件 (参考`.env` 文件自己创建)
- `npm run prod` 会自动加载 `.env.prod` 文件


## 须知
- 输入任意账号密码可登录。
- 接口请求。 无后端。 本地模拟了api请求，并没有真正的发起网络请求。 自己填写数据， 在 `api.js` 里。 
- 没有使用vuex，很多变量直接页面内声明为`reactive({})`的。 公共数据放在了 `global.js` 中。
- 自动路由。  默认会加载 `view` 目录下和其子目录下的 `.vue` 文件，路由名为  `目录名/文件名` 的小写。 参考 `router/index.js`



### 部署
- `npm run build:prod` 打包
- 打包后 `dist` 目录交给后端部署， 默认接口前缀为 `当前域名/api`. 举例nginx配置
```conf
server {
  listen 80;
  server_name http://xxx.com; #页面访问的

  root /var/www/xxx/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # 代理同域名的
  location /api/ {
    rewrite ^/api(.*) $1 break; # 去除掉/api前缀
    proxy_pass http://127.0.0.1:端口号/;
  }
}
```
