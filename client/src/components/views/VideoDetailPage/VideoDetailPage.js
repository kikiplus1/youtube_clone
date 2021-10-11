import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber.js';
import Comments from './Sections/Comments';
import LikeDislikes from './Sections/LikeDislikes';
function VideoDetailPage(props) {


    const videoId = props.match.params.videoId  // 주소창에 있는 비디오 id가져오기
    const [Video, setVideo] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const variable = {
        videoId: videoId
    }

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideo(response.data.video)
                    
                } else {
                    alert('비디오 정보를 가져오길 실패하였습니다.')
                
                }console.log(Video.writer)
            })

        axios.post('/api/comment/getComments', variable)
            .then(response => {
                if (response.data.success) {
                    setCommentLists(response.data.comments )
                    console.log("댓글들",response.data.comments )
                } else {
                    alert('Failed to get video Info comment')
                }
            })

        


    }, [])

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }


    if (Video.writer) {
        // 비디오 작성자와 로그인한 유저의 아이디가 다르면 subscribeButton 이 나타나게끔 하는 작용.
        const subscribeButton = Video.writer._id !== localStorage.getItem('userId') && <Subscriber userTo={Video.writer._id} userFrom={localStorage.getItem('userId')}/>


        return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>

                        <List.Item
                            actions=
                            {[<LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')}  />, 
                              subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={Video.writer.image} />}
                                title={<a href="https://ant.design">{Video.title}</a>}
                                description={Video.description}
                            />
                            <div></div>
                        </List.Item>

                        <Comments CommentLists={CommentLists} postId={Video._id} refreshFunction={updateComment} />

                    </div>
                </Col>
                <Col lg={6} xs={24}>

                    <SideVideo />

                </Col>
            </Row>
        )

     } else {
            return (
             <div>Loading...</div>

         )
     }


 }

export default VideoDetailPage