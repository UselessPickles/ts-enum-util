import React from 'react';
import { Context, useStore } from './useStore';
import Table from './components/Table';
import Modal from './components/addOreditDrawer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default () => {
  const store = useStore();
  return (
    <Context.Provider value={store}>
      <DndProvider backend={HTML5Backend}>
        <Table />
        <Modal />
      </DndProvider>
    </Context.Provider>
  );
};
