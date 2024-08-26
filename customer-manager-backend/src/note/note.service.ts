import { Injectable } from "@nestjs/common";
import { Note } from "./entities/note.entity";
import { NoteRepository } from "./note.reposity";
import { BaseService } from "src/core/base/base.service";

@Injectable()
export class NoteService extends BaseService<Note, NoteRepository> {
    constructor(protected noteRepository: NoteRepository) {
        super(noteRepository);
      }
    
      protected enable_trash = true;
}