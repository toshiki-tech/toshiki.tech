# YomiPlay Android — Stripe 付款集成

## 概述

Android 版 YomiPlay 通过 toshiki.tech 提供的 REST API 完成 Pro 会员购买。流程如下：

1. App 调用 `/api/stripe/create-checkout` 获取 Stripe Checkout URL
2. 用外部浏览器打开付款页
3. 付款完成后 Stripe Webhook 自动更新数据库
4. App 通过 Deep Link 回调后查询 `/api/yomiplay/v1/me` 确认 Pro 状态

所有接口均使用 Supabase JWT 作为 Bearer Token 鉴权，与社区功能共用同一套账号体系。

---

## 认证

所有接口均需要在请求头带上登录用户的 access token：

```
Authorization: Bearer <supabase_access_token>
```

```kotlin
val token = supabase.auth.currentSessionOrNull()?.accessToken ?: return
```

Supabase JWT 默认 1 小时过期，建议开启自动刷新：

```kotlin
supabase.auth.startAutoRefreshToken()
```

接口返回 `401` 时说明 token 已过期，需要重新登录。

---

## 接口

### GET /api/yomiplay/v1/me — 查询 Pro 状态

App 启动、登录后调用，判断当前用户是否是 Pro。

**请求**

```
GET https://www.toshiki.tech/api/yomiplay/v1/me
Authorization: Bearer <token>
```

**响应**

```json
{
  "data": {
    "user_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "is_pro": true,
    "plan": "monthly",
    "status": "active",
    "current_period_end": "2026-07-24T00:00:00Z",
    "is_lifetime": false,
    "updated_at": "2026-06-24T10:00:00Z"
  }
}
```

**字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| `is_pro` | boolean | **是否 Pro，以此为准** |
| `plan` | string \| null | `monthly` / `yearly` / `lifetime` |
| `status` | string \| null | `active` / `past_due` / `canceled` 等 |
| `current_period_end` | string \| null | 订阅到期时间（ISO 8601），买断时为 null |
| `is_lifetime` | boolean | 是否买断永久版 |

---

### POST /api/stripe/create-checkout — 创建付款链接

用户选择套餐后调用，返回 Stripe Checkout URL。

**请求**

```
POST https://www.toshiki.tech/api/stripe/create-checkout
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "product": "yomiplay",
  "plan": "monthly",
  "success_url": "yomiplay://payment/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "yomiplay://payment/cancel"
}
```

**plan 可选值**

| plan | 价格 | 类型 |
|------|------|------|
| `monthly` | ¥180 / 月 | 连续订阅，随时取消 |
| `yearly` | ¥1,480 / 年 | 连续订阅，随时取消 |
| `lifetime` | ¥2,980 一次性 | 永久买断 |

**响应**

```json
{
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_live_xxx..."
  }
}
```

---

## Android 集成步骤

### 1. 注册 Deep Link

在 `AndroidManifest.xml` 中为回调 Activity 注册 `yomiplay://` scheme：

```xml
<activity android:name=".PaymentResultActivity"
          android:launchMode="singleTop">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="yomiplay" android:host="payment" />
  </intent-filter>
</activity>
```

### 2. 发起付款

```kotlin
suspend fun startCheckout(plan: String) {
  val token = supabase.auth.currentSessionOrNull()?.accessToken ?: return

  val response = httpClient.post("https://www.toshiki.tech/api/stripe/create-checkout") {
    header("Authorization", "Bearer $token")
    contentType(ContentType.Application.Json)
    setBody(mapOf(
      "product"     to "yomiplay",
      "plan"        to plan,
      "success_url" to "yomiplay://payment/success?session_id={CHECKOUT_SESSION_ID}",
      "cancel_url"  to "yomiplay://payment/cancel"
    ))
  }

  val url = response.body<CheckoutResponse>().data.url
  // 用外部浏览器或 Chrome Custom Tabs 打开
  openInBrowser(url)
}
```

### 3. 处理回调

```kotlin
class PaymentResultActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    handleIntent(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    handleIntent(intent)
  }

  private fun handleIntent(intent: Intent) {
    val uri = intent.data ?: return finish()

    when (uri.host) {
      "success" -> {
        // Stripe Webhook 写库约需 1~3 秒，延迟后再查询
        lifecycleScope.launch {
          delay(2000)
          refreshProStatus()
        }
      }
      "cancel" -> {
        // 用户取消付款，返回订阅页
        navigateToSubscriptionPage()
      }
    }
    finish()
  }
}
```

### 4. 刷新 Pro 状态

```kotlin
suspend fun refreshProStatus(): Boolean {
  val token = supabase.auth.currentSessionOrNull()?.accessToken ?: return false

  val response = httpClient.get("https://www.toshiki.tech/api/yomiplay/v1/me") {
    header("Authorization", "Bearer $token")
  }

  val isPro = response.body<MeResponse>().data.isPro
  // 本地缓存，用于控制功能开关
  ProStatusCache.set(isPro)
  return isPro
}
```

---

## 完整流程图

```
用户触发 Pro 功能
        ↓
GET /api/yomiplay/v1/me
        ↓
   is_pro == true ──→ 直接使用
        ↓
   is_pro == false
        ↓
  弹出订阅套餐弹窗
        ↓
  用户选择 plan
        ↓
POST /api/stripe/create-checkout
        ↓
  打开 Stripe 付款页（外部浏览器）
        ↓
  用户完成付款
        ↓
  yomiplay://payment/success 回调
        ↓
  等待 ~2 秒（Webhook 处理中）
        ↓
GET /api/yomiplay/v1/me → is_pro == true
        ↓
  解锁 Pro 功能
```

---

## 错误处理

| HTTP 状态码 | 原因 | 处理方式 |
|-------------|------|----------|
| `401` | Token 无效或过期 | 重新登录后重试 |
| `400` | 参数错误（plan/product 不合法） | 检查请求参数 |
| `500` | 服务器内部错误 | 提示用户稍后重试 |

---

## 注意事项

- `success_url` 中的 `{CHECKOUT_SESSION_ID}` 是 Stripe 的占位符，**保持原样传入**，Stripe 会在跳转时自动替换为真实 session ID。
- 付款成功后不要立即查询 Pro 状态，需等待约 2 秒（Stripe Webhook 异步处理）。若对实时性要求高，可轮询（每 2 秒一次，最多 5 次）。
- Pro 状态以服务端 `/api/yomiplay/v1/me` 返回的 `is_pro` 为准，本地缓存仅用于减少请求次数，不用于鉴权。
