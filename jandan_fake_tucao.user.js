// ==UserScript==
// @name         煎蛋外挂吐槽
// @namespace    http://qs5.org/?jandan_fake_tucao
// @version      0.1
// @description  不能吐槽怎么活？
// @author       ImDong
// @match        *://jandan.net/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var jandan_fake_tucao = window.jandan_fake_tucao || {
        livere_uid: 'MTAyMC80NTA0MS8yMTU1OQ==',
        load_livere: function (e, d) {
            let a = $('<div class="jandan-tucao-livere" id="lv-container" data-id="city" data-uid="' + this.livere_uid + '" data-tucao-id="' + d + '"><div class="tucao-loading">假吐槽加载中....biubiubiu....</div></div>');

            // 移除上一个评论框
            $('#lv-container').attr('id', 'jandan-tucao-' + $('#lv-container').data('tucao-id'));
            e.append(a);

            // 设置页面
            window.livereOptions = {
                refer: 'jandan.net/yellowcomment-' + d
            }

            // 避免重复加载 js
            if (typeof LivereTower !== 'undefined') {
                LivereTower.init();
                this.check_comment();
                return;
            }

            (function (d, s) {
                var j, e = d.getElementsByTagName(s)[0];

                if (typeof window.LivereTower === 'function') { return; }

                j = d.createElement(s);
                j.src = 'https://cdn-city.livere.com/js/embed.dist.js';
                j.async = true;

                e.parentNode.insertBefore(j, e);

                jandan_fake_tucao.check_comment();
            })(document, 'script');
        },
        check_comment: function () {
            this.interval_id = setInterval(() => {
                if ($('#lv-container iframe[id^="lv-comment"]').height() > 0) {
                    clearInterval(jandan_fake_tucao.interval_id);
                    $('.tucao-loading').remove();
                }
            }, 1000);
        }
    }

    // 给原生吐槽追加一个按钮
    $('.commentlist>li .tucao-btn').after('<a href="javascript:;" class="tucao-livere-btn"> 假吐槽 </a>');
    $('.commentlist>li .tucao-livere-btn').click(function (e) {
        let tucao_id = $(this).prev().data('id'),
            comment_dom = $(this).closest('li'),
            container = comment_dom.find("div.jandan-tucao-livere");

        if (container.length) {
            container.slideToggle("fast");
        } else {
            jandan_fake_tucao.load_livere(comment_dom, tucao_id);
        }
    });

    window.jandan_fake_tucao = jandan_fake_tucao;
})();
