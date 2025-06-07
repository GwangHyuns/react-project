import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';

const UpdatePage = () => {
    const [loading, setLoading] = useState(false);
    const navi = useNavigate();
    const db = getFirestore(app);
    const params = useParams();
    const {id} = params;
    const [form, setForm] = useState('');

    const getPost = async () => {
        setLoading(true);
        const snapshot = await getDoc(doc(db, 'post', id));
        const post = snapshot.data();
        setForm({...post, preTitle:post.title, preBody:post.body});        
        setLoading(false);
    }

    const {title, body, preTitle, preBody, email, date} = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const onReset = () => {        
        if(window.confirm('정말로 취소하시겠습니까?')) {
            getPost();            
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(window.confirm('정말로 수정하시겠습니까?')) {            
            const post = {email, body, title, date};
            await setDoc(doc(db, 'post', id), post);
            //navi(`/post/${id}`);
            navi(-1);
        }
    }

    useEffect(() => { getPost() }, []);

    if (loading) return <h1 className='my-5 text-center'>로딩중.....</h1>
    
    return (
        <div>
            <h1 className='my-5 text-center'>게시글수정</h1>
            <Row className='justify-content-center'>
                <Col md={10}>
                    <Form onReset={onReset} onSubmit={onSubmit}>
                        <Form.Control name='title' onChange={onChange} value={title} className='mb-2'/>
                        <Form.Control name='body' onChange={onChange} value={body} as='textarea' rows={10}/>
                        <div className='text-center mt-3'>
                            <Button type='submit' disabled={title===preTitle&&body===preBody} className='px-5 me-2'>저장</Button>
                            <Button type='reset' disabled={title===preTitle&&body===preBody} className='px-5' variant='secondary'>취소</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default UpdatePage
