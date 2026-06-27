# YomiPlay Android — API 文档

## 概述

本文档覆盖 Android App 与服务端的所有主要接口，包括：社区字幕资源浏览/下载、订阅结账、以及订阅管理（取消）。

Base URL（社区接口）：`https://www.toshiki.tech/api/yomiplay/v1`

所有接口支持跨域（`Access-Control-Allow-Origin: *`），无需特殊 CORS 配置。

---

## 认证说明

| 接口 | 是否需要 Token |
|------|----------------|
| 获取筛选元数据 | 不需要 |
| 获取列表 | 不需要 |
| 获取详情 | 不需要 |
| 下载文件 | **可选**（登录用户下载可获得积分奖励） |
| 创建结账会话 | **必须** |
| 打开订阅管理门户 | **必须** |

Token 格式：

```
Authorization: Bearer <supabase_access_token>
```

---

## 接口列表

### 0. GET /api/yomiplay/v1/filters — 获取筛选元数据

返回语言列表、分类列表、排序选项、来源平台列表。App 启动时调用一次并缓存，用于渲染筛选 UI，无需在客户端硬编码这些选项。

**请求**

```
GET https://www.toshiki.tech/api/yomiplay/v1/filters
```

无需 Token，无 Query 参数。

**响应示例**

```json
{
  "data": {
    "languages": [
      { "id": "ja", "label": "日本語" },
      { "id": "en", "label": "English" },
      { "id": "zh", "label": "中文" }
    ],
    "categories": [
      { "id": "podcast",       "labels": { "en": "Podcast",        "zh": "播客",    "zh-tw": "播客",    "ja": "ポッドキャスト" } },
      { "id": "news_video",    "labels": { "en": "News / Video",   "zh": "新闻·视频","zh-tw": "新聞·影片","ja": "ニュース・動画" } },
      { "id": "music",         "labels": { "en": "Music & Lyrics", "zh": "音乐歌词", "zh-tw": "音樂歌詞", "ja": "音楽・歌詞" } },
      { "id": "book_companion","labels": { "en": "Book Companion", "zh": "书籍配套", "zh-tw": "書籍配套", "ja": "書籍付属" } },
      { "id": "other",         "labels": { "en": "Other",          "zh": "其他",    "zh-tw": "其他",    "ja": "その他" } }
    ],
    "sort_options": [
      { "id": "newest",    "labels": { "en": "Newest",            "zh": "最新",     "zh-tw": "最新",     "ja": "新着順" } },
      { "id": "downloads", "labels": { "en": "Most downloaded",   "zh": "下载最多", "zh-tw": "下載最多", "ja": "ダウンロード順" } },
      { "id": "updated",   "labels": { "en": "Recently updated",  "zh": "最近更新", "zh-tw": "最近更新", "ja": "更新順" } }
    ],
    "source_platforms": [
      { "id": "apple_podcasts", "name": "Apple Podcasts", "domain": "podcasts.apple.com" },
      { "id": "youtube",        "name": "YouTube",        "domain": "youtube.com" },
      { "id": "spotify",        "name": "Spotify",        "domain": "open.spotify.com" },
      { "id": "nhk",            "name": "NHK",            "domain": "nhk.or.jp" },
      { "id": "ted",            "name": "TED",            "domain": "ted.com" },
      { "id": "bbc",            "name": "BBC",            "domain": "bbc.co.uk" },
      { "id": "audible",        "name": "Audible",        "domain": "audible.co.jp" },
      { "id": "other",          "name": "Other",          "domain": null }
    ]
  }
}
```

`languages[].id` 即 subtitles 接口 `?lang=` 参数的合法值；`categories[].id` 对应 `?category=`；`sort_options[].id` 对应 `?sort=`；`source_platforms[].id` 对应 `?platform=`。

---

### 1. GET /api/yomiplay/v1/subtitles — 获取字幕列表

**请求**

```
GET https://www.toshiki.tech/api/yomiplay/v1/subtitles
```

**Query 参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | int | `1` | 页码，从 1 开始 |
| `per_page` | int | `20` | 每页条数，最大 50 |
| `lang` | string | — | 语言筛选，如 `ja` |
| `category` | string | — | 分类筛选，如 `anime`、`podcast` |
| `platform` | string | — | 来源平台筛选，如 `spotify`、`youtube` |
| `q` | string | — | 标题关键词搜索（模糊匹配） |
| `sort` | string | `newest` | 排序方式：`newest`（最新）/ `downloads`（下载量） |

**请求示例**

```
GET /api/yomiplay/v1/subtitles?lang=ja&category=anime&page=1&per_page=20&sort=downloads
```

**响应**

