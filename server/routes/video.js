const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const { Subscriber } = require("../models/Subscribe");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
//=================================
//             video
//=================================

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') //파일올리면 upload파일에 저장
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {  //동영상 파일만 되도록
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")


router.post("/uploadfiles", (req, res) => {
    //비디오를 서버에 저장한다.
    upload(req, res, err =>{
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true, url:res.req.file.path, fileName: res.req.file.filename
        });

    })
});

router.post("/thumbnail", (req, res) => {
    //썸네일 생성하고 비디오 런닝타임도 가져오기


    //비디오 정보 가져오기
    let filePath ="";
    let fileDuration ="";

    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    //썸네일 생성
    ffmpeg(req.body.url)  // 파일저장경로 가져와서 
        .on('filenames', function (filenames) {  //파일 이름 생성
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames[0])

            filePath = "uploads/thumbnails/" + filenames[0];
        })

        .on('end', function () {  // 썸네일 생성 후에 어떻게 할 것인지
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration})
        })

        .on('error', function (err) {
            console.log(err);
            return res.json({ success: false, err})
        }) 

        .screenshots({
            count: 3,   // 3가지의 썸네일을 찍을 수 있음
            folder: 'uploads/thumbnails', //썸네일 저장소
            size:'320x240',
            filename:'thumbnail-%b.png'
        });

});

router.post("/uploadVideo", (req, res) => {
     // 비디오 정보를 저장한다.
     const video = new Video(req.body) //req.body하면 모든 vairiable정보를 가져옴.

     video.save((err,doc) => {
         if(err) return res.json({ success: false, err });
         res.status(200).json({success: true})
     });
 });

 router.get("/getVideos", (req, res) => {
     // 비디오 정보를 db에서 가져와 client에 보낸다.
     Video.find()
         .populate('writer') //populate를 해야 모든 writer정보를 가져올 수 있음(없으면 id값만 가져올 수 있다.)
         .exec((err, video) => {
             if(err) return res.status(400).send(err);
             res.status(200).json({success: true, video})
         });
   
});

router.post("/getVideoDetail", (req, res) => {
   
    Video.findOne({"_id" : req.body.videoId}) //post된 id가져오기
        .populate('writer') //populate를 해야 모든 writer정보를 가져올 수 있음(없으면 id값만 가져올 수 있다.)
        .exec((err,video) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true, video})
        })
   
});

router.post('/getSubscriptionVideos', (req, res) => {

    // 자신의 아이디를 갖고 구독하는 사람들을 찾는다.
    Subscriber.find({userFrom : req.body.userFrom})
        .exec((err, subscriberInfo) => {
            if(err) return res.status(400).send(err);
            
            let subscribedUser = [];

            subscriberInfo.map((subscriber, i ) => {
                subscribedUser.push(subscriber.userTo);
            });
        

        // 찾은 사람들의 비디오를 갖고 온다.
        Video.find({writer:{$in:subscribedUser}}) //찾은(구독한유튜버)사람들이 여러명이라 $in을 사용
            .populate('writer')
            .exec((err, videos)=> {
                if(err) return res.status(400).send(err);
                res.status(200).json({success: true, videos})
            })
    });
});


module.exports = router;