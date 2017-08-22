
var http = require('http');
var cheerio = require('cheerio');
var fs = require("fs");
var async = require("async");
var url = 'http://www.rs05.com/movie/?p=2';
//解析HTML
function filechapter(html) {
    var $ = cheerio.load(html);
    var chapters = $('.intro');
    var learncourse = [];
    chapters.each(function (index, item) {
        var chapter = $(this);
        var name = chapter.find('h2 a').text();
        var href = chapter.find('h2 a').attr("href");
        var s = [];
        s[name] = href;
        learncourse.push(s);
    });
    //console.log(learncourse);
    return learncourse;
}


var html = "", result = [], str = "";

var urls = [];
for (var i = 1; i <= 30; i++) {
    if (i == 1) {
        url = "http://www.rs05.com/movie/";
    } else {
        url = "http://www.rs05.com/movie/?p=" + i;
    }
    urls.push(url)
}

//解析数据
function parse(url) {
    "use strict";
    http.get(url, function (res) {
        //console.log(url);
        res.on("data", function (data) {
            html += data;
        })
        res.on("end", function () {
            //解析HTML
            var learndata = filechapter(html);
            html = "";
            //console.log(learndata);
            result.push(learndata);
            if (result.length == 30) {
                var str = "";
                for (var i = 0; i < result.length; i++) {
                    if (!result[i].length == 0) {
                        for (var j = 0; j < result[i].length; j++) {
                            for (var item in result[i][j]) {
                                var key = item.match(/《[\u4E00-\u9FFF0-9:]+》/g);
                                if (key && result[i][j][item]) {
                                    console.log(result[i][j][item]);
                                    str += (key[0] + "  :  " + result[i][j][item] + "\r\n");
                                }
                            }
                        }
                    }
                }
                //console.log(str);
                fs.writeFile("人生05_1.txt", str, "utf-8", function (err) {
                    console.log(err);
                })
            }
        });
        res.on("err", function () {
            console.log("出错了");
        })
    })
}


async.mapSeries(urls, function (url, callback) {
    callback(null, parse(url));
}, function (err, results) {
})




