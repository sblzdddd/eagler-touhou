# THSSS 开发指南

[适配记录](../ADAPTATION.md) · [源码目录](../../../docs/architecture/source-layout.md) · [共用构建步骤](../../../docs/adaptation/build.md)

东方夏夜祭使用 .NET NativeAOT browser-wasm。游戏逻辑与浏览器宿主在 [THSSS-WASM](https://github.com/sblzdddd/THSSS-WASM)，本目录向共用启动器提供作品入口。完整 Runtime 位于 `ports/thsss/build-eagler/`，入口是 `thsss.html`。

## 编译与打包

在 THSSS-WASM 仓库准备 .NET 10 SDK 与 Node.js 22.18 以上，然后运行：

```sh
dotnet publish THSSS.Browser/THSSS.Browser.csproj -c Release
npm install
npm run stage:eagler
```

`npm run stage:eagler` 用 esbuild 把浏览器宿主打成单个 `shell.mjs`，并把发布产物写入该仓库的 `build-eagler/`。将这个目录放到 `ports/thsss/build-eagler/`，启动器即按产品目录加载。

## 原版内容与联调

使用自己提供的 `thsss.dat` 和 `BGM/`：

```sh
node launcher/scripts/prepare-thsss-content.mjs --original=/path/to/THSSS --output=ports/thsss/assets
```

按[启动与资源](../../../docs/adaptation/runtime.md)设置 `EAGLER_THSSS_CONTENT_DIR` 指向该输出目录，然后从仓库根目录运行 `npm run dev`。

## 自动检查

```sh
npm run ports:check -- --game=thsss --variant=normal
```

检查结果写入[适配记录](../ADAPTATION.md)。触控、存档和 Replay 的行为以产品目录中的 THSSS 登记为准。
