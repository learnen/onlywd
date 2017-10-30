var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var db = require("./models/db.js");
var session = require("express-session");

var md5 = require("./models/md5.js");

var router = require("./controller");
var bodyParser = require('body-parser');
var formidable = require('formidable');
var sd = require('silly-datetime');
var fs = require("fs");
var path = require("path");

var users = [];


// var express = require('express');
// var ejs = require('ejs');
// var path = require('path');
// var app = express();

var ueditor = require("../");
// var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
// app.engine('.html', ejs.__express);
app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use(bodyParser.json());

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    //客户端上传文件设置
    var imgDir = '/img/ueditor/'

    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir; //默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }


}));



app.use(session({
    secret: 'sessiontest', //与cookieParser中的一致
    resave: true,
    saveUninitialized: true
}));



app.use("/static",express.static(path.join(__dirname, 'public')));
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));
app.use("/views",express.static(path.join(__dirname, 'views')));
app.use("/ueditor",express.static(path.join(__dirname, 'ueditor')));
app.use("/node_modules",express.static(path.join(__dirname, 'node_modules')));




app.set("view engine", "ejs");


app.get("/", function(req, res, next) {
    db.findsort('index', "", {
        "img": -1
    }, function(err, result) {
        var index = result;
        if (err) {
            next();
        };
        db.findsort('index', "", {
            "browse": 1
        }, function(err, result) {
            if (err) {
                next();
            };
            res.render("index", {
                "data": index,
                "browse": result,
            });
        })
    })
})
app.get("/myself", function(req, res, next) {
    res.render("myself");
})
app.get("/hobby", function(req, res, next) {
    db.findsort('hobby', "", {
        "img": -1
    }, function(err, result) {
        var index = result;
        if (err) {
            next();
        };
        db.findsort('hobby', "", {
            "browse": 1
        }, function(err, result) {
            if (err) {
                next();
            };
            res.render("hobby", {
                "data": index,
                "browse": result,
                "id": 1
            });
        })
    })
})
app.get("/hobby/:id", function(req, res, next) {
    var sort = req.params.id;
    if (sort == "diary" || sort == "enjoy" || sort == "life" || sort == "quotations") {
        db.findsort("hobby", {
            "classify": sort
        }, {
            "img": -1
        }, function(err, result) {
            if (err) {
                next();
            };
            var index = result;
            db.findsort("hobby", {
                "classify": sort
            }, {
                "browse": 1
            }, function(err, result) {
                if (err) {
                    next();
                };
                res.render("hobby-sort", {
                    "data": index,
                    "browse": result,
                    "sort": sort,
                    "id": 1
                });
            })
        })
    } else {
        db.findsort('hobby', "", {
            "img": -1
        }, function(err, result) {
            var index = result;
            if (err) {
                next();
            };
            db.findsort('hobby', "", {
                "browse": 1
            }, function(err, result) {
                if (err) {
                    next();
                };
                res.render("hobby", {
                    "data": index,
                    "browse": result,
                    "id": sort
                });
            })
        })
    }

})

app.get("/hobby/:sort/:id", function(req, res, next) {
    var id = req.params.id - 1;
    var sort = req.params.sort;
    db.findsort("hobby", {
        "classify": sort
    }, {
        "id": 1
    }, function(err, result) {
        if (err) {
            next();
        };
        if (!result[id]) {
            next();
        } else {
            var kaishi = result[id]._id;
            var browse = result[id].browse + 1;

            if (browse) {
                db.updateOne("hobby", {
                    "_id": kaishi
                }, {
                    $set: {
                        "browse": browse
                    }
                }, function(err, result) {
                    if (err) {
                        next();
                    };

                });
                db.updateOne("index", {
                    "_id": kaishi
                }, {
                    $set: {
                        "browse": browse
                    }
                }, function(err, result) {
                    if (err) {
                        next();
                    };
                })
            } else {
                db.updateOne("hobby", {
                    "_id": kaishi
                }, {
                    $set: {
                        "browse": 1
                    }
                }, function(err, result) {
                    if (err) {
                        next();
                    };
                });
                db.updateOne("index", {
                    "_id": kaishi
                }, {
                    $set: {
                        "browse": 1
                    }
                }, function(err, result) {
                    if (err) {
                        next();
                    };
                })
            }
            var index = result;
            db.findsort("hobby", {
                "classify": sort
            }, {
                "browse": 1
            }, function(err, result) {
                if (err) {
                    next();
                };
                res.render("hobby-read", {
                    "data": index[id],
                    "browse": result,
                    "length": index.length,
                    "id": id,
                });

            })
        }
    })
})



