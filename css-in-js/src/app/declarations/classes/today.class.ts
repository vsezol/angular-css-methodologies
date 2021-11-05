export class Today {
  private readonly date: Date = new Date();

  public get start(): Date {
    const copiedDate: Date = new Date(this.date);
    copiedDate.setUTCHours(0, 0, 0, 0);
    return copiedDate;
  }

  public get end(): Date {
    const copiedDate: Date = new Date(this.date);
    copiedDate.setUTCHours(23, 59, 59, 999);
    return copiedDate;
  }
}
