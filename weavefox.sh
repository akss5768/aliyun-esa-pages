#!/bin/bash

# 步骤1：要求用户输入项目命令
echo "请输入项目创建命令（例如：npm create vite@latest 或 npx create-next-app）："
read -r project_command

# 步骤2：要求用户输入项目名称
echo "请输入项目名称："
read -r project_name

# 验证输入
if [[ -z "$project_command" ]]; then
    echo "错误：项目命令不能为空"
    exit 1
fi

if [[ -z "$project_name" ]]; then
    echo "错误：项目名称不能为空"
    exit 1
fi

# 步骤3：执行用户的项目命令
echo "正在执行项目创建命令：$project_command"
eval "$project_command"

# 检查命令是否执行成功
if [ $? -ne 0 ]; then
    echo "错误：项目创建命令执行失败"
    exit 1
fi

echo "项目创建完成"

# 步骤4：将U-Sample中的所有文件拷贝到weavefox-code目录
# 首先检查U-Sample目录是否存在
if [ ! -d "U-Sample" ]; then
    echo "错误：U-Sample目录不存在"
    exit 1
fi

# 创建weavefox-code目录（如果不存在）
mkdir -p weavefox-code

# 拷贝U-Sample目录中的所有文件到weavefox-code
echo "正在拷贝U-Sample文件到weavefox-code目录..."
cp -r U-Sample/* weavefox-code/

echo "文件拷贝完成"

# 步骤5：将weavefox-code改名为用户输入的项目名称
echo "正在将weavefox-code重命名为 $project_name"
mv weavefox-code "$project_name"

# 步骤6：执行命令 lingma 项目名称
echo "正在执行 lingma 命令..."
lingma "$project_name"

if [ $? -ne 0 ]; then
    echo "警告：lingma命令执行失败，但脚本已完成其他步骤"
fi

echo "脚本执行完成！"