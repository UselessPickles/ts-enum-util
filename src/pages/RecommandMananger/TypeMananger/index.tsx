import React from 'react';
import { Context, useStore } from './useStore';
import Table from './components/Table';
import Drawer from './components/addOreditDrawer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameModal from './components/gameModal';

export default () => {
  const store = useStore();
  return (
    <Context.Provider value={store}>
      <DndProvider backend={HTML5Backend}>
        <Table />
        <Drawer />
        <GameModal />
      </DndProvider>
    </Context.Provider>
  );
};
