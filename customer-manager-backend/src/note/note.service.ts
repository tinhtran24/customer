import { Injectable } from "@nestjs/common";
import { Note } from "./entities/note.entity";
import { NoteRepository } from "./note.reposity";
import { BaseService } from "src/core/base/base.service";
import { PaginateDto } from "../core/base/base.dto";

@Injectable()
export class NoteService extends BaseService<Note, NoteRepository> {
    constructor(protected noteRepository: NoteRepository) {
        super(noteRepository);
      }
    
      protected enable_trash = true;

    async getByCustomerId(customerId: string, options: PaginateDto) {
        return this.repository.findPaginate(options, {
            customerId
        });
    }
}