app.get("/note", function(req, res, next) {
    db.findsort('note', "", {
        "img": -1
    }, function(err, result) {
        if (err) {
            next();
        };
        var index = result;
        db.findsort('note', "", {
            "browse": 1
        }, function(err, result) {
            if (err) {
                next();
            };
            res.render("note", {
                "data": index,
                "browse": result,
                "id": 1
            });
        })
    })
})
app.get("/note/:id", function(req, res, next) {
    var sort = req.params.id;
    if (sort == "html" || sort == "css" || sort == "javascript" || sort == "node") {
        db.findsort("note", {
            "classify": sort
        }, {
            "img": -1
        }, function(err, result) {
            if (err) {
                next();
            };
            var index = result;
            db.findsort("note", {
                "classify": sort
            }, {
                "browse": 1
            }, function(err, result) {
                if (err) {
                    next();
                };
                res.render("note-sort", {
                    "data": index,
                    "browse": result,
                    "sort": sort,
                    "id": 1
                });
            })
        })
    } else {
        db.findsort('note', "", {
            "img": -1
        }, function(err, result) {
            if (err) {
                next();
            };
            var index = result;
            db.findsort('note', "", {
                "browse": 1
            }, function(err, result) {
                if (err) {
                    next();
                };
                res.render("note", {
                    "data": index,
                    "browse": result,
                    "id": sort
                });
            })
        })
    }

})

app.get("/note/:sort/:id", function(req, res, next) {
    var id = req.params.id - 1;
    var sort = req.params.sort;
    db.findsort("note", {
        "classify": sort
    }, {
        "id": 1
    }, function(err, result) {
        if (err) {
            next();
        };
        var kaishi = result[id]._id;
        var browse = result[id].browse + 1;
        if (browse) {
            db.updateOne("note", {
                "_id": kaishi
            }, {
                $set: {
                    "browse": browse
                }
            }, function(err, result) {
                if (err) {
                    next();
                };
            });
            db.updateOne("index", {
                "_id": kaishi
            }, {
                $set: {
                    "browse": browse
                }
            }, function(err, result) {
                if (err) {
                    next();
                };
            })
        } else {
            db.updateOne("note", {
                "_id": kaishi
            }, {
                $set: {
                    "browse": 1
                }
            }, function(err, result) {
                if (err) {
                    next();
                };
            });
            db.updateOne("index", {
                "_id": kaishi
            }, {
                $set: {
                    "browse": 1
                }
            }, function(err, result) {
                if (err) {
                    next();
                };
            })
        }
        var index = result;
        db.findsort("note", {
            "classify": sort
        }, {
            "browse": 1
        }, function(err, result) {
            if (err) {
                next();
            };
            res.render("note-read", {
                "data": index[id],
                "browse": result,
                "length": index.length,
                "id": id,
            });
        })
    })
})


app.get("/little", function(req, res, next) {
    db.findsort('little', "", {
        "img": -1
    }, function(err, result) {
        if (err) {
            next();
        };
        res.render("little", {
            "data": result,
        });
    })
})

app.get("/message", function(req, res, next) {
    res.render("message");
})

app.get("/admin", function(req, res, next) {
    if (req.session.number && req.session.name ) {
        res.render("admin");
     }else{
        res.render("wronglogin");
     } 
})
app.get("/login", function(req, res, next) {
    res.render("login");
})



app.get("/ueditor", function(req, res, next) {
    res.render("ueditor");
})



app.post("/login",function(req, res ,next){
     var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        var number = md5(fields.number+"aaa")
        var password = md5(fields.password+"aaa");
        console.log(number,password);
        if (number == "TbhV+pUACVLDrZMbXt5+hA==" && password == "gbundw6YZw1WIoWiGk4B8A==") {
            req.session.number = 1;
            req.session.name = 1;
            res.send("1");
        }else{
            res.send("2");
        }
      })
})


