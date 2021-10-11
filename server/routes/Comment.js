const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//            Comment
//=================================

//댓글 저장하기
router.post("/saveComment", (req, res) => {
    const comment = new Comment(req.body)

    comment.save((err, subscribe) => {
        if (err) return res.json({success: false})

        //save를 할때는 populate를 사용하여 정보를 가져올 수 없어서 아래와 같은 방법을 이용.
        Comment.find({'_id': comment._id})
            .populate('writer')
            .exec((err,result)=>{
                if (err) return res.json({success: false})
                return res.status(200).json({
                    success: true, result })
     })
    });
});

//댓글 가져오기
router.post('/getComments', (req, res) => {
    Comment.find({'postId': req.body.videoId})
    .populate('writer')
    .exec((err, comments)=>{
        if (err) return res.status(400).send(err)
        return res.status(200).json({
            success: true, comments })
    });
});


module.exports = router;