```json
{
  "data": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "title": "进击的巨人 S1E01",
      "description": "第一话字幕，含完整对白",
      "language": "ja",
      "category": "anime",
      "source_platform": "netflix",
      "source_show": "進撃の巨人",
      "source_episode": "S01E01",
      "source_url": "https://www.youtube.com/watch?v=xxxxxx",
      "content_type": "subtitle",
      "has_media": false,
      "download_count": 128,
      "uploaded_by": "toshiki",
      "created_at": "2026-05-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 83,
    "total_pages": 5
  }
}
```

**字段说明**

| 字段 | 说明 |
|------|------|
| `id` | 资源 ID，用于获取详情和下载 |
| `language` | 字幕内容语言，取值见 `/v1/filters` 的 `languages` 列表（`ja` / `en` / `zh`） |
| `category` | 内容分类，取值见 `/v1/filters` 的 `categories` 列表 |
| `content_type` | 内容类型：`subtitle` / `transcript` 等 |
| `source_platform` | 来源平台 ID（如 `youtube`、`spotify`），取值见 `/v1/filters` 的 `source_platforms` 列表，可能为 `null`。结合 `source_platforms[].domain` 可判断平台类型，用于选择对应播放器或 Intent |
| `source_url` | 来源视频/音频直链（如 YouTube URL），可直接传入播放器实现一键导入，可能为 `null` |
| `has_media` | 是否附带音频/视频媒体文件 |
| `download_count` | 累计下载次数 |
| `uploaded_by` | 上传者昵称 |

---

### 2. GET /api/yomiplay/v1/subtitles/:id — 获取字幕详情

**请求**

```
GET https://www.toshiki.tech/api/yomiplay/v1/subtitles/{id}
```

**响应**

```json
{
  "data": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "title": "进击的巨人 S1E01",
    "description": "第一话字幕，含完整对白",
    "language": "ja",
    "category": "anime",
    "source_platform": "netflix",
    "source_show": "進撃の巨人",
    "source_episode": "S01E01",
    "source_url": "https://www.youtube.com/watch?v=xxxxxx",
    "content_type": "subtitle",
    "file_name": "aot_s1e01.yomi",
    "media_file_name": "aot_s1e01.mp3",
    "has_media": true,
    "download_count": 128,
    "uploaded_by": "toshiki",
    "created_at": "2026-05-01T10:00:00Z",
    "updated_at": "2026-05-02T08:00:00Z"
  }
}
```

相比列表接口，详情额外返回：

| 字段 | 说明 |
|------|------|
| `file_name` | 字幕文件名（`.yomi`） |
| `media_file_name` | 媒体文件名（`.mp3` / `.mp4` 等），`has_media` 为 `true` 时有效 |
| `source_platform` | 来源平台 ID，与列表接口一致，可能为 `null` |
| `source_url` | 来源视频/音频链接（如 YouTube URL），可用于播放器直接导入，可能为 `null` |
| `updated_at` | 最后更新时间 |

---

### 3. GET /api/yomiplay/v1/subtitles/:id/download — 获取下载链接

返回一个有时效的预签名 URL，App 直接用该 URL 下载文件。

**请求**

```
GET https://www.toshiki.tech/api/yomiplay/v1/subtitles/{id}/download
Authorization: Bearer <token>   （可选，登录后下载可获得积分）
```

**Query 参数**

| 参数 | 说明 |
|------|------|
| `type` | `subtitle`（默认，下载 `.yomi` 字幕文件）/ `media`（下载音频/视频文件） |

**请求示例**

```
# 下载字幕文件
GET /api/yomiplay/v1/subtitles/{id}/download

# 下载媒体文件（需 has_media == true）
GET /api/yomiplay/v1/subtitles/{id}/download?type=media
```

**响应**

```json
{
  "data": {
    "url": "https://r2.toshiki.tech/yomi/xxx.yomi?X-Amz-Signature=...",
    "file_name": "aot_s1e01.yomi",
    "expires_in": 600
  }
}
```

| 字段 | 说明 |
|------|------|
| `url` | 预签名下载链接，**10 分钟内有效** |
| `file_name` | 建议保存的文件名 |
| `expires_in` | 链接有效期（秒），固定为 `600` |

> **注意**：拿到 URL 后请立即下载，不要缓存该 URL。10 分钟后链接失效，需要重新调用接口。

---

## 订阅管理

### 4. POST /api/yomiplay/billing/portal — 打开订阅管理门户

为当前登录用户创建一个 Stripe Customer Portal 会话，返回一个有时效的 URL。App 用系统浏览器打开该 URL，用户可在 Stripe 托管的页面上自助取消订阅、查看账单、更新支付方式。