app.post("/admin/add", function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";

    form.parse(req, function(err, fields, files) {
        if (err) {
            next();
        };
        var classify = fields.classify;
        var date = sd.format(new Date(), 'YYYYMMDDHHmmss');
        var extname = path.extname(files.img.name);
        var oldpath = __dirname + "/" + files.img.path;
        var newpath = __dirname + "/uploads/" + date + extname;
        fields.content = fields.editorValue;
        delete fields.editorValue

        if (files.img.name) {
            fields.img = date + 　extname;
        };
        fs.rename(oldpath, newpath, function(err) {
            if (err) {
                res.send("改名失败");
                next();
            };
        })

        if (classify == "diary" || classify == "enjoy" || classify == "life" || classify == "quotations") {
            db.find("hobby", {
                "classify": classify
            }, function(err, result) {
                if (err) {
                    next();
                };
                fields.id = result.length + 1;
                db.insertOne("hobby", fields, function(err, result) {
                    if (err) {
                        next();
                    };
                    res.send("提交成功");
                })
            })
        }
        if (classify == "html" || classify == "css" || classify == "javascript" || classify == "node") {
            db.find("note", {
                "classify": classify
            }, function(err, result) {
                if (err) {
                    next();
                };
                fields.id = result.length + 1;
                db.insertOne("note", fields, function(err, result) {
                    if (err) {
                        next();
                    };
                    res.send("提交成功");
                })
            })
        }
        if (classify == "little") {
            db.find(classify, '', function(err, result) {
                if (err) {
                    next();
                };
                fields.id = result.length + 1;
                db.insertOne(classify, fields, function(err, result) {
                    if (err) {
                        next();
                    };
                    res.send("提交成功");
                })
            })
        }

        next();
    });

})

app.post("/admin/change", function(req, res, next) {
    var form = new formidable.IncomingForm();

    form.uploadDir = "./uploads";

    form.parse(req, function(err, fields, files) {
        if (err) {
            next();
        };
        var classify = fields.classify;
        var img = fields.sign;
        var date = sd.format(new Date(), 'YYYYMMDDHHmmss');
        var extname = path.extname(files.img.name);
        var oldpath = __dirname + "/" + files.img.path;
        var newpath = __dirname + "/uploads/" + date + extname;
        var changepath = __dirname + "/uploads/" + img;
        if (files.img.name) {
            fields.img = date + 　extname;
        };
        fs.rename(oldpath, newpath, function(err) {
            if (err) {
                res.send("改名失败");
            } else {
                if (fields.img == undefined) {
                    fields.img = fields.sign;
                    delete fields.sign;
                    if (classify == "diary" || classify == "enjoy" || classify == "life" || classify == "quotations") {
                        db.updateMany("hobby", {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                        })
                        db.updateMany("index", {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                            res.send("修改成功");
                        })
                    }
                    if (classify == "html" || classify == "css" || classify == "javascript" || classify == "node") {
                        db.updateMany("note", {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                        })
                        db.updateMany("index", {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                res.send("修改成功");
                                next();
                            };
                            res.send("修改成功");
                        })
                    }
                    if (classify == "little") {
                        db.updateMany(classify, {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                            res.send("修改成功");
                        })
                    }
                    fs.unlink(newpath, function(err) {
                        if (err) {
                             // res.send("删除文件失败");
                        };
                    })
                } else {
                    delete fields.sign;
                    if (classify == "diary" || classify == "enjoy" || classify == "life" || classify == "quotations") {
                        db.updateMany("hobby", {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                           
                        })
                        db.updateMany("index", {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                             res.send("修改成功");
                        })
                    }
                    if (classify == "html" || classify == "css" || classify == "javascript" || classify == "node") {
                        db.updateMany("note", {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                        })
                        db.updateMany("index", {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                            res.send("修改成功");
                        })
                    }
                    if (classify == "little") {
                        db.updateMany(classify, {
                            "img": img
                        }, {
                            $set: fields
                        }, function(err) {
                            if (err) {
                                next();
                            };
                        })
                        res.send("修改成功");
                    }
                    fs.unlink(changepath, function(err) {
                        if (err) {
                            

                        };
                    })
                }
            }
        })

    })
})

