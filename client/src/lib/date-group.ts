import { format, getMonth, getWeek } from "date-fns";

interface DateBased {
  date: string | Date;
  [key: string]: unknown;
}

export default class DateGrouper<T extends DateBased> {
  private items: T[];
  private key: string;

  constructor(items: T[], key: string) {
    this.items = items;
    this.key = key;
  }

  private formatDate(date: Date): string {
    return format(date, "dd/MM/yyyy");
  }

  private getMonthLabel(date: Date): string {
    return format(date, "MMMM yyyy");
  }

  private getWeekLabel(date: Date): string {
    const weekNumber = getWeek(date);
    const month = format(date, "MMMM");
    return `${month} Week ${weekNumber}`;
  }

  private filterByDay(targetDate: Date): T[] {
    const formattedTarget = this.formatDate(targetDate);
    return this.items.filter(
      (item) => this.formatDate(new Date(item.date)) === formattedTarget
    );
  }

  private filterByWeek(targetDate: Date): T[] {
    const weekNumber = getWeek(targetDate);
    return this.items.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        getMonth(itemDate) === getMonth(targetDate) &&
        getWeek(itemDate) === weekNumber
      );
    });
  }

  private filterByMonth(targetDate: Date): T[] {
    return this.items.filter(
      (item) => getMonth(new Date(item.date)) === getMonth(targetDate)
    );
  }

  public group<K extends keyof T>(
    groupType: "daily" | "weekly" | "monthly",
    how: "sum" | "average" | "count"
  ): Array<Record<K, number | string>> {
    const aggregator = (items: T[]): number => {
      switch (how) {
        case "sum":
          return items.reduce((sum, item) => {
            const value = item[this.key];
            return sum + (typeof value === "number" ? value : 0);
          }, 0);
        case "average":
          if (items.length === 0) return 0;
          const total = items.reduce((sum, item) => {
            const value = item[this.key];
            return sum + (typeof value === "number" ? value : 0);
          }, 0);
          return Number((total / items.length).toFixed(2));
        case "count":
          return items.length;
      }
    };

    const grouped = this.items.map((item) => {
      const date = new Date(item.date);
      let filteredItems: T[];
      let dateLabel: string;

      switch (groupType) {
        case "daily":
          filteredItems = this.filterByDay(date);
          dateLabel = this.formatDate(date);
          break;
        case "weekly":
          filteredItems = this.filterByWeek(date);
          dateLabel = this.getWeekLabel(date);
          break;
        case "monthly":
          filteredItems = this.filterByMonth(date);
          dateLabel = this.getMonthLabel(date);
          break;
      }

      return {
        date: dateLabel,
        [this.key]: aggregator(filteredItems),
      };
    });

    // Remove duplicates and sort
    return Array.from(
      new Map(grouped.map((item) => [item.date, item])).values()
    ).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ) as Record<K, string | number>[];
  }
}
