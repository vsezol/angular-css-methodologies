export class Today {
  private readonly date: Date = new Date();

  public get start(): Date {
    return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 0, 0, 0, 0);
  }

  public get end(): Date {
    return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 23, 59, 59, 999);
  }
}
