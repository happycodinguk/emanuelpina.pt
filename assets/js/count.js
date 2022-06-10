!(function () {
    "use strict";
    var t = function (t, e, n) {
            var a = t[e];
            return function () {
                for (var e = [], i = arguments.length; i--; ) e[i] = arguments[i];
                return n.apply(null, e), a.apply(t, e);
            };
        },
        e = function () {
            var t = window.doNotTrack,
                e = window.navigator,
                n = window.external,
                a = "msTrackingProtectionEnabled",
                i = t || e.doNotTrack || e.msDoNotTrack || (n && a in n && n[a]());
            return "1" == i || "yes" === i;
        };
    !(function (n) {
        var a = n.screen,
            i = a.width,
            r = a.height,
            o = n.navigator.language,
            c = n.location,
            u = c.hostname,
            s = c.pathname,
            l = c.search,
            d = n.localStorage,
            f = n.document,
            v = n.history,
            p = f.querySelector("script[data-website-id]");
        if (p) {
            var m,
                h,
                g = p.getAttribute.bind(p),
                y = g("data-website-id"),
                w = g("data-host-url"),
                b = "false" !== g("data-auto-track"),
                S = g("data-do-not-track"),
                k = "false" !== g("data-css-events"),
                E = g("data-domains") || "",
                T = E.split(",").map(function (t) {
                    return t.trim();
                }),
                N = /^umami--([a-z]+)--([\w]+[\w-]*)$/,
                O = "[class*='umami--']",
                q = function () {
                    return (d && d.getItem("umami.disabled")) || (S && e()) || (E && !T.includes(u));
                },
                A = w ? ((m = w) && m.length > 1 && m.endsWith("/") ? m.slice(0, -1) : m) : p.src.split("/").slice(0, -1).join("/"),
                j = i + "x" + r,
                L = {},
                _ = "" + s + l,
                x = f.referrer,
                H = function () {
                    return { website: y, hostname: u, screen: j, language: o, url: _ };
                },
                P = function (t, e) {
                    return (
                        Object.keys(e).forEach(function (n) {
                            t[n] = e[n];
                        }),
                        t
                    );
                },
                R = function (t, e) {
                    q() ||
                        (function (t, e, n) {
                            var a = new XMLHttpRequest();
                            a.open("POST", t, !0),
                                a.setRequestHeader("Content-Type", "application/json"),
                                h && a.setRequestHeader("x-umami-cache", h),
                                (a.onreadystatechange = function () {
                                    4 === a.readyState && n(a.response);
                                }),
                                a.send(JSON.stringify(e));
                        })(A + "/api/collect", { type: t, payload: e }, function (t) {
                            return (h = t);
                        });
                },
                J = function (t, e, n) {
                    void 0 === t && (t = _), void 0 === e && (e = x), void 0 === n && (n = y), R("pageview", P(H(), { website: n, url: t, referrer: e }));
                },
                M = function (t, e, n, a) {
                    void 0 === e && (e = "custom"), void 0 === n && (n = _), void 0 === a && (a = y), R("event", P(H(), { website: a, url: n, event_type: e, event_value: t }));
                },
                z = function (t) {
                    var e = t.querySelectorAll(O);
                    Array.prototype.forEach.call(e, C);
                },
                C = function (t) {
                    (t.getAttribute("class") || "").split(" ").forEach(function (e) {
                        if (N.test(e)) {
                            var n = e.split("--"),
                                a = n[1],
                                i = n[2],
                                r = L[e]
                                    ? L[e]
                                    : (L[e] = function () {
                                          "A" === t.tagName
                                              ? (function (t, e) {
                                                    var n = H();
                                                    (n.event_type = e), (n.event_value = t);
                                                    var a = JSON.stringify({ type: "event", payload: n });
                                                    fetch(A + "/api/collect", { method: "POST", body: a, keepalive: !0 });
                                                })(i, a)
                                              : M(i, a);
                                      });
                            t.addEventListener(a, r, !0);
                        }
                    });
                },
                D = function (t, e, n) {
                    if (n) {
                        x = _;
                        var a = n.toString();
                        (_ = "http" === a.substring(0, 4) ? "/" + a.split("/").splice(3).join("/") : a) !== x && J();
                    }
                };
            if (!n.umami) {
                var I = function (t) {
                    return M(t);
                };
                (I.trackView = J), (I.trackEvent = M), (n.umami = I);
            }
            if (b && !q()) {
                (v.pushState = t(v, "pushState", D)), (v.replaceState = t(v, "replaceState", D));
                var V = function () {
                    "complete" === f.readyState &&
                        (J(),
                        k &&
                            (z(f),
                            new MutationObserver(function (t) {
                                t.forEach(function (t) {
                                    var e = t.target;
                                    C(e), z(e);
                                });
                            }).observe(f, { childList: !0, subtree: !0 })));
                };
                f.addEventListener("readystatechange", V, !0), V();
            }
        }
    })(window);
})();
