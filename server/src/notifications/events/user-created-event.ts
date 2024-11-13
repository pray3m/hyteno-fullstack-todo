export class UserCreatedEvent {
  constructor(
    public readonly userId: number,
    public readonly name: string,
    public readonly email: string,
  ) {}
}
