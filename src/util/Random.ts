

export default class Random{

  public static roll(min: number, max?: number) : number {
    if (max == null) {
      max = min;
      min = 1;
    }
    return Math.floor(Math.random() * ((max + 1) - min)) + min
  }

  public static pick <T> (list: Array<T>) : T {
    return list[Math.floor(Math.random() * list.length)]
  }

}
