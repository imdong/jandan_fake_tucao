// ==UserScript==
// @name         煎蛋外挂吐槽(假吐槽)
// @namespace    http://qs5.org/?jandan_fake_tucao
// @version      1.0
// @description  不能吐槽怎么活？不如假装有吐槽？
// @author       ImDong
// @match        *://jandan.net/*
// @grant        none
// ==/UserScript==

(function ($) {
    'use strict';

    var jandan_fake_tucao = window.jandan_fake_tucao || {
        livere_uid: 'MTAyMC80NTA0MS8yMTU1OQ==',
        livere_ids: null,
        tucao_id: null,
        lazyload_dom: null,
        lv_comment_id: null,
        init: function () {
            this.livere_ids = atob(this.livere_uid).split('/');

            // 吐槽详情页 (直接显示)
            if (location.pathname.substr(0, 3) == '/t/') {
                this.load_livere($('#tucao-list'), location.pathname.substr(3));
                // 加一个隐藏/显示原生吐槽的按钮
                $('#tucao-list .jandan-tucao').before('<a href="javascript:;" class="tucao-btn" id="jandan-tucao-show"> 吐槽去哪了?(显示 or 隐藏 原生真吐槽) </a>');
                $('#jandan-tucao-show').click(function () {
                    if ($('#tucao-list .jandan-tucao').is(":hidden")) {
                        $('#tucao-list .jandan-tucao').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                    } else {
                        $('#tucao-list .jandan-tucao').animate({ height: 'toggle', opacity: 'toggle' });
                    }
                });

                // 如果原生吐槽没有数据就折叠他
                if ($('#tucao-list .tucao-list').height() <= 0) {
                    $('#tucao-list .jandan-tucao').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                }
                return;
            }

            // 给原生吐槽后面追加一个按钮
            $('.commentlist>li .tucao-btn').after('<a href="javascript:;" class="tucao-livere-btn"> 假吐槽 </a>');
            $('.commentlist>li .tucao-livere-btn').click(function (e) {
                let tucao_id = $(this).prev().data('id'),
                    comment_dom = $(this).closest('li'),
                    container = comment_dom.find("div.jandan-tucao-livere");

                // 显示 or 隐藏 是个问题
                if (container.length) {
                    container.slideToggle("fast");
                } else {
                    jandan_fake_tucao.load_livere(comment_dom, tucao_id);
                }
            });

            // 绑定懒加载
            this.lazyload_dom = $('.commentlist>li .tucao-livere-btn');
            $(window).bind("scroll", function () {
                jandan_fake_tucao.lazyload();
            });
            this.lazyload();
        },
        load_livere: function (e, d) {
            let a = $('<div class="jandan-tucao-livere" id="lv-container" data-id="city" data-uid="' + this.livere_uid + '" data-tucao-id="' + d + '"><div class="tucao-loading">假吐槽加载中....biubiubiu....</div></div>');

            this.tucao_id = d;

            // 上一个评论框要改名
            $('#lv-container').attr('id', 'jandan-tucao-' + $('#lv-container').data('tucao-id'));
            e.append(a);

            // 伪造吐槽页面
            window.livereOptions = {
                refer: 'jandan.net/yellowcomment-' + d,
                site: location.origin + '/t/' + d,
                title: '煎蛋网 - ' + $('#content h1.title').text().split(' ')[0] + ' No.' + d
            }

            // 设置标题要另类
            let mate_title = document.querySelector('meta[property="og:title"]');
            if (!mate_title) {
                mate_title = $('<meta property="og:title" content="test" />');
                $('head').append(mate_title);
            }
            $(mate_title).attr('content', livereOptions.title);

            // 避免重复加载 js
            if (typeof LivereTower !== 'undefined') {
                LivereTower.init();
                this.check_comment();
                return;
            }

            // 首次肯定要加载了...
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
        // 检查评论框是否加载出来
        check_comment: function () {
            this.interval_id = setInterval(() => {
                let lv_comment = LivereTower.get('lv_comment');
                if (lv_comment && lv_comment.id != this.lv_comment_id) {
                    if ($(lv_comment).height() != 500) {
                        this.lv_comment_id = lv_comment.id;
                        clearInterval(jandan_fake_tucao.interval_id);

                        if ($(lv_comment).height() < 100) {
                            $('.tucao-loading').text("似乎没加载出来？...关掉去广告插件试下？");
                            return;
                        }

                        $('.tucao-loading').hide();
                    }
                }
            }, 500);
        },
        // 获取吐槽数
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
                    let totalCount = 0;
                    if (data.results.actions && data.results.actions.totalCount) {
                        totalCount = data.results.actions.totalCount;
                    }
                    dom.innerText = " 假吐槽[" + totalCount + "] ";
                    dom.dataset.isLoad = totalCount;
                }
            })
        },
        // 懒加载
        lazyload: function () { //监听页面滚动事件
            var seeHeight = document.documentElement.clientHeight; //可见区域高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
            for (var i = 0; i < this.lazyload_dom.length; i++) {
                if (this.lazyload_dom[i].offsetTop >= scrollTop && this.lazyload_dom[i].offsetTop < seeHeight + scrollTop) {
                    if (typeof this.lazyload_dom[i].dataset.isLoad == "undefined") {
                        // 标记为已经加载
                        this.lazyload_dom[i].dataset.isLoad = 0;
                        this.get_count(this.lazyload_dom[i]);
                        // 既然已经加载了 那就移除吧
                        this.lazyload_dom.splice(i, 1);
                    }
                }
            }
        }
    }

    window.jandan_fake_tucao = jandan_fake_tucao;

    // Biu biu biu!
    jandan_fake_tucao.init();
})(window.jQuery);
