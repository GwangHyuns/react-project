import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize'
import { app } from '../../firebase'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import moment from 'moment/moment';
import ReplyListPage from './ReplyListPage';

const ReplyPage = ({id}) => {
    const db = getFirestore(app);
    const email = sessionStorage.getItem('email');    
    const [contents, setContents] = useState('');
    const navi = useNavigate();

    const onWrite = async () => {
        const reply = {
            pid:id,
            email,
            contents,
            date:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
        await addDoc(collection(db, 'reply'), reply);
        setContents('');
    }

    return (
        <div>
            {email ?
                <Row className='justify-content-center'>
                    <Col md={10}>                        
                        <TextareaAutosize onChange={(e)=>setContents(e.target.value)} value={contents} placeholder='내용을 입력하세요.' className='textarea mt-5' />                        
                        <div className='text-end'>
                            <Button onClick={onWrite} className='px-5' disabled={contents===''}>등록</Button>
                        </div>
                    </Col>
                </Row>
                :
                <Row className='justify-content-center'>
                    <Col md={10}>
                        <Button onClick={() => {
                            navi(`/login`);
                        }} className='w-100 mt-5'>로그인</Button>
                    </Col>
                </Row>
            }
            <ReplyListPage pid={id}/>
        </div>
    )
}

export default ReplyPage
