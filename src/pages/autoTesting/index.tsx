import React from 'react';
import { Context, useStore } from './useStore';
import Table from './components/Table';
import Modal from './components/Modal';

export default () => {
  const store = useStore();
  return (
    <Context.Provider value={store}>
      <Table />
      <Modal />
    </Context.Provider>
  );
};
