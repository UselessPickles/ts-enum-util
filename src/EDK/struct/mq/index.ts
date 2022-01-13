export interface MessageQueue<Subject extends any[]> {
  subscribers: Subscriber<Subject>[];
  publish(...subject: Subject): void;
  subscribe(subscriber: Subscriber<Subject>): void;
  unsubscribe(subscriber: Subscriber<Subject>): void;
}

export interface Subscriber<Subject extends any[]> {
  onMessage: (...subject: Subject) => void;
}

export interface Publisher<Subject extends any[]> {
  publish: (...subject: Subject) => void;
}
