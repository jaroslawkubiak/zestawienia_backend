import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepo: Repository<Setting>,
  ) {}

  getSetNumber(): Promise<Setting[]> {
    return this.settingsRepo.find({
      where: {
        type: 'setNumber',
      },
    });
  }

  async increaseSetNumber(): Promise<number> {
    const res: Setting[] = await this.getSetNumber();

    if (!res.length) {
      throw new Error('Brak wartości w bazie');
    }

    let currentNumber = Number(res[0].value);
    let setNumberId = res[0].id;

    const newSetNumber = currentNumber + 1;

    await this.settingsRepo.update(setNumberId, {
      value: newSetNumber.toString(),
    });

    return newSetNumber;
  }
}
