# VERIFY 浮点对齐补丁（遗留）

[适配表 VERIFY](../ADAPTATION.md#验证与交付) · [补丁目录](../patches/) · [Game SSOT](../AGENTS.md#game-ssot)

本作 Runtime 自 `vendor/THSSS.exe` 的 IL 反编译还原，逻辑面与零售版同源。为把 WASM 候选与零售 x87 路径做逐帧 VERIFY，曾在 `BaseObject` 上补了两道 float32 舍入，专门收口角度／瞄准路径上的精度差。

## 保留文件

| 文件 | 改动点 | 意图 |
| --- | --- | --- |
| [013-float-degree.patch](../patches/013-float-degree.patch) | `AngleDegree`／`DirectionDegree` 读写 | 度↔弧度换算按零售 x87 的 float32 中间结果落盘 |
| [014-float-aim.patch](../patches/014-float-aim.patch) | `GetDirection(PointF)` | `π + atan2` 之和先落到 float32，再进入追踪步进 |

`patches/ownership.json` 仍登记这两份补丁的归属文件，便于日后重新启用。

## 当前状态

两份补丁**仍在仓库**，但在 [patches/series](../patches/series) 里以 `#` 注释掉，`PrepareGameSources prepare` **不应用**它们，正式构建路径不含这些改动。

原因见适配表 VERIFY-01…08：本作以 IL 还原为主线，逻辑问题面已经收窄；Web 侧剩余小误差难与原版逐帧对齐，**暂时不做 VERIFY**，因此停用仅为 VERIFY 服务的浮点对齐补丁。

同系列仍在 series 中的 [010-float-direction.patch](../patches/010-float-direction.patch)／[011-float-spread.patch](../patches/011-float-spread.patch) 是更早的方向／散射步进舍入，继续参与构建；本页只记录已停用的 013／014。

## 重新启用

1. 在 `patches/series` 去掉 `#013-float-degree.patch` 与 `#014-float-aim.patch` 前的 `#`（保持现有顺序）。
2. 运行 `PrepareGameSources prepare`，再按需 `refresh-patches` 与构建。
3. 对照 [validation.md](../../../docs/adaptation/validation.md) 与 `tools/replay-verifier/` 恢复 VERIFY 流程时，再把适配表对应项从「待核对」推进。
