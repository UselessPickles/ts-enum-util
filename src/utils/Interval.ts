export default class Interval {
  protected switch: boolean = false;
  protected interval: number;
  public onPoll?: () => void;

  constructor(ms: number) {
    this.interval = ms;
  }

  public run() {
    this.switch = true;
    this.poll();
  }

  public stop() {
    this.switch = false;
  }

  private poll() {
    if (this.switch) {
      this.onPoll?.();
      setTimeout(() => this.poll(), this.interval);
    }
  }
}
