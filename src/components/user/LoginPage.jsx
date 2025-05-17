import React, { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

const LoginPage = () => {
    const baseName = process.env.PUBLIC_URL;
    const [form, setForm] = useState({
        email: 'blue@inha.com',
        pass: '12341234'
    });
    const { email, pass } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        //유효성체크
        if (email === '' || pass === '') {
            alert('이메일이나 패스워드를 입력하세요.');
        } else {
            //로그인 체크
        }
    }

    return (
        <div>
            <Row className='my-5 justify-content-center text-center'>
                <Col lg={4} md={6} xs={8}>
                    <Card>
                        <Card.Header>
                            <h5>로그인</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={onSubmit}>
                                <Form.Control onChange={onChange} value={email} placeholder='email' className='mb-2' name='email' />
                                <Form.Control onChange={onChange} type='password' value={pass} placeholder='password' className='mb-2' name='pass' />
                                <Button type='submit' className='w-100'>로그인</Button>
                            </Form>
                            <div className='text-end my-2'>
                                <a href={`${baseName}/join`}>회원가입</a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default LoginPage