app.post('/admin/delete', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            next();
        };
        var sort = fields.classify;
        var img = fields.img;
        var deletepath = __dirname + "/uploads/" + img;
        if (sort == "diary" || sort == "enjoy" || sort == "life" || sort == "quotations") {
            db.find("hobby", {
                "img": img
            }, function(err, result) {
                if (err) {
                    next();
                };
                var id = result[0].id;
                db.find('hobby', {
                    "id": {
                        $gt: id
                    },
                    "classify": sort
                }, function(err, result) {
                    if (err) {
                        next();
                    };
                    if (result) {
                        for (var i = 0; i < result.length; i++) {
                            var a = result[i].id - 1
                            console.log(a);
                            db.updateMany('hobby', {
                                "img": result[i].img
                            }, {
                                $set: {
                                    "id": a
                                }
                            }, function(err, result) {
                                if (err) {
                                    next();
                                };
                            })
                        };
                    }
                })
            })
            db.find("index", {
                "img": img
            }, function(err, result) {
                if (err) {
                    next();
                };
                if (result.length) {
                     var id = result[0].id;
                db.find('index', {
                    "id": {
                        $gt: id
                    },
                    "classify": sort
                }, function(err, result) {
                    if (err) {
                        next();
                    };
                    if (result) {
                        for (var i = 0; i < result.length; i++) {
                            var a = result[i].id - 1
                            db.updateMany('index', {
                                "img": result[i].img
                            }, {
                                $set: {
                                    "id": a
                                }
                            }, function(err, result) {
                                if (err) {
                                    next();
                                };
                            })
                        };
                    }
                })
                };
               
            })
            db.deletemany("hobby", {
                "img": img
            }, function(err, result) {
                if (err) {
                    next();
                };
            })

            db.deletemany("index", {
                "img": img
            }, function(err, result) {
                if (err) {
                    res.send('删除失败');
                };

            })
        }

        if (sort == "html" || sort == "css" || sort == "javascript" || sort == "node") {
            db.find("note", {
                "img": img
            }, function(err, result) {
                if (err) {
                    next();
                };
                var id = result[0].id;
                db.find('note', {
                    "id": {
                        $gt: id
                    },
                    "classify":sort
                }, function(err, result) {
                    if (err) {
                        next();
                    };
                   
                        for (var i = 0; i < result.length; i++) {
                            var a = result[i].id - 1
                            db.updateMany('note', {
                                "img": result[i].img
                            }, {
                                $set: {
                                    "id": a
                                }
                            }, function(err, result) {
                                if (err) {
                                    next();
                                };
                            })
                        };
                    
                })
            })
            db.find("index", {
                "img": img
            }, function(err, result) {
                if (err) {
                    next();
                };
                if (result.length) {
                     var id = result[0].id;
                db.find('index', {
                    "id": {
                        $gt: id
                    },
                    "classify": sort
                }, function(err, result) {
                    if (err) {
                        next();
                    };
                    if (result) {
                        for (var i = 0; i < result.length; i++) {
                            var a = result[i].id - 1
                            db.updateMany('index', {
                                "img": result[i].img
                            }, {
                                $set: {
                                    "id": a
                                }
                            }, function(err, result) {
                                if (err) {
                                    next();
                                };
                            })
                        };
                    }
                }) 
                };
              
            })
            db.deletemany("note", {
                "img": img
            }, function(err, result) {
                if (err) {
                    next();
                };
            })
            db.deletemany("index", {
                "img": img
            }, function(err, result) {
                if (err) {
                    res.send('删除失败');
                };

            })
        }
        if (sort == "little" || sort == "index") {
            db.deletemany(sort, {
                "img": img
            }, function(err, result) {
                if (err) {
                    next();
                };
            })
        }
        fs.unlink(deletepath, function(err) {
            if (err) {
                res.send('删除失败');
            };
            res.send("删除成功");
        })
    })
})



app.post('/admin/index', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            next();
        };
        var sort = fields.classify;
        var img = fields.img;

        if (sort == "diary" || sort == "enjoy" || sort == "life" || sort == "quotations") {
            db.find("hobby", {
                "img": img
            }, function(err, result) {
                if (err) {
                    next();
                };
                db.insertOne("index", result[0], function(err, result) {
                    if (err) {
                        next();
                    };
                    res.send("推荐成功");
                })
            })
        }
        if (sort == "html" || sort == "css" || sort == "javascript" || sort == "node") {
            db.find("note", {
                "img": img
            }, function(err, result) {
                db.insertOne("index", result[0], function(err, result) {
                    if (err) {
                        next();
                    };
                    res.send("推荐成功");
                })
            })
        }

    })
})

app.post("/consult", function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            next();
        };
        var sort = fields.sort;
        if (sort == "diary" || sort == "enjoy" || sort == "life" || sort == "quotations") {
            db.find("hobby", {
                "classify": sort
            }, function(err, result) {
                if (err) {
                    next();
                };
                res.send(result);
            })
        }
        if (sort == "html" || sort == "css" || sort == "javascript" || sort == "node") {
            db.find("note", {
                "classify": sort
            }, function(err, result) {
                if (err) {
                    next();
                };
                res.send(result);
            })
        }
        if (sort == "little" || sort == "index") {
            db.find(sort, '', function(err, result) {
                if (err) {
                    next();
                };
                res.send(result);
            })
        }
    })
})

// app.post("/admin/add",function (req, res, next) {
//     res.send("404  not found");
// })
app.use("*", function(req, res, next) {
    res.send("404  not found");
})


http.listen(80);