**请求**

```
POST https://www.toshiki.tech/api/yomiplay/billing/portal
Authorization: Bearer <supabase_access_token>
Content-Type: application/json

{}
```

Body 可为空 `{}`，或传入可选字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `return_url` | string | 用户操作完成后的跳转地址（必须为 `https://` 开头）。默认跳回 `/en/yomiplay/pricing` |

**响应**

```json
{
  "data": {
    "url": "https://billing.stripe.com/p/session/live_xxx..."
  }
}
```

| 字段 | 说明 |
|------|------|
| `url` | Stripe Customer Portal 入口链接，**约 5 分钟内有效**，不可缓存，每次点击需重新请求 |

**错误**

| 状态码 | 说明 | 处理建议 |
|--------|------|----------|
| `401` | 未认证 | 引导用户登录 |
| `404` | 该用户没有关联的 Stripe 账单账户（可能是积分兑换的 Pro） | 提示用户联系客服 |
| `500` | 服务器错误 | 稍后重试 |

**注意事项**

- 必须用**系统浏览器**（`Intent.ACTION_VIEW`）打开，不要用 WebView — Stripe Portal 依赖重定向和 Cookie，WebView 会出现问题
- 用户取消订阅后，Stripe 会异步触发 Webhook，服务端自动将 `is_pro` 改为 `false`，App 下次同步用户信息时状态会更新
- 该接口仅支持通过 Stripe 购买的订阅。iOS 用户通过 App Store 管理订阅，不应调用此接口

**Kotlin 示例**

```kotlin
data class BillingPortalResponse(val data: BillingPortalData)
data class BillingPortalData(val url: String)

suspend fun openBillingPortal(context: Context, accessToken: String) {
    val response = httpClient.post(
        "https://www.toshiki.tech/api/yomiplay/billing/portal"
    ) {
        header("Authorization", "Bearer $accessToken")
        contentType(ContentType.Application.Json)
        setBody("{}")
    }

    when (response.status.value) {
        200 -> {
            val url = response.body<BillingPortalResponse>().data.url
            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
        }
        404 -> showError("您的订阅不是通过信用卡购买，请联系客服")
        else -> showError("暂时无法打开订阅管理，请稍后重试")
    }
}
```

---

## Android 集成示例

### 加载字幕列表

```kotlin
suspend fun loadSubtitles(page: Int = 1, lang: String = "ja"): SubtitleListResponse {
  return httpClient.get("https://www.toshiki.tech/api/yomiplay/v1/subtitles") {
    parameter("page", page)
    parameter("per_page", 20)
    parameter("lang", lang)
    parameter("sort", "newest")
  }.body()
}
```

### 下载字幕文件

```kotlin
suspend fun downloadSubtitle(id: String, token: String?): String {
  // 1. 获取预签名 URL
  val response = httpClient.get(
    "https://www.toshiki.tech/api/yomiplay/v1/subtitles/$id/download"
  ) {
    token?.let { header("Authorization", "Bearer $it") }
  }.body<DownloadResponse>()

  // 2. 用预签名 URL 直接下载文件内容
  val fileBytes = httpClient.get(response.data.url).readBytes()

  // 3. 保存到本地
  val file = File(context.filesDir, response.data.file_name)
  file.writeBytes(fileBytes)
  return file.absolutePath
}
```

### 完整流程

```
用户打开社区页面
      ↓
GET /api/yomiplay/v1/subtitles?lang=ja&sort=newest
      ↓
展示列表（标题、分类、下载量）
      ↓
用户点击某条字幕
      ↓
GET /api/yomiplay/v1/subtitles/{id}   （展示详情）
      ↓
用户点击下载
      ↓
GET /api/yomiplay/v1/subtitles/{id}/download
      ↓
用预签名 URL 下载 .yomi 文件到本地
      ↓
在 YomiPlay App 内打开字幕
```

---

## 错误码

| HTTP 状态码 | 说明 | 处理建议 |
|-------------|------|----------|
| `401` | 未认证（需要 Token 的接口未携带或 Token 已过期） | 引导用户重新登录 |
| `404` | 资源不存在、未公开，或无 Stripe 账单账户 | 提示用户资源不可用或联系客服 |
| `503` | 社区下载功能暂时关闭（管理员维护中） | 提示用户稍后重试 |
| `500` | 服务器错误 | 提示用户稍后重试 |

---

## 积分说明

- 下载时携带有效 Bearer Token，系统会自动为上传者和下载者各自记录积分。
- 积分功能由管理员开关控制，关闭时下载正常进行但不计分。
- 未登录用户（不带 Token）也可以下载，但不产生积分。
