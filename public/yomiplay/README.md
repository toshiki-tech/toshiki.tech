# YomiPlay 版本分发清单

这个目录通过 `toshiki.tech` 静态托管「应用内更新检查」用的版本清单。

固定访问地址（接口契约，客户端写死，**不要改路径**）：

| 资源 | 地址 | 用途 |
|---|---|---|
| Android 清单 | `https://www.toshiki.tech/yomiplay/android-version.json` | 安卓自更新检查 |
| iOS 清单 | `https://www.toshiki.tech/yomiplay/ios-version.json` | 苹果版本/更新说明 |

> ⚠️ 规范域名是 `www.toshiki.tech`。apex `toshiki.tech` 会 307 跳转到 www，客户端请清单时**直接用 www 域名**，避免多一次重定向。

> 这些路径在 `src/middleware.ts` 里被显式放行，不做 locale 重定向。
> APK **不放在本仓库**，托管在对象存储（R2 / S3 等），清单里的 `apkUrl` 填存储给的 HTTPS 直链。

---

## Android：`android-version.json` 字段

| 字段 | 含义 |
|---|---|
| `versionCode` | 最新版本号（整数，对应 app 的 versionCode）。客户端用 `remote.versionCode > BuildConfig.VERSION_CODE` 判断有无更新 |
| `versionName` | 展示用版本名 |
| `apkUrl` | APK 下载直链（HTTPS，对象存储地址） |
| `releaseNotes` | 更新说明（`\n` 换行） |
| `minSupportedVersionCode` | 低于此版本**强制更新** |
| `forceUpdate` | 本次是否强制更新 |
| `apkSha256` | 可选，APK 完整性校验。**留空字符串表示不校验** |

## iOS：`ios-version.json` 字段

| 字段 | 含义 |
|---|---|
| `platform` | 固定 `"ios"`，便于辨识 |
| `versionName` | 展示用版本名 |
| `appStoreUrl` | App Store 链接（引导用户去商店更新） |
| `releaseNotes` | 更新说明 |
| `minSupportedVersionName` | 低于此版本提示强制更新（语义化版本比较） |
| `forceUpdate` | 本次是否强制更新 |

> iOS 字段为预留结构，最终以 iOS 客户端实现为准。iOS 走 App Store，通常不需要自托管 APK。

---

## 发版流程（Android）

1. 本地 build 已签名的 release APK，`versionCode` 每次发版 +1。
2. 上传 APK 到对象存储，拿到 HTTPS 直链。
3. 编辑 `android-version.json`：更新 `versionCode` / `versionName` / `apkUrl` / `releaseNotes`；需要强制更新就改 `forceUpdate` 或抬高 `minSupportedVersionCode`。
4. （可选）把 APK 的 sha256 填进 `apkSha256`，客户端下载后校验。
5. 提交并部署 `toshiki.tech`。老用户下次启动 / 手动检查即提示更新。

> 以后若要灰度发布 / 多渠道 / 统计，再升级成 API route（如 `/api/yomiplay/version?channel=cn`）从 DB 读，起步不需要。
