import React from 'react';
import { Context, useStore } from './useStore';
import Table from './components/Table';
import Modal from './components/addOReditModal';
import GameModal from './components/gameModal';

export default () => {
  const store = useStore();
  return (
    <Context.Provider value={store}>
      <Table />
      <Modal />
      <GameModal />
    </Context.Provider>
  );
};
