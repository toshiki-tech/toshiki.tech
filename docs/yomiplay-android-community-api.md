# YomiPlay Android — 社区字幕资源 API

## 概述

社区字幕资源接口允许 Android App 浏览、搜索并下载用户上传的字幕文件（`.yomi`）及对应的音频/视频媒体文件。

Base URL：`https://www.toshiki.tech/api/yomiplay/v1`

所有接口支持跨域（`Access-Control-Allow-Origin: *`），无需特殊 CORS 配置。

---

## 认证说明

| 接口 | 是否需要 Token |
|------|----------------|
| 获取列表 | 不需要 |
| 获取详情 | 不需要 |
| 下载文件 | **可选**（登录用户下载可获得积分奖励） |

Token 格式：

```
Authorization: Bearer <supabase_access_token>
```

---

## 接口列表

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
| `language` | 字幕语言（通常为 `ja`） |
| `category` | 内容分类：`anime` / `podcast` / `drama` / `movie` 等 |
| `content_type` | 内容类型：`subtitle` / `transcript` 等 |
| `source_url` | 来源视频/音频链接（如 YouTube URL），可直接传入播放器实现一键导入，可能为 `null` |
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
| `404` | 资源不存在或未公开 | 提示用户资源不可用 |
| `503` | 社区下载功能暂时关闭（管理员维护中） | 提示用户稍后重试 |
| `500` | 服务器错误 | 提示用户稍后重试 |

---

## 积分说明

- 下载时携带有效 Bearer Token，系统会自动为上传者和下载者各自记录积分。
- 积分功能由管理员开关控制，关闭时下载正常进行但不计分。
- 未登录用户（不带 Token）也可以下载，但不产生积分。
