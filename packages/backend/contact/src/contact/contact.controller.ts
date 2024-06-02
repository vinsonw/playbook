import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'upload-results/',
    }),
  )
  handleUploadFile(
    @Body() createContactDto: CreateContactDto,
    // !this has an `s` at the end, or you will be sorry
    @UploadedFiles() fileList: Array<Express.Multer.File>,
  ) {
    console.log('[handleUploadFile] got fileList', fileList);
    return `received: ${JSON.stringify(createContactDto)}`;
  }

  // parse form-urlencoded data from the body
  @Post('url-encoded')
  parseBody(@Body() createContactDto: CreateContactDto) {
    // return this.contactService.create(createContactDto);
    console.log('createContactDto', createContactDto);
    return `received: ${JSON.stringify(createContactDto)}`;
  }

  // parse json data from the body
  @Post('json')
  parseJson(@Body() createContactDto: CreateContactDto) {
    // return this.contactService.create(createContactDto);
    console.log('createContactDto', createContactDto);
    return createContactDto;
  }

  // parse query string
  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    // return this.contactService.findOne(+id);
    return `received: name=${name} age=${age}`;
  }

  // parse url param
  @Get('url-param/:id')
  findOne(@Param('id') id: string) {
    // return this.contactService.findOne(+id);
    return `received: id=${id}`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
