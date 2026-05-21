/**
 * ナカシマ工房 お問い合わせフォーム受信スクリプト
 *
 * 役割:
 *  1) ウェブサイトのフォームから送られたデータを受け取る
 *  2) 工房の管理者宛に通知メールを送信
 *  3) お問い合わせをした方へ自動返信メールを送信
 *
 * デプロイ手順:
 *  1) script.google.com で新規プロジェクトを作成
 *  2) このコードを貼り付けて保存
 *  3) [デプロイ] → [新しいデプロイ] → 種類「ウェブアプリ」
 *     - 説明: 任意（例「お問い合わせフォーム v1」）
 *     - 次のユーザーとして実行: 自分
 *     - アクセスできるユーザー: 全員
 *  4) 発行されたウェブアプリ URL を js/main.js の GAS_URL に貼り付け
 *  5) コード変更後は [デプロイの管理] → 鉛筆アイコン → 新バージョンを作成
 */

const ADMIN_EMAIL = 'jinjin1212riki@gmail.com';
const SITE_NAME = 'ナカシマ工房';

const INQUIRY_TYPE_LABELS = {
  order: '家具制作のご相談',
  estimate: 'お見積もり依頼',
  other: 'その他',
  '': '指定なし'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const typeKey = sanitize(data.type);
    const typeLabel = INQUIRY_TYPE_LABELS[typeKey] || typeKey || '指定なし';
    const message = sanitize(data.message);
    const receivedAt = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');

    sendAdminNotification({ name, email, typeLabel, message, receivedAt });
    sendAutoReply({ name, email, typeLabel, message, receivedAt });

    return jsonResponse({ status: 'success' });
  } catch (err) {
    console.error(err);
    return jsonResponse({ status: 'error', message: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('OK');
}

function sendAdminNotification({ name, email, typeLabel, message, receivedAt }) {
  const subject = `【${SITE_NAME}】お問い合わせを受信しました（${typeLabel}）`;
  const body = [
    'ウェブサイトのお問い合わせフォームから新着メッセージがあります。',
    '',
    '──────────────────',
    `お名前         : ${name}`,
    `メールアドレス  : ${email}`,
    `お問い合わせ種別: ${typeLabel}`,
    `受信日時       : ${receivedAt}`,
    '──────────────────',
    '',
    '【ご相談内容】',
    message,
    '',
    '──────────────────',
    'このメールに返信すると、お客様へ直接返信できます。'
  ].join('\n');

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: subject,
    body: body,
    replyTo: email,
    name: `${SITE_NAME} お問い合わせフォーム`
  });
}

function sendAutoReply({ name, email, typeLabel, message, receivedAt }) {
  if (!email) return;

  const subject = `【${SITE_NAME}】お問い合わせを受け付けました`;
  const body = [
    `${name} 様`,
    '',
    `この度は${SITE_NAME}へお問い合わせいただき、誠にありがとうございます。`,
    '以下の内容でお問い合わせを受け付けました。',
    '通常2〜3営業日以内に、改めて担当者よりご連絡いたします。',
    '',
    '──────────────────',
    `お名前         : ${name}`,
    `メールアドレス  : ${email}`,
    `お問い合わせ種別: ${typeLabel}`,
    `受信日時       : ${receivedAt}`,
    '──────────────────',
    '',
    '【ご相談内容】',
    message,
    '──────────────────',
    '',
    '※このメールは自動送信です。本メールへのご返信はできません。',
    '※2〜3営業日経っても返信がない場合は、お手数ですが再度ご連絡ください。',
    '',
    '────────────────────────────',
    SITE_NAME,
    `お問い合わせ窓口: ${ADMIN_EMAIL}`,
    '────────────────────────────'
  ].join('\n');

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: SITE_NAME
  });
}

function sanitize(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 動作確認用: スクリプトエディタから直接実行してメール送信をテストできます。
 * 初回実行時に権限承認が必要です（MailApp の利用許可）。
 */
function testSend() {
  doPost({
    postData: {
      contents: JSON.stringify({
        name: 'テスト 太郎',
        email: ADMIN_EMAIL,
        type: 'order',
        message: 'これはテスト送信です。\nダイニングテーブルの制作を検討しています。'
      })
    }
  });
}
