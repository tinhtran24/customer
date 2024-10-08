import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateNoteDto } from "./dto/create-task.dto";
import { UpdateNoteDto } from "./dto/update-task.dto";
import { NoteService } from "./note.service";
import { BaseController } from "src/core/base/base.controller";
import { PaginateDto } from "../core/base/base.dto";

@Crud({
    id: 'note',
    enabled: [
        { name: 'list', options: { allowGuest: false } },
        { name: 'detail', options: { allowGuest: false } },
        'store',
        'update',
        'delete',
        'restore',
        'deleteMulti',
        'restoreMulti',
    ],
    dtos: {
        create: CreateNoteDto,
        update: UpdateNoteDto,
    },
})
@Controller('note')
@ApiTags('Note API')
@ApiBearerAuth()
export class NoteController  extends BaseController<NoteService> {
    constructor(protected noteService: NoteService) {
        super(noteService);
    }

    @Get('customer/:id')
    async getByCustomerId(
        @Param('id', new ParseUUIDPipe())
            item: string,
        @Query() options: PaginateDto
    ) {
        return this.noteService.getByCustomerId(item, options);
    }
}