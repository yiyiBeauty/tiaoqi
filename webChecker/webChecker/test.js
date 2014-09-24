var DEFAULT_TITLE = "Come play this MojiMe game! Whack me if you can :)";
var SHARE_TITLE = "I whacked this MojiMe sticker _SCORE_ times, try it now!";
var SHARE_TITLE2 = SHARE_TITLE;
document.addEventListener("WeixinJSBridgeReady",
function() {
    $(document.body).addClass("wechat")
});
var dpi = window.devicePixelRatio || 1;
var touchable = "ontouchstart" in window;
var TAPEVENT = touchable ? "touchstart": "mousedown";
function adjSize(fromInit) {
    var ratio = fromInit === true ? dpi: 1;
    var fz = Math.min(Math.floor(10 * ratio * $(window).width() / 640), Math.floor(10 * ratio * $(window).height() / 640));
    $("#site").css({
        "font-size": Math.min(fz, 10)
    });
    return fz
}
var mojiSrc = document.getElementById("mymoji").getAttribute("content");
var isDEMO = window.location.hash == "#demo";
var q = window.location.search,
qparam = {};
if (q) {
    var d = q.substr(1).split("&");
    $.each(d,
    function(k, v) {
        var i = v.indexOf("=");
        if (i > 0) {
            qparam[v.substr(0, i)] = decodeURIComponent(v.substr(i + 1)).replace(/</g, "&#60;").replace(/>/g, "&#62;")
        } else {
            qparam[v] = true
        }
    })
}
var theme = "";
if (qparam["theme"] && /^[a-zA-Z0-9_\-]+$/.test(qparam["theme"])) {
    theme = "-" + qparam["theme"]
}
$("head:first").append("<style>#site{background-image:url(assets/bg" + theme + ".png) !important}.sprite{background-image:url(assets/game" + theme + ".png) !important}</style>");
if (qparam["u"] && /\.(jpg|jpeg|gif|png)$/i.test(qparam["u"])) {
    mojiSrc = qparam["u"]
}
function upshow(st) {
    if (st === false) {
        st = $("#mymask").data("keep");
        if (st) {
            upshow(st)
        } else {
            $("#mymask").hide()
        }
        return
    }
    if (st == "tips" && $("#mymask").css("display") != "none") {
        $("#mymask").data("keep", $("#mymask").attr("class"))
    } else {
        $("#mymask").data("keep", "")
    }
    $("#mymask").attr("class", st).show()
}
$(function() {
    $("#mystart, #myagain").on(TAPEVENT,
    function() {
        if (isDEMO) {
            var demo = "n1,n2,n3,n4,n5,n6,n7,t,".split(",");
            var u = demo[Math.round(Math.random() * demo.length)];
            if (u) u = "demo/" + u + ".gif";
            else u = document.getElementById("mymoji").getAttribute("content");
            if (u != mojiSrc) {
                mojiSrc = u;
                $("#me,.me").attr("src", mojiSrc)
            }
        }
        upshow("playing");
        $("#counting").removeClass("cd1").addClass("cd3");
        setTimeout(function() {
            $("#counting").removeClass("cd3").addClass("cd2");
            setTimeout(function() {
                $("#counting").removeClass("cd2").addClass("cd1");
                setTimeout(function() {
                    upshow(false);
                    play()
                },
                1e3)
            },
            1e3)
        },
        1e3)
    });
    $("#myshare").on(TAPEVENT,
    function() {
        upshow("tips")
    });
    $("#mymask").on(TAPEVENT,
    function(e) {
        if ($("#mymask").hasClass("tips")) {
            upshow(false)
        }
    })
});
var game = {
    DURATION: 3e4,
    INTERVAL: 660,
    MinINTERVAL: 80,
    LEVELUP: 20,
    AniDURATION: 400,
    MinDURATION: 160,
    STAYLESS: 8,
    SPEED: 320,
    MinSPEED: 180,
    SPEEDUP: 6,
    status: "",
    score: 0,
    clicked: 0
};
game.interval = game.INTERVAL;
game.speed = game.SPEED;
game.stay = game.AniDURATION;
var dTid, dCount = game.DURATION / 1e3;
function initTimer() {
    $("#mytimer").html(dCount);
    resetTimer()
}
function resetTimer(n) {
    if (n) dCount = n;
    if (dTid) clearInterval(dTid);
    dTid = setInterval(function() {
        if (dCount > 0) {
            dCount -= 1;
            $("#mytimer").html(dCount)
        }
        if (dCount <= 0) {
            game.status = "FIN";
            clearInterval(dTid);
            clearInterval(playing);
            if (hugCount == 0) {
                finish()
            }
        }
    },
    1e3)
}
function stopTimer() {
    dCount = game.DURATION / 1e3;
    $("#mytimer").html(dCount);
    if (dTid) clearInterval(dTid)
}
var ME_HEIGHT;
var sw = $("#mysheet").css("width");
var using320 = sw == "32px";
var usingEM = sw == "28px";
var usingVMIN = sw == "18px";
var USTYLE = {
    minfz: 0,
    vmin: true
};
if (document.defaultView && document.defaultView.getComputedStyle) {
    var style = document.defaultView.getComputedStyle($("#mysheet").get(0));
    if (style) {
        USTYLE.minfz = style.getPropertyValue("font-size");
        if (USTYLE.minfz == "3px") USTYLE.minfz = 0
    }
}
if ($("#mysheet").height() == 1) {
    USTYLE.vmin = false
}
var VMINFixed = false;
function fixVMIN(flag) {
    if (flag === false && !VMINFixed) return;
    var fixes = {
        "#myinfo": {
            "font-size": "3.6vmin"
        },
        ".text": {
            "font-size": "7.81vmin"
        },
        ".task div": {
            "font-size": "6.25vmin"
        },
        ".slogan": {
            "font-size": "3.75vmin"
        },
        "#tips-text": {
            "font-size": "4.69vmin"
        },
        ".sprite": {
            "background-size": "64.21vmin 140.78vmin"
        },
        ".areact": {
            "background-size": "78.13vmin 120.47vmin"
        }
    };
    if (flag === false) {
        for (var k in fixes) {
            $(k).removeAttr("style")
        }
        VMINFixed = false
    } else {
        for (var k in fixes) {
            $(k).css(fixes[k])
        }
        VMINFixed = true
    }
}
var adjBusying;
function moadj(fromInit) {
    if (adjBusying) return;
    adjBusying = true;
    setTimeout(function() {
        adjBusying = false
    },
    50);
    if (game.status == "") return;
    if (fromInit !== true) fromInit = false;
    sw = $("#mysheet").css("width");
    using320 = sw == "32px";
    usingEM = sw == "28px";
    usingVMIN = sw == "18px";
    if (usingEM) {
        var fz = adjSize(fromInit)
    } else if (usingVMIN && !fromInit) {
        fixVMIN(true);
        $("#site").hide();
        $("#site").get(0).offsetHeight;
        $("#site").show()
    } else {
        fixVMIN(false)
    }
    var xy = $("#main").offset();
    ME_HEIGHT = parseInt($("#me").css("height"));
    var i = 0,
    Xoff = -xy.left,
    Yoff = -xy.top - ($("#sample").height() - $(".cell:first").height()) - ($(".cell:first").find(".sprite:last").height() - $("#sample .sprite:last").height());
    $(".cell").each(function() {
        var offset = $(this).offset();
        $("#me" + i++).css({
            left: Math.round(Xoff + offset.left),
            top: Math.round(Yoff + offset.top)
        })
    })
}
function initMe() {
    game.status = "INIT";
    var cc = "",
    colors = ["pink", "yellow", "blue"];
    for (var i = 0; i < 9; i++) {
        cc += '<div id="me' + i + '" class="mole no-event" key="' + i + '"><img class="me" src="' + mojiSrc + '" /><div class="sprite star"></div><div class="sprite ' + colors[Math.floor(i / 3)] + '"></div></div>'
    }
    $("#site").append(cc);
    moadj(true);
    $(window).resize(moadj);
    if (touchable) {
        $(window).on("orientationchange", moadj)
    }
    $(".mole").hide().on(TAPEVENT, hug);
    $("#mystage").on(TAPEVENT,
    function() {
        if (game.status == "START") {
            game.clicked += 1
        }
    });
    $("#me").attr("src", mojiSrc)
}
var usitv;
$(function() {
    if (usingEM && USTYLE.minfz != 0 || USTYLE.vmin && using320 && $(window).width() < 320) {
        if (USTYLE.vmin && !usingVMIN || !USTYLE.vmin && !using320) {
            $(document.body).append('<link rel="stylesheet" href="assets/layout_' + (USTYLE.vmin ? "vmin": "320") + '_140903.css" />');
            usitv = setInterval(function() {
                if ($("#mysheet").css("width") != sw) {
                    moadj(true);
                    clearInterval(usitv)
                }
            },
            50)
        }
    }
    var imgme = $("#sample .me").get(0);
    if (imgme.src != mojiSrc) {
        imgme.src = mojiSrc
    }
    if (imgme && (imgme.complete === true || imgme.readyState == "complete")) {
        initMe();
        imgme = null
    }
    imgme && $("#sample .me").on("load",
    function() {
        initMe();
        $(this).unbind("load")
    }).on("error",
    function() {
        mojiSrc = "../img/demo.gif";
        SharePack.img_url = $("base").attr("href") + mojiSrc;
        imgme.src = mojiSrc;
        $(this).unbind("error")
    })
});
var playing;
var moleTid = {};
var hugFxs = {};
var hugReady = {};
var hugCount = 0;
var silenceRipple;
function whack(n, speed, duration) {
    if ($("#me" + n + ":visible").length) return;
    var id = "#me" + n;
    var key = n.toString();
    if (moleTid[key]) clearTimeout(moleTid[key]);
    hugCount += 1;
    var me = $(id + " .me");
    me.animate({
        translate3d: "0, " + ME_HEIGHT + "px, 0"
    },
    speed);
    $(id).addClass("no-event").show();
    setTimeout(function() {
        hugReady[key] = true;
        $(id).removeClass("no-event")
    },
    Math.round(speed / 5));
    me.animate({
        translate3d: "0, 0, 0"
    },
    speed, "ease-out",
    function() {
        moleTid[key] = setTimeout(function() {
            setTimeout(function() {
                hugReady[key] = false;
                $(id).addClass("no-event")
            },
            Math.round(speed * 4 / 5));
            me.animate({
                translate3d: "0, " + ME_HEIGHT + "px, 0"
            },
            speed, "ease-in",
            function() {
                if (!hugFxs[key]) {
                    $(id).hide();
                    hugCount -= 1;
                    if (hugCount == 0 && dCount == 0) {
                        finish()
                    }
                }
            });
            me = null
        },
        duration)
    })
}
function hugfx(key, distance, repeat, duration, easing) {
    if (!key || hugFxs[key]) return;
    hugFxs[key] = true;
    hugReady[key] = false;
    if (!distance) distance = 10;
    if (!repeat) repeat = 5;
    if (!duration) duration = 100;
    if (!easing) easing = "ease-out";
    var id = "#me" + key;
    $(id).addClass("no-event");
    if (moleTid[key]) clearTimeout(moleTid[key]);
    $(id + " .star").show();
    var fin = function() {
        silenceRipple = true;
        $(id + " .star").hide();
        if (game.status != "FIN") {
            if (game.interval > game.MinINTERVAL) {
                game.interval -= game.LEVELUP
            }
        }
        $(id + " .me").animate({
            translate3d: "0, " + ME_HEIGHT + "px, 0"
        },
        game.speed - 50,
        function() {
            $(id).hide();
            hugCount -= 1;
            delete hugFxs[key];
            if (dCount > 0) {
                hugAgain()
            } else {
                if (hugCount == 0) finish()
            }
        });
        po = null;
        ng = null;
        fin = null
    };
    var po = function() {
        $(id + " .me").animate({
            translateY: distance + "px"
        },
        duration, easing,
        function() {
            if (repeat-->0) {
                ng()
            } else {
                fin()
            }
        })
    };
    var ng = function() {
        $(id + " .me").animate({
            translateY: -distance + "px"
        },
        duration, easing,
        function() {
            if (repeat-->0) {
                po()
            } else {
                fin()
            }
        })
    };
    ng()
}
function hug(e) {
    var hugKey = $(this).attr("key");
    if (dCount == 0 || hugFxs[hugKey] || !hugReady[hugKey]) {
        game.clicked += 1;
        return
    }
    $(this).addClass("no-event");
    if (moleTid[hugKey]) clearTimeout(moleTid[hugKey]);
    if (game.stay > game.MinDURATION) {
        game.stay -= game.STAYLESS
    }
    if (game.speed > game.MinSPEED) {
        game.speed -= game.SPEEDUP
    }
    var b = (new Date).getTime();
    $("#myscore").html(++game.score);
    hugfx(hugKey)
}
function hugAgain() {
    upshow(false);
    if (playing) clearInterval(playing);
    playing = setInterval(function() {
        if ($(".mole:visible").length < 9) {
            var n = Math.round(Math.random() * 10) % 9;
            while ($("#me" + n + ":visible").length > 0) {
                n = Math.round(Math.random() * 10) % 9
            }
            whack(n, game.speed, game.stay)
        }
    },
    game.interval);
    setTimeout(function() {
        a = (new Date).getTime();
        silenceRipple = false
    },
    0)
}
function erf(z) {
    var t = 1 / (1 + .5 * Math.abs(z));
    var ans = 1 - t * Math.exp( - 1 * z * z - 1.26551223 + t * (1.00002368 + t * (.37409196 + t * (.09678418 + t * ( - .18628806 + t * (.27886807 + t * ( - 1.13520398 + t * (1.48851587 + t * ( - .82215223 + t * .17087277)))))))));
    return z >= 0 ? ans: -ans
}
function normsidt(z, mu, sigma) {
    return 50 * (1 + erf((z - mu) / sigma / Math.sqrt(2)))
}
var pc50 = 20;
function pc(n) {
    return n > 0 ? normsidt((n - pc50) * 1 / pc50, 0, .8).toFixed(1) : 0..toFixed(1)
}
var shareTitle = SHARE_TITLE;
var reshared = window.location.hash == "#share";
if (reshared) {
    shareTitle = SHARE_TITLE2
} else {
    window.location.hash = "#share"
}
function finish() {
    if (dCount > 0) return;
    if (playing) clearInterval(playing);
    silenceRipple = true;
    var score = pc(game.score);
    if (game.score == 0) {
        SharePack.title = DEFAULT_TITLE
    } else {
        SharePack.title = shareTitle.replace("_SCORE_", game.score).replace("_PC_", score)
    }
    $("#fin-num").html(game.score);
    $("#fin-beat").html(score + "%");
    upshow("fin");
    stopTimer()
}
function play() {
    game.clicked = 0;
    game.score = 0;
    $("#myscore").html(0);
    game.status = "START";
    game.interval = game.INTERVAL;
    game.speed = game.SPEED;
    game.stay = game.AniDURATION;
    initTimer();
    hugAgain()
}
var SharePack = {
    appid: "",
    img_url: mojiSrc.indexOf("://") < 0 ? $("base").attr("href") + mojiSrc: mojiSrc,
    img_width: "120",
    img_height: "120",
    link: window.location.href,
    desc: $("#mydesc").attr("content"),
    title: DEFAULT_TITLE
};
if (SharePack.img_url.indexOf("://") < 0) {
    SharePack.img_url = window.location.href.replace(/[^\/]*[\?#].*$/, "") + SharePack.img_url
}
function shareCb(res) {}
function onBridgeReady() {
    WeixinJSBridge.on("menu:share:appmessage",
    function(argv) {
        WeixinJSBridge.invoke("sendAppMessage", SharePack, shareCb)
    });
    WeixinJSBridge.on("menu:share:timeline",
    function(argv) {
        WeixinJSBridge.invoke("shareTimeline", SharePack, shareCb)
    });
    WeixinJSBridge.on("menu:share:weibo",
    function(argv) {
        WeixinJSBridge.invoke("shareWeibo", {
            content: SharePack.title,
            url: SharePack.link
        },
        shareCb)
    });
    WeixinJSBridge.on("menu:share:facebook",
    function(argv) {
        WeixinJSBridge.invoke("shareFB", SharePack, shareCb)
    })
}
if (document.addEventListener) {
    document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false)
} else if (document.attachEvent) {
    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
    document.attachEvent("onWeixinJSBridgeReady", onBridgeReady)
}