import Interval from '@/utils/Interval';
import sleep from '@/utils/sleep';
import Table from './components/Table';

export default () => {
  const inv = new Interval(1000);

  return (
    <div
      onClick={async () => {
        sleep(10000).then(() => {
          console.log('10000');
          inv.stop();
          return 10000;
        });

        inv.onPoll = () => {
          console.log('onPoll');
        };
        inv.run();
      }}
    >
      lab
    </div>
  );
};
