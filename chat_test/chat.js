(function() {
    var w = window;
    if (w.ChannelIO) {
      return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
    }
    var ch = function() {
      ch.c(arguments);
    };
    ch.q = [];
    ch.c = function(args) {
      ch.q.push(args);
    };
    w.ChannelIO = ch;
    function l() {
      if (w.ChannelIOInitialized) {
        return;
      }
      w.ChannelIOInitialized = true;
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
      s.charset = 'UTF-8';
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }
    if (document.readyState === 'complete') {
      l();
    } else if (window.attachEvent) {
      window.attachEvent('onload', l);
    } else {
      window.addEventListener('DOMContentLoaded', l, false);
      window.addEventListener('load', l, false);
    }
  })();




document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chatForm').addEventListener('submit', function(event) {
        event.preventDefault(); // フォームのデフォルト送信を防ぐ

        // フォームのデータを取得
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        var memberId = email.split('@')[0];
        const firstMessage = document.getElementById('firstMessage').value;

        // Channel.ioのbootメソッドを呼び出し
        ChannelIO('boot', {
            pluginKey: 'mypluginKey', // 実際のプラグインキーに置き換えてください
            firstMessage: firstMessage,
            memberId: memberId,
            profile: {
                name: name,
                email: email,
                
            }
        }, function onBoot(error, user) {
            if (error) {
                console.error(error);
                return;
            }
            console.log('boot success', user);

            // bootが成功したら、userIdと相談内容をサーバーサイドに送信
            fetch('registerUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    memberId: memberId,

                }),
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    console.log('Chat session created and message sent successfully:', data);
                    ChannelIO('openChat', undefined, '');
                } else {
                    console.error('Error:', data.message || 'Failed to start chat session');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
});
