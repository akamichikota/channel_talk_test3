<?php



$apiKey = 'myapikey'; // 実際のChannel TalkのAPIキーに置き換える

// PHPのinputストリームからJSONデータを受け取る
$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'];
$email = $data['email'];
$memberId = $data['memberId'];


// チャットセッションを作成するためのAPIエンドポイント
$userChatsUrl = "https://api.channel.io/open/v5/users/@{$memberId}/user-chats";

// cURLセッションの初期化（ユーザーチャットセッション作成用）
$ch = curl_init($userChatsUrl);

// ユーザー作成（または更新）用のデータ


curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'X-Access-Token: ' . $apiKey
));
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([])); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if (!$response) {
    die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
}

// レスポンスを確認
echo $response;

curl_close($ch);
