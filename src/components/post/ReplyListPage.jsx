import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, collection, query, orderBy, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import TextareaAutosize from 'react-textarea-autosize';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Row, Col, Button, Form } from 'react-bootstrap'

const ReplyListPage = ({ pid }) => {
    const login = sessionStorage.getItem('email');
    const db = getFirestore(app);
    const [list, setList] = useState([]);

    const getList = async () => {
        const q = query(collection(db, 'reply'), where('pid', '==', pid), orderBy('date', 'desc'));
        await onSnapshot(q, snapshot => {
            let rows = [];
            snapshot.forEach(row => {
                rows.push({ id: row.id, ...row.data() });
            });
            const data = rows.map(row => row && { ...row, ellipsis: true, edit: false, text: row.contents });
            setList(data);
        });
    }

    useEffect(() => { getList() }, []);

    const onClickContents = (id) => {
        const data = list.map(reply => reply.id === id ?
            { ...reply, ellipsis: !reply.ellipsis } : reply);
        setList(data);
    }

    const onClickUpdate = (id) => {
        const data = list.map(reply => reply.id === id ?
            { ...reply, edit: !reply.edit } : reply);
        setList(data);
    }

    const onChangeContents = (id, e) => {
        const data = list.map(reply => reply.id === id ?
            { ...reply, contents: e.target.value } : reply);
        setList(data);
    }

    const onClickCancel = (r) => {
        const data = list.map(reply => reply.id === r.id ?
            { ...reply, edit: false, contents: reply.text } : reply);
        setList(data);
    }

    // 저장 버튼 클릭 시 실행될 함수
    const onClickSave = async (reply) => {
        const ref = doc(db, 'reply', reply.id);
        await updateDoc(ref, { contents: reply.contents });

        // 상태 갱신 (edit 모드 끄고, 원본 text도 업데이트)
        const updatedList = list.map(r =>
            r.id === reply.id
                ? { ...r, edit: false, text: reply.contents }
                : r
        );
        setList(updatedList);
    }

    const onClickDelete = async (id) => {
        const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
        if (!confirmDelete) return;

        await deleteDoc(doc(db, 'reply', id));

        // 상태에서 해당 댓글 제거
        const updatedList = list.filter(reply => reply.id !== id);
        setList(updatedList);
    }

    return (
        <Row className='justify-content-center mt-5'>
            <Col md={10}>
                {list.map(reply =>
                    <div key={reply.id} className='my-5'>
                        <Row>
                            <Col className='text-muted'>
                                {reply.date}:{reply.email}
                            </Col>
                            {reply.email === login && !reply.edit &&
                                <Col className='text-end '>
                                    <CiEdit onClick={() => onClickUpdate(reply.id)} className='edit' style={{ cursor: 'pointer' }} />
                                    <MdDeleteOutline onClick={() => onClickDelete(reply.id)} className='delete' style={{ cursor: 'pointer' }} aria-autocomplete='' />
                                </Col>
                            }
                        </Row>
                        {reply.edit ?
                            <Form>
                                <TextareaAutosize className='textarea'
                                    onChange={(e) => onChangeContents(reply.id, e)}
                                    value={reply.contents} />
                                <div className='text-end'>
                                    <Button onClick={() => onClickSave(reply)} size='sm' variant='primary' className='mx-2'
                                        disabled={reply.text === reply.contents}>저장</Button>
                                    <Button onClick={() => onClickCancel(reply)}
                                        size='sm' variant='secondary'>취소</Button>
                                </div>
                            </Form>
                            :
                            <div onClick={() => onClickContents(reply.id)}
                                className={reply.ellipsis ? 'ellipsis2' : ''}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{reply.contents}</p>
                            </div>
                        }
                    </div>
                )}
            </Col>
        </Row>
    )
}

export default ReplyListPage
