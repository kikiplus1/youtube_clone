const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

const { auth } = require("../middleware/auth");

//=================================
//             Likes DisLikes
//=================================


//like 수 가져오기
router.post("/getLikes", (req, res) => {

    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    } else {
        variable = {commentId : req.body.commentId}
    }
    Like.find(variable)
        .exec((err, likes) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({
            success: true, likes
        })
    });
});

//dislike 가져오기
router.post("/getDislikes", (req, res) => {

    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    } else {
        variable = {commentId : req.body.commentId}
    }
    Dislike.find(variable)
        .exec((err, dislikes) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({
            success: true, dislikes
        })
    });
});


//좋아요 누르기
router.post('/upLike', (req, res) => {
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId:req.body.userId}
    } else {
        variable = {commentId : req.body.commentId, userId:req.body.userId}
    }

    // like collection에다가 클릭 정보를 넣기
    const like = new Like(variable)

    like.save((err, likeResult) => {
        if(err) return res.json({success:false, err})
        
        // 만약에 dislike이 이미 클릭되어있다면 dislike 수를  1 감소시키기
        Dislike.findOneAndDelete(variable)
            .exec((err, dislikeResult) =>{
            if(err) return res.status(400).json({success:false, err})
            return res.status(200).json({success: true});
        })
    })
})


//좋아요 취소
router.post('/unLike', (req, res) => {
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId:req.body.userId}
    } else {
        variable = {commentId : req.body.commentId, userId:req.body.userId}
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({success:false, err})
            return res.status(200).json({success: true});
            })
        
});


//싫어요 누르기
router.post('/upDisLike', (req, res) => {
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId:req.body.userId}
    } else {
        variable = {commentId : req.body.commentId, userId:req.body.userId}
    }

    // Dislike collection에다가 클릭 정보를 넣기
    const dislike = new Dislike(variable)

    dislike.save((err, likeResult) => {
        if(err) return res.json({success:false, err})
        
        // 만약에 like이 이미 클릭되어있다면 like 수를  1 감소시키기
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => { 
            if(err) return res.status(400).json({success:false, err})
            return res.status(200).json({success: true});
        })
    })
});


//싫아요 취소
router.post('/unDisLike', (req, res) => {
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId:req.body.userId}
    } else {
        variable = {commentId : req.body.commentId, userId:req.body.userId}
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({success:false, err})
            return res.status(200).json({success: true});
            })
});




module.exports = router;