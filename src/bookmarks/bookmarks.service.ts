import { Injectable } from '@nestjs/common';
import { Bookmark } from './bookmarks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBookmark } from './types/IBookmark';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarksRepo: Repository<Bookmark>,
  ) {}

  findAll(): Promise<IBookmark[]> {
    return this.bookmarksRepo.find();
  }
}
