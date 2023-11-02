# move-folder-cli

> 命令行复制或移动文件夹


## Install

```sh
npm install --global move-folder-cli
# or
yarn add move-folder-cli -g
```

## Usage

```
move-folder -h

  Usage
    $ move-folder <source-path> <destination-path>

  Example
    // 复制 执行目录的上级目录的 build文件夹 到 dist文件夹,
    // 过滤文件名test,app,888.txt,过滤扩展名.js,.ts 文件
    move-folder build dist -n test,app,888.txt  -ext .js,.ts  -cd ..\ 
```

## Options
  | Flag  | Description                             | Value       |
  | ----- | --------------------------------------- | ----------- |
  | --d   | 是否开启调试模式.                       | false       |
  | -d    | 删除源文件夹.                           | false       |
  | -n    | 不复制这些文件名的文件可带扩展名可不带. | app,test.ts |
  | -ext  | 不复制这些扩展名的文件.                 | .js,.ts     |
  | -cn   | 复制这些文件名的文件可带扩展名可不带.   | app,test.ts |
  | -cext | 复制这些扩展名的文件.                   | .js,.ts     |
  | -cd   | 更改复制目录.                           | ../         |