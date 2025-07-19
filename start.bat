@echo off
chcp 65001
echo [32m正在安装依赖...[0m
call npm install

cd client
echo [32m正在安装客户端依赖...[0m
call npm install
cd ..

echo [32m正在启动服务...[0m
start cmd /k "title 后端服务 && npm run dev"
timeout /t 5

echo [32m正在启动客户端...[0m
cd client
start cmd /k "title 前端服务 && npm run dev"
cd ..
