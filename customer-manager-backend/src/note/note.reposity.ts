import { CustomRepository } from "src/core/decorator/repository.decorator";
import { Note } from "./entities/note.entity";
import { BaseRepository } from "src/core/base/base.repository";
import { OrderType } from "src/core/type/query";

@CustomRepository(Note)
export class NoteRepository extends BaseRepository<Note> {
    protected qbName = 'Note';

    protected orderBy = { name: 'updatedAt', order: OrderType.DESC };

    protected relations = ['customer'];

}