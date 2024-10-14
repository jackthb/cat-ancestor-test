import { Injectable } from '@nestjs/common';
import * as data from '../../data.json';

@Injectable()
export class CommsService {
  getNextDelivery(userId: string): {
    title: string;
    message: string;
    totalPrice: number;
    freeGift: boolean;
  } {
    const user = data.find((u: User) => u.id === userId);

    if (!user) {
      throw new Error(`User not found`);
    }

    const cats = user.cats.filter((c: Cat) => c.subscriptionActive);

    if (cats.length === 0) {
      throw new Error(`No active cats found`);
    }

    const catNames = this.formatCatNames(cats);

    const message = `Hey ${user.firstName}! In two days' time, we'll be charging you for your next order for ${catNames}'s fresh food.`;

    const totalPrice = cats.reduce(
      (acc: number, c: Cat) => acc + this.getCatPrice(c),
      0,
    );

    const freeGift = totalPrice > 120;

    return {
      title: `Your next delivery for ${catNames}`,
      message,
      totalPrice,
      freeGift,
    };
  }

  private formatCatNames(cats: Cat[]): string {
    return new Intl.ListFormat('en', {}).format(cats.map((c) => c.name));
  }

  private getCatPrice(cat: Cat): number {
    switch (cat.pouchSize) {
      case 'A':
        return 55.5;
      case 'B':
        return 59.5;
      case 'C':
        return 62.75;
      case 'D':
        return 66.0;
      case 'E':
        return 69.0;
      case 'F':
        return 71.25;
      default:
        throw new Error(`Invalid pouch size: ${cat.pouchSize}`);
    }
  }
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cats: Cat[];
}

interface Cat {
  name: string;
  subscriptionActive: boolean;
  breed: string;
  pouchSize: string;
}
