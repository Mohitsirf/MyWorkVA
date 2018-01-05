/**
 * Created by ishan on 28.9.17.
 */

export class TimeCompare {
  public static compare(ob1, ob2): any {
    let match: any = ob1.updated_at.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    const Date1: any = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
    match = ob2.updated_at.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    const Date2: any = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
    const first = new Date(Date1);
    const second = new Date(Date2);
    if (first > second) {
      return -1;
    }
    if (first < second) {
      return 1;
    }
    return 0;
  }
}
