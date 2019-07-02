// ==UserScript==
// @name         煎蛋外挂吐槽
// @namespace    http://qs5.org/?jandan_fake_tucao
// @version      0.2
// @description  不能吐槽怎么活？
// @author       ImDong
// @match        *://jandan.net/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var jandan_fake_tucao = window.jandan_fake_tucao || {
        livere_uid: 'MTAyMC80NTA0MS8yMTU1OQ==',
        livere_ids: null,
        tucao_id: null,
        lazyload_num: 0,
        lazyload_n: 0,
        lazyload_dom: null,
        init: function () {
            this.livere_ids = atob(this.livere_uid).split('/');

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

            // 绑定懒加载
            this.lazyload_dom = $('.commentlist>li .tucao-livere-btn');
            this.lazyload_num = this.lazyload_dom.length;
            $(window).bind("scroll", function () {
                jandan_fake_tucao.lazyload();
            });
        },
        load_livere: function (e, d) {
            let a = $('<div class="jandan-tucao-livere" id="lv-container" data-id="city" data-uid="' + this.livere_uid + '" data-tucao-id="' + d + '"><div class="tucao-loading">假吐槽加载中....biubiubiu....</div></div>');

            this.tucao_id = d;

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
        },
        get_count: function (dom) {
            // 获取id
            let tucao_id = $(dom).prev().data('id');
            $.ajax({
                dataType: 'JSONP',
                url: 'https://api-zero.livere.com/v1/common/config',
                data: {
                    refer: 'jandan.net/yellowcomment-' + tucao_id,
                    title: '无聊图-蛋友贴图专版',
                    highlightSeq: '',
                    requestPath: '/v1/common/config',
                    preview: false,
                    consumerSeq: this.livere_ids['0'],
                    livereSeq: this.livere_ids['1'],
                    smartloginSeq: this.livere_ids['2']
                },
                success: function (data) {
                    dom.innerText = " 假吐槽[" + data.results.actions.totalCount + "] ";
                    dom.dataset.isLoad = data.results.actions.totalCount;
                }
            })
        },
        lazyload: function () { //监听页面滚动事件
            var seeHeight = document.documentElement.clientHeight; //可见区域高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
            for (var i = this.lazyload_n; i < this.lazyload_num; i++) {
                if (this.lazyload_dom[i].offsetTop >= scrollTop && this.lazyload_dom[i].offsetTop < seeHeight + scrollTop) {
                    console.log(this.lazyload_dom[i]);
                    if (typeof this.lazyload_dom[i].dataset.isLoad == "undefined") {
                        // 标记为已经加载
                        this.lazyload_dom[i].dataset.isLoad = 0;
                        this.get_count(this.lazyload_dom[i]);
                    }
                    this.lazyload_n = i + 1;
                }
            }
        }
    }

    window.jandan_fake_tucao = jandan_fake_tucao;

    jandan_fake_tucao.init();
})();
