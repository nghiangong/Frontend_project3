import React, { useEffect } from 'react'
import { Button, Form, Input, message, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { TOKEN_ADMIN } from '../../../utils/constant/data';
import { CHECK_ID_BOOK_REDUCER } from '../../../redux/type/BookType';

export default function GiveBook() {

    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    /* eslint-enable no-template-curly-in-string */

    useEffect(() => {
        if (!localStorage.getItem(TOKEN_ADMIN)) {
            navigate('/login', { replace: true })
        }
    }, [])

    const onFinish = (values) => {
        //check id book
        dispatch({
            type: 'CHECK_BOOK_ID',
            data: values.idBook
        })
        console.log("check id book 1 = "+ localStorage.getItem('checkIdBook'))
        //send data check status give book
        dispatch({
            type: 'GIVE_BOOK',
            data: values
        })
        console.log("check give_book 1 =" + localStorage.getItem('giveBookStatus'))
        setTimeout(() => {
            console.log("onConfirm")
            confirm()
            
        }, 500)
    };

    const confirm = (e) => {
        
        console.log("check id book 2 = "+ localStorage.getItem('checkIdBook'))
        console.log("check give_book 2 =" + localStorage.getItem('giveBookStatus'))
        if (localStorage.getItem('giveBookStatus') === 'true') {
            message.success('Thành công trả sách!');
        } else if (localStorage.getItem('giveBookStatus') === 'returned') {
            message.error('Lỗi server: sách đã được trả trước đó rồi!')
        } else if (localStorage.getItem('checkIdBook') === 'false')  {
            message.error('Quyển sách này đã được mượn hoặc không tồn tại id của quyển sách này!')
        }
        setTimeout(() => {
            dispatch({
                type: CHECK_ID_BOOK_REDUCER,
                data: null
            })
            localStorage.removeItem('giveBookStatus')
        }, 500)
    };

    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };

    const cancel = (e) => {
        message.error('Chưa xác nhận!');
    };


    return (
        <div>
            <h3 style={{ textAlign: 'left', marginLeft: '50px', fontSize: '29px' }}>
                Quản lý trả sách từ người dùng
            </h3>
            <Form
                form={form}
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{
                    maxWidth: 880,
                    marginTop: '100px'
                }}
                validateMessages={validateMessages}
            >
                <Form.Item
                    name='idBook'
                    label="Id sách"
                    rules={[
                        {
                            required: true,
                            pattern: new RegExp(/^[0-9]+$/),
                            message: 'Xin hãy nhập id sách bằng số!'
                        },
                    ]}
                    style={{ height: '40px' }}
                >
                    <Input style={{ marginLeft: '15px' }} />
                </Form.Item>
                <span style={{ color: 'green', marginLeft: '-30px' }}>Chú ý: Id sách tham khảo ở trang 'Danh sách các quyển sách'</span>
                <Form.Item
                    wrapperCol={{
                        ...layout.wrapperCol,
                        offset: 8,
                    }}
                    style={{ marginTop: '20px' }}
                >
                    <Popconfirm
                        title="Xác nhận trả sách"
                        description="Bạn có chắc chắn cho trả sách?"
                        onConfirm={(e) => {
                            form.submit()
                        }
                        }
                        onCancel={cancel}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Popconfirm>
                </Form.Item>
            </Form>

        </div>
    )
}