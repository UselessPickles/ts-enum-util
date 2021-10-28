import { Context, useStore } from './useStore';
import Table from './components/Table';
import Modal from './components/addOreditDrawer';

export default () => {
  const store = useStore();
  return (
    <Context.Provider value={store}>
      <Table />
      <Modal />
    </Context.Provider>
  );
};
