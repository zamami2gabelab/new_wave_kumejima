/**
 * security.gs
 * APIキー認証ロジック
 */

function validateRequest(e, payload) {
  const props = PropertiesService.getScriptProperties();
  const expectedApiKey = props.getProperty('API_SECRET_KEY');

  if (!expectedApiKey) {
    return {
      valid: false,
      error: 'API_SECRET_KEY が Script Properties に設定されていません'
    };
  }

  let apiKey = null;

  // JSON payload から取得
  if (payload && payload.apiKey) {
    apiKey = payload.apiKey;
  }

  // 念のためクエリパラメータも確認
  if (!apiKey && e.parameter && e.parameter.apiKey) {
    apiKey = e.parameter.apiKey;
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return {
      valid: false,
      error: 'APIキーが無効です'
    };
  }

  return { valid: true };
}
