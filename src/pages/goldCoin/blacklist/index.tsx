import Modal from './Modal';
import Table from './Table';
import { Context, useStore } from './useStore';

export default () => {
  const store = useStore();
  return (
    <Context.Provider value={store}>
      <Table />
      <Modal />
    </Context.Provider>
  );
};
