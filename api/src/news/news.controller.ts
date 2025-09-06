import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchNewsDto } from './dto/search-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova notícia' })
  @ApiResponse({ status: 201, description: 'Notícia criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as notícias (admin)' })
  @ApiResponse({ status: 200, description: 'Lista de notícias' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Termo de busca' })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], description: 'Filtrar por status' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() searchDto: SearchNewsDto) {
    return this.newsService.findAll(searchDto);
  }

  @Get('published')
  @ApiOperation({ summary: 'Listar notícias publicadas (público)' })
  @ApiResponse({ status: 200, description: 'Lista de notícias publicadas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPublished(@Query() paginationDto: PaginationDto) {
    return this.newsService.findAllPublished(paginationDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar notícias por termo' })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  search(@Query() searchDto: SearchNewsDto) {
    return this.newsService.search(searchDto.q, {
      page: searchDto.page,
      limit: searchDto.limit,
    });
  }

  @Get('tag/:tag')
  @ApiOperation({ summary: 'Listar notícias por tag' })
  @ApiResponse({ status: 200, description: 'Notícias com a tag especificada' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByTag(
    @Param('tag') tag: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.newsService.findByTag(tag, paginationDto);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Listar notícias por categoria' })
  @ApiResponse({ status: 200, description: 'Notícias da categoria especificada' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByCategory(
    @Param('category') category: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.newsService.findByCategory(category, paginationDto);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Listar notícias mais visualizadas' })
  @ApiResponse({ status: 200, description: 'Lista de notícias populares' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de notícias a retornar' })
  getPopularNews(@Query('limit') limit?: number) {
    return this.newsService.getPopularNews(limit);
  }

  @Get('categories/stats')
  @ApiOperation({ summary: 'Obter estatísticas de categorias' })
  @ApiResponse({ status: 200, description: 'Contagem de notícias por categoria' })
  getCategoryStats() {
    return this.newsService.getCategoryStats();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obter notícia por slug' })
  @ApiResponse({ status: 200, description: 'Notícia encontrada' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter notícia por ID' })
  @ApiResponse({ status: 200, description: 'Notícia encontrada' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar notícia' })
  @ApiResponse({ status: 200, description: 'Notícia atualizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Incrementar visualizações da notícia' })
  @ApiResponse({ status: 200, description: 'Visualizações incrementadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  incrementViews(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const clientIp = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
    return this.newsService.incrementViews(id, clientIp);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir notícia' })
  @ApiResponse({ status: 204, description: 'Notícia excluída com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
