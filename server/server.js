'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// タイムゾーンを設定する
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const app = express();

// CORSを許可する
app.use(cors());

// POSTパラメータをJSONで取得できるようにする
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// public以下に配置したファイルは直リンクで見れるようにする
app.use(express.static(path.resolve(__dirname, 'public')));

// サーバーの動作確認
app.get('/time', (req, res) => {
  res.send(moment().format('YYYY/MM/DD HH:mm:ss'));
});

// メッセージを全て格納する配列chats
const chatLog = [];

// ログに入れる最大メッセージ数
const maxMessage = 500;

// サーバーを起動する
const server = app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`START SERVER http://${host}:${port}`);
});

// socketサーバーを立ち上げる
const io = require('socket.io')(server, {
  origins: '*:*'
});

// socketイベントの設定
io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  // chatsを送信する
  socket.on('getChatLog', function() {
    socket.emit('setChatLog', chatLog);
  });

  // 切断時
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
  });

  // ユーザの参加
  socket.on('send', (message) => {
    // 受け取ったメッセージをchatLogにpush
    console.log('send:', message);
    chatLog.push(message);
    // chatLogの長さが500件を超えた際に半分削る
    if (chatLog.length > maxMessage) {
      chatLog.splice(chatLog.length / 2, chatLog.length / 2);
      console.log('消してます');
    }
    io.emit('send', message);
  });
});