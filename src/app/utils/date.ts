export class DateUtils {
  static dateFromString(dateString: string): Date {
    const match: any = dateString.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    return new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
  }

  static timestampFromString(dateString: string): number {
    return DateUtils.dateFromString(dateString).getTime() / 1000;
  }
}
