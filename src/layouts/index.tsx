import React, { useState } from 'react';
import styles from './index.css';
import LoginContext from '@/hooks/useLogin';

const BasicLayout: React.FC = (props) => {
  // const { loginStatus } = LoginContext.useContainer()
  // console.log('loginStatus:', loginStatus)
  return (
    <LoginContext.Provider>
      <div className={styles.normal}>
        <h1 className={styles.title}>Yay! Welcome to umi!</h1>
        {props.children}
      </div>
    </LoginContext.Provider>
  );
};

export default BasicLayout;
