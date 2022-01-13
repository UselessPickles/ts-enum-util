import { MessageQueue, Subscriber } from '.';

export default class CacheMessageQueue<Subject extends any[]> implements MessageQueue<Subject> {
  subscribers: Subscriber<Subject>[] = [];
  cache!: Subject;

  publish(...subject: Subject) {
    this.cache = subject;
    this.subscribers?.forEach((subscriber) => subscriber?.onMessage?.(...subject));
  }

  subscribe(subscriber: Subscriber<Subject>) {
    if (this.cache) {
      subscriber?.onMessage?.(...this.cache);
    }
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber<Subject>) {
    this.subscribers = this.subscribers?.filter((sub) => sub !== subscriber);
  }
}
