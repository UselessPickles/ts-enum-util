import React from 'react';
import { Context, useStore } from './useStore';
import Table from './components/Table';
import Drawer from './components/addOreditDrawer';
import GameModal from './components/gameModal';

export default () => {
  const store = useStore();
  return (
    <Context.Provider value={store}>
      <Table />
      <Drawer />
      <GameModal />
    </Context.Provider>
  );
};
