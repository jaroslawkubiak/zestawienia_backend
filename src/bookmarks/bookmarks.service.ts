import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmarks.entity';
import { IBookmarksWithTableColumns } from './types/IBookmarksWithTableColumns';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarksRepo: Repository<Bookmark>,
  ) {}

  findAll(): Promise<IBookmarksWithTableColumns[]> {
    return this.bookmarksRepo.find();
  }
}
