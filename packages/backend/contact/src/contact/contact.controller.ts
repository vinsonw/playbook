import fsp from 'fs/promises';
import fs from 'fs';

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
  ParseIntPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

const UPLOAD_ROOT_DIR = 'upload-results';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: UPLOAD_ROOT_DIR,
    }),
  )
  async handleUploadFile(
    @Body() body: CreateContactDto,
    // !this has an `s` at the end, or you will be sorry
    @UploadedFiles() fileList: Array<Express.Multer.File>,
  ) {
    console.log('[handleUploadFile] body', body);
    const { uploadStrategy = 'whole' } = body;
    console.log('[handleUploadFile] uploadStrategy', uploadStrategy);
    console.log('[handleUploadFile] got fileList', fileList);

    for (const file of fileList) {
      switch (uploadStrategy) {
        case 'slice-and-merge': {
          const fileName = body.name;
          const destFileFolder = `${UPLOAD_ROOT_DIR}/chunks_${fileName}`;
          const destFilePath = `${destFileFolder}/${body.index}`;
          await fsp.mkdir(destFileFolder, { recursive: true });
          await fsp.copyFile(file.path, destFilePath);
          await fsp.unlink(file.path);
          return body;
        }
        case 'whole': {
          // console.log('whole file', file);
          const fileName = body.name || file.originalname;
          const destFileFolder = UPLOAD_ROOT_DIR;
          const destFilePath = `${UPLOAD_ROOT_DIR}/${fileName}`;
          // console.log('destFilePath', destFilePath)
          await fsp.mkdir(destFileFolder, { recursive: true });
          await fsp.copyFile(file.path, destFilePath);
          await fsp.unlink(file.path);
          break;
        }
        default: {
          throw new Error('Unrecognized update strategy:' + uploadStrategy);
        }
      }
    }
  }

  @Get('merge')
  merge(@Query('name') name: string) {
    const chunkDir = `${UPLOAD_ROOT_DIR}/chunks_` + name;
    const files = fs.readdirSync(chunkDir).sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return aNum - bNum;
    });

    let count = 0;
    let startPos = 0;
    files.map((file) => {
      const filePath = chunkDir + '/' + file;
      // for every file slice, create a read stream then pipe into the same
      // write stream with different start position
      const readStream = fs.createReadStream(filePath);
      readStream
        .pipe(
          fs.createWriteStream(UPLOAD_ROOT_DIR + '/' + name, {
            start: startPos,
          }),
        )
        .on('finish', () => {
          count++;
          if (count === files.length) {
            fs.rm(chunkDir, { recursive: true }, () => {
              console.log('merging finished, chunk folder deleted');
            });
          }
        });
      startPos += fs.statSync(filePath).size;
    });
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
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    // return this.contactService.findOne(+id);
    console.log('id', id + 1);
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
