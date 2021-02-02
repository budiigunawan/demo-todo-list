import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import { Spin, List, Divider, Button } from 'antd';
import './App.css';
import styled from 'styled-components';

import { DeleteFilled, CheckCircleOutlined } from '@ant-design/icons';

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
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <Divider orientation='center'>
          <TitleApp>Todo List App</TitleApp>
        </Divider>
        {loading ? (
          <Spin />
        ) : (
          taskList && (
            <ListCustom
              itemLayout='horizontal'
              dataSource={taskList}
              renderItem={(item) => (
                <ListCustom.Item>
                  <TaskName>{item.name}</TaskName>
                  <ButtonContainer>
                    <Button
                      type='primary'
                      onClick={() => {
                        console.log(`${item.name} done`);
                      }}
                    >
                      <CheckCircleOutlined />
                    </Button>
                    <DeleteButton
                      type='primary'
                      onClick={() => {
                        console.log(`${item.id} delete`);
                      }}
                      danger
                    >
                      <DeleteFilled />
                    </DeleteButton>
                  </ButtonContainer>
                </ListCustom.Item>
              )}
            />
          )
        )}
      </header>
    </div>
  );
}

export default App;
