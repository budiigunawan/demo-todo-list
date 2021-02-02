import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import { Spin, List, Divider, Button, Form, Input } from 'antd';
import './App.css';
import styled from 'styled-components';

import {
  DeleteFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

// Custom CSS Component Start //
const TitleApp = styled.h2`
  color: whitesmoke;
`;

const ListCustom = styled(List)`
  margin: 20px;
  max-width: 750px;
`;

const TaskName = styled.p`
  color: whitesmoke;
`;

const ButtonContainer = styled.div`
  margin-left: 240px;
`;

const DeleteButton = styled(Button)`
  margin-left: 8px;
`;
// Custom CSS Component End //

function App() {
  const [taskList, setTaskList] = useState(null); //Ini state untuk data-data task
  const [loading, setLoading] = useState(false); //Ini state untuk loading
  const [trigger, setTrigger] = useState(false); //Ini state untuk trigger fetch data
  const [form] = Form.useForm();

  // useEffect akan dijalankan saat pertama kali render dan saat trigger berubah nilai
  useEffect(() => {
    //munculkan loading
    setLoading(true);

    //get data task dari backend
    axios
      .get('http://localhost:3001/tasks')
      .then((res) => {
        // jika berhasil masukan data ke state tasklist dan hilangkan loading
        setTaskList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // jika gagal console log pesan error dan hilangkan loading
        console.log(err);
        setLoading(false);
      });
  }, [trigger]);

  // function untuk handle submit new task
  const onFinish = ({ taskName }) => {
    // masukan parameter taskName dari input ke variabel newTask
    let newTask = { name: taskName, done: false };

    // POST variabel newTask ke backend
    axios
      .post('http://localhost:3001/tasks', newTask)
      .then((res) => {
        // Jika berhasil reset form dan nyalakan trigger agar get data terbaru
        console.log(res.statusText);
        form.resetFields();
        setTrigger(!trigger);
      })
      .catch((err) => {
        // Jika gagal console log pesan error
        console.log(err);
      });
  };

  // function untuk update done
  const handleUpdate = (taskId, taskName, taskDone) => {
    // // masukkan parameter taskName ke variabel editedTask, ubah status done jadi true
    let editedTask = { name: taskName, done: !taskDone };

    // PUT variabel editedTask ke backend
    axios
      .put(`http://localhost:3001/tasks/${taskId}`, editedTask)
      .then((res) => {
        // Jika berhasil update nyalakan trigger
        console.log(res.statusText);
        setTrigger(!trigger);
      })
      .catch((err) => {
        // Jika gagal console log pesan error
        console.log(err);
      });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <Divider orientation='center'>
          <TitleApp>Todo List App</TitleApp>
        </Divider>

        {/* Component Form Input Task Start */}
        <Form form={form} onFinish={onFinish} layout='inline'>
          <Form.Item
            label={<label style={{ color: 'whitesmoke' }}>Task Name</label>}
            name='taskName'
            rules={[{ required: true, message: 'Please input task name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        {/* Component Form Input Task End */}

        {/* Component Read All Tasks Start */}
        {loading ? (
          <Spin />
        ) : (
          taskList && (
            <ListCustom
              itemLayout='horizontal'
              dataSource={taskList}
              renderItem={(item) => (
                <ListCustom.Item>
                  <TaskName
                    style={{
                      textDecoration:
                        item.done === true ? 'line-through' : null,
                    }}
                  >
                    {item.name}
                  </TaskName>
                  <ButtonContainer>
                    <Button
                      type={item.done ? 'default' : 'primary'}
                      title={item.done ? 'undone' : 'done'}
                      onClick={() => {
                        handleUpdate(item.id, item.name, item.done);
                      }}
                      loading={loading}
                    >
                      {item.done ? (
                        <CloseCircleOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      )}
                    </Button>
                    <DeleteButton
                      type='primary'
                      title='delete'
                      onClick={() => {
                        console.log(`${item.id} delete`);
                      }}
                      danger
                      loading={loading}
                    >
                      <DeleteFilled />
                    </DeleteButton>
                  </ButtonContainer>
                </ListCustom.Item>
              )}
            />
          )
        )}
        {/* Component Read All Tasks End */}
      </header>
    </div>
  );
}

export default App;
