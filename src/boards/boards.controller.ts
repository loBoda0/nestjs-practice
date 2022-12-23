import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/boards-status-validation/boards-status-validation.pipe';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

 /*  @Get()
  getAllBoards() {
    return this.boardsService.getAllBoards()
  }*/

  @Get()
  getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards()
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number, @GetUser() user: User): Promise<Board> {
    return this.boardsService.getBoardById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe) 
  createBoard(
    @Body() createBoardDto : CreateBoardDto,
    @GetUser() user: User
  ): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id')id: number,
    @Body('status', BoardStatusValidationPipe)status: BoardStatus,
    @GetUser() user: User
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status, user)
  }

  /* @Get('/:id')
  getBoardById(@Param('id') id: string): Board {
    return this.boardsService.getBoardById(id)
  }

  @Post()
  @UsePipes(ValidationPipe) 
  createBoard(
    @Body() createBoardDto : CreateBoardDto
  ): Board {
    return this.boardsService.createBoard(createBoardDto)
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id')id: string,
    @Body('status', BoardStatusValidationPipe)status: BoardStatus
  ): Board {
    return this.boardsService.updateBoardStatus(id, status)
  }
  
  @Delete('/:id')
  deleteBoard(@Param('id') id: string): void {
    this.boardsService.deleteBoard(id)
  } */
}
