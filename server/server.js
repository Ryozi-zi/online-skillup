'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// firebaseの初期設定
const firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyAMfp_hyzVnlkBaM_djrdfLWDr0mu043K8',
  authDomain: 'online-skillup-ryoji-d1e3f.firebaseapp.com',
  databaseURL: 'https://online-skillup-ryoji-d1e3f.firebaseio.com',
  projectId: 'online-skillup-ryoji-d1e3f',
  storageBucket: 'online-skillup-ryoji-d1e3f.appspot.com',
  messagingSenderId: '1006405441107'
};

firebase.initializeApp(config);
const database = firebase.database();

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

// メッセージとユーザーネームをオブジェクトとして格納する配列chatLog
const chatLog = [];
let rooms = [];

// ログに入れる最大メッセージ数
const maxMessage = 500;

// id系
let logId = 0;
let roomId = 0;

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

  socket.on('signUp', (userName, password) => {
    database.ref('/users/' + userName).on('value', function(snapshot) {
      if (snapshot.val()) {
        console.log(snapshot.val());
        socket.emit('signUpFailed');
      } else {
        database.ref('users/' + userName).set({
          username: userName,
          password: password
        });
        socket.emit('signUpSucceed');
      }
    });
  });

  socket.on('login', (userName, pass) => {
    database.ref('/users/' + userName).on('value', function(snapshot) {
      console.log(snapshot.val());
      if (snapshot.val()) {
        if (pass === snapshot.val().password) {
          socket.emit('loginSucceed', userName);
        } else {
          console.log('Password is wrong');
          socket.emit('loginFailed');
        }
      } else {
        console.log('Username is wrong');
        socket.emit('loginFailed');
      }
    });
  });

  // chatLogを送信する
  socket.on('getChatLog', function() {
    socket.emit('setChatLog', chatLog);
  });

  // Room作成
  socket.on('createRoom', (name, description) => {
    database.ref('/rooms/' + roomId).set({
      id: roomId,
      room_name: name,
      room_description: description
    });
    roomId++;
  });

  // All room 情報を獲得
  socket.on('getRoomList', function() {
    database.ref('/rooms').on('value', function(snapshot) {
      rooms = snapshot.val();
    });
    socket.emit('setRoomList', rooms);
  });

  // likeを更新する likedLogはlikeされたlogそのもの
  socket.on('like', (likedLog, userName) => {
    socket.broadcast.emit('onLikeSocket', likedLog);
    chatLog[likedLog.id].like = likedLog.like;
    console.log(userName + ' liked ' + likedLog.text);
  });

  // ユーザの参加
  socket.on('send', (message, userName, room) => {
    // 受け取ったメッセージ、ユーザーネームをオブジェクトにしてchatLogにpush
    console.log('send:', message, 'at', moment().format('YYYY/MM/DD HH:mm:ss'));
    const newLog = { username: userName, text: message, id: logId, postedTime: moment().format('YYYY/MM/DD HH:mm:ss'), like: 0, isLiked: false, roomID: room.id };

    chatLog.push(newLog);

    console.log(room.id);
    // chatLogの長さが500件を超えた際に半分削る
    if (chatLog.length > maxMessage) {
      chatLog.splice(chatLog.length / 2, chatLog.length / 2);
      console.log('消してます');
    }
    // メッセージ、ユーザーネームのオブジェクトを返す
    io.emit('send', newLog);
    logId++;
  });

  // 切断時
  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id);
  });
});
