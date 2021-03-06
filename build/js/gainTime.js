function makeA(a) {
  a.addEventListener("click", function(e) {
    var d = a.href.split("/");
    var file = d[d.length - 1].split("#");
    var h = document.location.toString().split("/")
    var here = h[h.length - 1].split("#");
    f = file[1];

    if (f != undefined && (here[0] === file[0])) {
      e.preventDefault();
      var el = document.scrollingElement || document.documentElement;
      var to = document.getElementById(f).offsetTop - 60;
      smoothScroll(el, to, 600);
    }
  })
}

var smoothScroll = function(element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);

    if (duration < 0) return Promise.reject("bad duration");
    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve();
    }
    var start_time = Date.now();
    var end_time = start_time + duration;
    var start_top = element.scrollTop;
    var distance = target - start_top;

    // based on http://en.wikipedia.org/wiki/Smoothstep
    var smoothStep = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        var x = (point - start) / (end - start); // interpolation
        return x*x*(3 - 2*x);
    }

    return new Promise(function(resolve, reject) {
        var previous_top = element.scrollTop;
        var scrollFrame = function() {
            var now = Date.now();
            var point = smoothStep(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;
            if(now >= end_time) {
                resolve();
                return;
            }
            if(element.scrollTop === previous_top && element.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollTop;
            setTimeout(scrollFrame, 0);
        }
        setTimeout(scrollFrame, 0);
    });
}

function menuToggle(a) {
    var b = a.nextElementSibling;
    a.addEventListener("click", function(c) {
        c.stopPropagation(), !b.style.maxWidth ? b.style.maxWidth = "400px" : b.style.removeProperty("max-width")
    })
}

function closeMenus() {
    menuToggles.forEach(function(a) {
        a.nextElementSibling.style.removeProperty("max-width")
    })
}

function makeDropdown(a) {
    a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.addEventListener("click", function(b) {
        b.stopPropagation(), toogleDropdown(a)
    }), a.addEventListener("keypress", function(b) {
        13 === b.keyCode && (b.preventDefault(), toogleDropdown(a)), 27 === b.keyCode && closeDropdowns()
    })
}

function toogleDropdown(a) {
    var b = a.getElementsByTagName("ul")[0],
        c = !!b.style.display;
    closeDropdowns(), c ? b.style.removeProperty("display") : b.style.display = "inline-table"
}

function closeDropdowns() {
    dropdowns.forEach(function(a) {
        a.getElementsByTagName("ul")[0].style.removeProperty("display")
    })
}

function bar(a) {
    var b = document.createElement("div");
    b.setAttribute("class", "percentage " + a.dataset.color), b.setAttribute("style", "width: " + a.dataset.percentage);
    var c = document.createTextNode(a.dataset.text);
    if ("undefined" != c.data) {
        var d = document.createElement("span");
        d.appendChild(c), d.style.padding = "0 10px", b.appendChild(d), a.style.height = "20px"
    }
    a.appendChild(b)
}

function tooltip(a) {
    a.style.position = "relative";
    var b = document.createTextNode(a.dataset.tooltip),
        c = document.createElement("div");
    c.appendChild(b), c.setAttribute("class", "tooltip"), a.appendChild(c)
}

function close(a) {
    a.addEventListener("click", function(b) {
        b.stopPropagation(), remove(a.parentElement)
    })
}

function fadeOut(a) {
    function c() {
        a.style.opacity = "0", a.style.padding = "0", a.style.maxHeight = "0px", clearInterval(b)
    }
    var b = setInterval(c, 1)
}

function remove(a) {
    a.parentElement.removeChild(a)
}

function ask(a) {
    a.addEventListener("click", function(e) {
        if (!confirm(a.dataset.ask)) return e.preventDefault(), !1
    })
}

function formater(a) {
    a.addEventListener("keypress", function(b) {
        switch (a.dataset.validate) {
            case "cpf":
                formatCpf(a, b)
        }
    })
}

function formatCpf(a, b) {
    8 != b.keyCode && 46 != b.keyCode && (3 != a.value.length && 7 != a.value.length || (a.value = a.value + "."), 11 == a.value.length && (a.value = a.value + "-"))
}

function validates(a) {
    a.addEventListener("blur", function(b) {
        switchValidations(a)
    })
}

function switchValidations(a) {
    switch (a.dataset.validate) {
        case "text":
            searcher(a, /^[a-zA-ZÃẼĨÕŨãẽĩõũÁÉÍÓÚáéíóúÂÊÎÔÛâêîôûÀÈÌÒÙàèìòùÄËÏÖÜäëïöü' ]*$/);
            break;
        case "num":
            searcher(a, /^[\d]*$/g);
            break;
        case "email":
            searcher(a, /^(([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+(\.([A-Za-z]{2,4}))*)*$/);
            break;
        case "cpf":
            cpf(a) || "" == a.value ? a.style.removeProperty("border") : a.style.border = "1px solid #F00";
            break;
        default:
            searcher(a, new RegExp(a.dataset.validate))
    }
}

function searcher(a, b) {
    null == a.value.match(b) ? a.style.border = "1px solid #F00" : a.style.removeProperty("border")
}

function cpf(a) {
    var b = a.value.replace(/\./g, "");
    b = b.replace(/\-/g, "");
    var c, d;
    if (c = 0, "00000000000" == b) return !1;
    for (i = 1; i <= 9; i++) c += parseInt(b.substring(i - 1, i)) * (11 - i);
    if (d = 10 * c % 11, 10 != d && 11 != d || (d = 0), d != parseInt(b.substring(9, 10))) return !1;
    for (c = 0, i = 1; i <= 10; i++) c += parseInt(b.substring(i - 1, i)) * (12 - i);
    return d = 10 * c % 11, 10 != d && 11 != d || (d = 0), d == parseInt(b.substring(10, 11))
}
askers = [].slice.call(document.querySelectorAll("[data-ask]")),
as = [].slice.call(document.getElementsByTagName('a')),
closes = [].slice.call(document.getElementsByClassName("close")), deletes = [].slice.call(document.getElementsByClassName("deleter")), bars = [].slice.call(document.getElementsByClassName("bar")), toValidate = [].slice.call(document.querySelectorAll("[data-validate]")), dropdowns = [].slice.call(document.querySelectorAll(".dropdown, .dropdown-right, .dropdown-left, .dropup, .dropup-left, .dropup-right")), menuToggles = [].slice.call(document.getElementsByClassName("menu-toggle")), tooltips = [].slice.call(document.querySelectorAll("[data-tooltip]")), tooltips.forEach(function(a) {
    tooltip(a)
}), menuToggles.forEach(function(a) {
    menuToggle(a)
}), bars.forEach(function(a) {
    bar(a)
}), closes.forEach(function(a) {
    close(a)
}), deletes.forEach(function(a) {
    deleter(a)
}), dropdowns.forEach(function(a) {
    makeDropdown(a)
}), as.forEach(function(a) {
    makeA(a)
}), askers.forEach(function(a) {
    ask(a)
}), toValidate.forEach(function(a) {
    formater(a), validates(a), switchValidations(a)
}), document.addEventListener("click", function() {
    closeMenus(), closeDropdowns()
});
